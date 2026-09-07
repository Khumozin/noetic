import { Component, inject, Service, signal } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Data,
  NavigationEnd,
  Router,
} from '@angular/router';
import { HlmBreadcrumbImports } from '@neotic/helm/breadcrumb';
import { filter } from 'rxjs';

export interface BreadcrumbData {
  label: string;
  url: string;
}

@Service()
export class BreadcrumbService {
  private readonly _router = inject(Router);
  private readonly _breadcrumbs = signal<BreadcrumbData[]>([]);

  readonly breadcrumbs = this._breadcrumbs.asReadonly();

  constructor() {
    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const root = this._router.routerState.snapshot.root;
        const breadcrumbs = new Map<string, string>();
        this.addBreadcrumb(root, [], breadcrumbs);

        const _breadcrumbs = Array.from(
          breadcrumbs,
          ([label, url]) => ({ label, url }) satisfies BreadcrumbData,
        );

        this._breadcrumbs.set(_breadcrumbs);
      });
  }

  private addBreadcrumb(
    route: ActivatedRouteSnapshot | null,
    parentUrl: string[],
    breadcrumbs: Map<string, string>,
  ) {
    if (route) {
      const routeUrl = parentUrl.concat(route.url.map(url => url.path));

      if (route.data['breadcrumb']) {
        const breadcrumb = {
          label: this.getLabel(route.data),
          url: `/${routeUrl.join('/')}`,
        } satisfies BreadcrumbData;

        breadcrumbs.set(breadcrumb.label, breadcrumb.url);
      }

      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }

  private getLabel(data: Data) {
    return typeof data['breadcrumb'] === 'function'
      ? data['breadcrumb'](data)
      : data['breadcrumb'];
  }
}

@Component({
  imports: [HlmBreadcrumbImports],
  selector: 'app-breadcrumb',
  styles: ``,
  template: `
    <nav hlmBreadcrumb>
      <ol hlmBreadcrumbList>
        <li hlmBreadcrumbItem>
          <a hlmBreadcrumbLink link="/">Home</a>
        </li>

        @if (_breadcrumbService.breadcrumbs().length) {
          <li hlmBreadcrumbSeparator>|</li>
        }

        @for (
          item of _breadcrumbService.breadcrumbs();
          track item.label;
          let last = $last
        ) {
          @if (last) {
            <li hlmBreadcrumbItem>
              <span hlmBreadcrumbPage>{{ item.label }}</span>
            </li>
          } @else {
            <li hlmBreadcrumbItem>
              <a hlmBreadcrumbLink [link]="item.url">{{ item.label }}</a>
            </li>
            <li hlmBreadcrumbSeparator>|</li>
          }
        }
      </ol>
    </nav>
  `,
})
export class Breadcrumb {
  protected readonly _breadcrumbService = inject(BreadcrumbService);
}
