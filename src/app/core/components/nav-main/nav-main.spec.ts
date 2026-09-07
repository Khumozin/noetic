import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavMain } from './nav-main';

describe('NavMain', () => {
  let fixture: ComponentFixture<NavMain>;

  function setup(
    items: { title: string; url: string; icon?: string; items?: never[] }[],
  ) {
    TestBed.configureTestingModule({
      imports: [NavMain],
      providers: [provideRouter([])],
    });

    fixture = TestBed.createComponent(NavMain);
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
  }

  it('renders a menu item per entry', () => {
    setup([
      { title: 'Pages', url: '/pages' },
      { title: 'Assets', url: '/assets' },
    ]);

    const links = fixture.nativeElement.querySelectorAll(
      'a[hlmSidebarMenuButton]',
    );

    expect(links.length).toBe(2);
    expect(
      Array.from(links).map(link => (link as Element).textContent?.trim()),
    ).toEqual(['Pages', 'Assets']);
  });

  it('renders nothing when there are no items', () => {
    setup([]);

    const links = fixture.nativeElement.querySelectorAll(
      'a[hlmSidebarMenuButton]',
    );

    expect(links.length).toBe(0);
  });

  it('links each item to its url', () => {
    setup([{ title: 'Pages', url: '/pages' }]);

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector(
      'a[hlmSidebarMenuButton]',
    );

    expect(link.getAttribute('href')).toBe('/pages');
  });
});
