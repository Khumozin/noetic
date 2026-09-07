import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Breadcrumb } from '../breadcrumb/breadcrumb';
import { Sidebar } from '../sidebar/sidebar';
import MainLayout from './main-layout';

describe('MainLayout', () => {
  let fixture: ComponentFixture<MainLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
  });

  it('renders the sidebar', () => {
    const sidebar = fixture.debugElement.query(
      el => el.componentInstance instanceof Sidebar,
    );

    expect(sidebar).not.toBeNull();
  });

  it('renders the breadcrumb in the header', () => {
    const breadcrumb = fixture.debugElement.query(
      el => el.componentInstance instanceof Breadcrumb,
    );

    expect(breadcrumb).not.toBeNull();
  });

  it('renders a sidebar trigger button', () => {
    const trigger = fixture.nativeElement.querySelector('[hlmSidebarTrigger]');

    expect(trigger).not.toBeNull();
  });

  it('renders a Preview action', () => {
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );
    const preview = buttons.find(button =>
      button.textContent?.includes('Preview'),
    );

    expect(preview).toBeTruthy();
  });
});
