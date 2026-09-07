import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  UrlSegment,
} from '@angular/router';
import { Subject } from 'rxjs';
import { Breadcrumb, BreadcrumbService } from './breadcrumb';

function urlSegment(path: string): UrlSegment {
  return new UrlSegment(path, {});
}

function routeSnapshot(
  url: string[],
  data: Record<string, unknown>,
  firstChild: ActivatedRouteSnapshot | null = null,
): ActivatedRouteSnapshot {
  return {
    url: url.map(urlSegment),
    data,
    firstChild,
  } as ActivatedRouteSnapshot;
}

describe('BreadcrumbService', () => {
  let events: Subject<unknown>;
  let root: ActivatedRouteSnapshot;
  let service: BreadcrumbService;

  function setup(rootSnapshot: ActivatedRouteSnapshot) {
    root = rootSnapshot;
    events = new Subject();

    const routerStub = {
      events: events.asObservable(),
      routerState: {
        get snapshot() {
          return { root };
        },
      },
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerStub }],
    });

    service = TestBed.inject(BreadcrumbService);
  }

  function emitNavigationEnd() {
    events.next(new NavigationEnd(1, '/', '/'));
  }

  it('starts with no breadcrumbs', () => {
    setup(routeSnapshot([], {}));

    expect(service.breadcrumbs()).toEqual([]);
  });

  it('ignores routes without a breadcrumb data entry', () => {
    setup(routeSnapshot(['dashboard'], {}));

    emitNavigationEnd();

    expect(service.breadcrumbs()).toEqual([]);
  });

  it('builds a breadcrumb for a route with static breadcrumb data', () => {
    setup(routeSnapshot(['dashboard'], { breadcrumb: 'Dashboard' }));

    emitNavigationEnd();

    expect(service.breadcrumbs()).toEqual([
      { label: 'Dashboard', url: '/dashboard' },
    ]);
  });

  it('resolves a function breadcrumb using the route data', () => {
    const data = {
      breadcrumb: (d: Record<string, unknown>) => `Project ${d['id']}`,
      id: '42',
    };
    setup(routeSnapshot(['project', '42'], data));

    emitNavigationEnd();

    expect(service.breadcrumbs()).toEqual([
      { label: 'Project 42', url: '/project/42' },
    ]);
  });

  it('accumulates breadcrumbs across nested routes with joined urls', () => {
    const child = routeSnapshot(['42'], { breadcrumb: 'Project' });
    const rootSnapshot = routeSnapshot(
      ['projects'],
      { breadcrumb: 'Projects' },
      child,
    );

    setup(rootSnapshot);

    emitNavigationEnd();

    expect(service.breadcrumbs()).toEqual([
      { label: 'Projects', url: '/projects' },
      { label: 'Project', url: '/projects/42' },
    ]);
  });

  it('recomputes breadcrumbs on every NavigationEnd', () => {
    setup(routeSnapshot(['a'], { breadcrumb: 'A' }));

    emitNavigationEnd();
    expect(service.breadcrumbs()).toEqual([{ label: 'A', url: '/a' }]);

    root = routeSnapshot(['b'], { breadcrumb: 'B' });
    emitNavigationEnd();
    expect(service.breadcrumbs()).toEqual([{ label: 'B', url: '/b' }]);
  });
});

describe('Breadcrumb', () => {
  let fixture: ComponentFixture<Breadcrumb>;
  let breadcrumbService: {
    breadcrumbs: () => { label: string; url: string }[];
  };

  function setup(breadcrumbs: { label: string; url: string }[]) {
    breadcrumbService = { breadcrumbs: () => breadcrumbs };

    TestBed.configureTestingModule({
      imports: [Breadcrumb],
      providers: [
        { provide: BreadcrumbService, useValue: breadcrumbService },
        { provide: ActivatedRoute, useValue: {} },
      ],
    });

    fixture = TestBed.createComponent(Breadcrumb);
    fixture.detectChanges();
  }

  it('always renders a Home link', () => {
    setup([]);

    const homeLink = fixture.nativeElement.querySelector('a[href="/"]');
    expect(homeLink?.textContent?.trim()).toBe('Home');
  });

  it('renders no separator when there are no breadcrumbs', () => {
    setup([]);

    expect(
      fixture.nativeElement.querySelector('[hlmBreadcrumbSeparator]'),
    ).toBeNull();
  });

  it('renders intermediate breadcrumbs as links and the last as the current page', () => {
    setup([
      { label: 'Projects', url: '/projects' },
      { label: 'Project 42', url: '/projects/42' },
    ]);

    const links = Array.from(
      fixture.nativeElement.querySelectorAll('a[hlmBreadcrumbLink]'),
    ) as HTMLAnchorElement[];
    const page = fixture.nativeElement.querySelector('[hlmBreadcrumbPage]');

    expect(links.map(link => link.textContent?.trim())).toEqual([
      'Home',
      'Projects',
    ]);
    expect(links[1].getAttribute('href')).toBe('/projects');
    expect(page?.textContent?.trim()).toBe('Project 42');
  });

  it('renders a separator for each breadcrumb boundary', () => {
    setup([
      { label: 'Projects', url: '/projects' },
      { label: 'Project 42', url: '/projects/42' },
    ]);

    const separators = fixture.nativeElement.querySelectorAll(
      '[hlmBreadcrumbSeparator]',
    );

    expect(separators.length).toBe(2);
  });
});
