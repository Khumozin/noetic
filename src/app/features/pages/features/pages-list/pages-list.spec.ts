import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { PagesService } from '../../../../shared/services/pages-service';
import PagesList from './pages-list';

@Component({ template: '' })
class MetadataStub {}

describe('PagesList', () => {
  let component: PagesList;
  let fixture: ComponentFixture<PagesList>;
  let service: PagesService;
  let el: HTMLElement;

  beforeEach(async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => undefined,
    });
    await TestBed.configureTestingModule({
      imports: [PagesList],
      providers: [
        provideRouter([
          { path: 'detail/:id', outlet: 'content', component: MetadataStub },
        ]),
      ],
    }).compileComponents();

    service = TestBed.inject(PagesService);
    fixture = TestBed.createComponent(PagesList);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const rows = () => el.querySelectorAll('li');
  const selectButtons = () =>
    el.querySelectorAll<HTMLButtonElement>('li button:not([aria-label])');
  const createButton = () =>
    el.querySelector<HTMLButtonElement>('button[aria-label="Create page"]')!;
  const deleteButton = (name: string) =>
    el.querySelector<HTMLButtonElement>(`button[aria-label="Delete ${name}"]`);

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render no pages initially', () => {
    expect(rows()).toHaveLength(0);
    expect(el.querySelector('h2')?.textContent).toContain('Pages');
    expect(el.querySelector('h2')?.textContent).toContain('0');
  });

  it('should show page count in header', async () => {
    service.addPage({ name: 'One' });
    await fixture.whenStable();

    expect(el.querySelector('h2')?.textContent).toContain('1');

    service.addPage({ name: 'Two' });
    await fixture.whenStable();

    expect(el.querySelector('h2')?.textContent).toContain('2');
  });

  it('should render one row per page with name and title', async () => {
    service.addPage({ name: 'Home', title: 'Welcome' });
    service.addPage({ name: 'About', title: 'About us' });
    await fixture.whenStable();

    expect(rows()).toHaveLength(2);
    expect(el.textContent).toContain('Home');
    expect(el.textContent).toContain('Welcome');
    expect(el.textContent).toContain('About');
    expect(el.textContent).toContain('About us');
  });

  it('should create a page from the header button', async () => {
    createButton().click();
    await fixture.whenStable();

    expect(service.pages()).toHaveLength(1);
  });

  it('should give the create button an accessible name with no visible text', () => {
    const button = createButton();

    expect(button.textContent?.trim()).toBe('');
    expect(button.querySelector('ng-icon')).toBeTruthy();
  });

  it('should hide delete button when there is only one page', async () => {
    service.addPage({ name: 'Only' });
    await fixture.whenStable();

    expect(deleteButton('Only')).toBeNull();
  });

  it('should show delete button once there is more than one page', async () => {
    service.addPage({ name: 'One' });
    service.addPage({ name: 'Two' });
    await fixture.whenStable();

    expect(deleteButton('One')).toBeTruthy();
    expect(deleteButton('Two')).toBeTruthy();
  });

  it('should delete a page on delete click', async () => {
    service.addPage({ name: 'One' });
    service.addPage({ name: 'Two' });
    await fixture.whenStable();

    deleteButton('Two')!.click();
    await fixture.whenStable();

    expect(service.pages()).toHaveLength(1);
    expect(service.pages()[0].name).toBe('One');
  });

  it('should mark the active page with aria-current', async () => {
    const first = service.addPage({ name: 'One' });
    service.addPage({ name: 'Two' });
    service.selectPage(first);
    await fixture.whenStable();

    const [firstBtn, secondBtn] = Array.from(selectButtons());
    expect(firstBtn.getAttribute('aria-current')).toBe('true');
    expect(secondBtn.hasAttribute('aria-current')).toBe(false);
  });

  it('should select a page on click', async () => {
    const first = service.addPage({ name: 'One' });
    service.addPage({ name: 'Two' });
    await fixture.whenStable();

    selectButtons()[0].click();

    expect(service.activePage()?.id).toBe(first);
  });

  it('should navigate to the detail content outlet on select', async () => {
    const router = TestBed.inject(Router);
    const id = service.addPage({ name: 'One' });
    await fixture.whenStable();

    selectButtons()[0].click();
    await fixture.whenStable();

    expect(router.url).toContain(`(content:detail/${id})`);
  });

  it('should hide decorative icons from assistive tech', async () => {
    service.addPage({ name: 'One' });
    await fixture.whenStable();

    el.querySelectorAll('ng-icon').forEach(icon =>
      expect(icon.getAttribute('aria-hidden')).toBe('true'),
    );
  });
});
