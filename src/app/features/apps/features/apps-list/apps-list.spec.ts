import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { AppService } from '../../../../shared/services/app-service';
import AppsList from './apps-list';

@Component({ template: '' })
class MetadataStub {}

describe('AppsList', () => {
  let component: AppsList;
  let fixture: ComponentFixture<AppsList>;
  let service: AppService;
  let el: HTMLElement;

  beforeEach(async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => undefined,
    });
    await TestBed.configureTestingModule({
      imports: [AppsList],
      providers: [
        provideRouter([
          { path: 'metadata/:id', outlet: 'content', component: MetadataStub },
        ]),
      ],
    }).compileComponents();

    service = TestBed.inject(AppService);
    fixture = TestBed.createComponent(AppsList);
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one row per app', async () => {
    service.createApp('Two');
    await fixture.whenStable();

    expect(rows()).toHaveLength(2);
  });

  it('should show app name and version', async () => {
    service.updateActiveAppMetadata({ name: 'Shop', version: '2.3.4' });
    await fixture.whenStable();

    const row = rows()[0];
    expect(row.querySelector('[data-slot=item-title]')?.textContent).toContain(
      'Shop',
    );
    expect(
      row.querySelector('[data-slot=item-description]')?.textContent,
    ).toContain('v2.3.4');
  });

  it('should render rows as spartan items', () => {
    expect(el.querySelector('ul[data-slot=item-group]')).toBeTruthy();
    expect(rows()[0].getAttribute('data-slot')).toBe('item');
  });

  it('should show app count in header', async () => {
    const title = el.querySelector('h2')!;
    expect(title.textContent).toContain('Apps');
    expect(title.textContent).toContain('1');

    service.createApp('Two');
    await fixture.whenStable();

    expect(title.textContent).toContain('2');
  });

  it('should use quiet icon-only create button with no visible text', () => {
    const create = el.querySelector<HTMLButtonElement>(
      'button[aria-label="Create app"]',
    )!;

    expect(create.textContent?.trim()).toBe('');
    expect(create.querySelector('ng-icon')).toBeTruthy();
  });

  it('should give icon-only buttons an accessible name', async () => {
    service.createApp('Two');
    await fixture.whenStable();

    expect(el.querySelector('button[aria-label="Create app"]')).toBeTruthy();
    expect(el.querySelector('button[aria-label="Delete Two"]')).toBeTruthy();
  });

  it('should hide decorative icons from assistive tech', () => {
    el.querySelectorAll('ng-icon').forEach(icon =>
      expect(icon.getAttribute('aria-hidden')).toBe('true'),
    );
  });

  it('should hide delete button when only one app', () => {
    expect(el.querySelector('button[aria-label^="Delete"]')).toBeNull();
  });

  it('should mark active app with aria-current', async () => {
    const first = service.apps()[0].id;
    service.createApp('Two');
    service.selectApp(first);
    await fixture.whenStable();

    const [firstBtn, secondBtn] = Array.from(selectButtons());
    expect(firstBtn.getAttribute('aria-current')).toBe('true');
    expect(secondBtn.hasAttribute('aria-current')).toBe(false);
  });

  it('should select app on click', async () => {
    const first = service.apps()[0].id;
    service.createApp('Two');
    await fixture.whenStable();

    selectButtons()[0].click();

    expect(service.activeApp().id).toBe(first);
  });

  it('should open metadata in content outlet on click', async () => {
    const router = TestBed.inject(Router);
    const id = service.apps()[0].id;

    selectButtons()[0].click();
    await fixture.whenStable();

    expect(router.url).toContain(`(content:metadata/${id})`);
  });

  it('should delete app on delete click', async () => {
    service.createApp('Two');
    await fixture.whenStable();

    el.querySelector<HTMLButtonElement>(
      'button[aria-label="Delete Two"]',
    )!.click();
    await fixture.whenStable();

    expect(service.apps()).toHaveLength(1);
  });

  it('should create app from header button', async () => {
    el.querySelector<HTMLButtonElement>(
      'button[aria-label="Create app"]',
    )!.click();
    await fixture.whenStable();

    expect(service.apps()).toHaveLength(2);
  });
});
