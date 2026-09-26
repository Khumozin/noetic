import { ComponentFixture, TestBed } from '@angular/core/testing';
import { toast } from '@spartan-ng/brain/sonner';
import { vi } from 'vitest';
import { AppService } from '../../../../shared/services/app-service';
import AppMetadata from './app-metadata';

describe('AppMetadata', () => {
  let component: AppMetadata;
  let fixture: ComponentFixture<AppMetadata>;
  let service: AppService;
  let el: HTMLElement;

  beforeEach(async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => undefined,
    });
    await TestBed.configureTestingModule({
      imports: [AppMetadata],
    }).compileComponents();

    service = TestBed.inject(AppService);
    fixture = TestBed.createComponent(AppMetadata);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const input = (id: string) =>
    el.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)!;

  const button = (label: string) =>
    Array.from(el.querySelectorAll<HTMLButtonElement>('form button')).find(
      b => b.textContent?.trim() === label,
    )!;

  async function click(label: string) {
    button(label).click();
    await fixture.whenStable();
  }

  async function type(id: string, value: string, blur = true) {
    const control = input(id);
    control.value = value;
    control.dispatchEvent(new Event('input'));
    if (blur) control.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should label every control', () => {
    for (const id of [
      'app-name',
      'app-slug',
      'app-description',
      'app-version',
      'app-prefix',
    ]) {
      expect(el.querySelector(`label[for=${id}]`)).toBeTruthy();
      expect(input(id)).toBeTruthy();
    }
  });

  it('should show active app metadata', () => {
    const { name, slug, version, prefix } = service.activeApp().metadata;

    expect(input('app-name').value).toBe(name);
    expect(input('app-slug').value).toBe(slug);
    expect(input('app-version').value).toBe(version);
    expect(input('app-prefix').value).toBe(prefix);
    expect(input('app-description').value).toBe('');
  });

  it('should render header title and app name', () => {
    const header = el.querySelector('h2')!.parentElement!;

    expect(header.querySelector('h2')?.textContent).toContain('App Settings');
    expect(header.textContent).toContain(service.activeApp().metadata.name);
  });

  it('should use same header as apps list and no card', () => {
    const header = el.querySelector('h2')!.parentElement!;

    expect(header.classList).toContain('h-12');
    expect(header.classList).toContain('border-b');
    expect(el.querySelector('.rounded-2xl, .shadow-xs')).toBeNull();
  });

  describe('save and reset', () => {
    it('should disable Save and Reset until something changes', async () => {
      expect(button('Save').disabled).toBe(true);
      expect(button('Reset').disabled).toBe(true);

      await type('app-name', 'Shop');

      expect(button('Save').disabled).toBe(false);
      expect(button('Reset').disabled).toBe(false);
    });

    it('should not save while typing', async () => {
      const before = service.activeApp().metadata.name;

      await type('app-name', 'Shop');

      expect(service.activeApp().metadata.name).toBe(before);
    });

    it('should save valid edits on Save', async () => {
      const success = vi.spyOn(toast, 'success');

      await type('app-name', 'Shop');
      await type('app-version', '2.0.0');
      await type('app-description', 'My shop');
      await click('Save');

      expect(service.activeApp().metadata).toEqual(
        expect.objectContaining({
          name: 'Shop',
          version: '2.0.0',
          description: 'My shop',
        }),
      );
      expect(success).toHaveBeenCalledOnce();
    });

    it('should disable buttons again after saving', async () => {
      await type('app-name', 'Shop');
      await click('Save');

      expect(button('Save').disabled).toBe(true);
      expect(button('Reset').disabled).toBe(true);
      expect(input('app-name').value).toBe('Shop');
    });

    it('should submit with the form submit event', async () => {
      await type('app-name', 'Shop');

      el.querySelector('form')!.dispatchEvent(new Event('submit'));
      await fixture.whenStable();

      expect(service.activeApp().metadata.name).toBe('Shop');
    });

    it('should restore saved values on Reset', async () => {
      const before = service.activeApp().metadata;

      await type('app-name', 'Shop');
      await type('app-prefix', 'shop');
      await click('Reset');

      expect(input('app-name').value).toBe(before.name);
      expect(input('app-prefix').value).toBe(before.prefix);
      expect(service.activeApp().metadata).toEqual(before);
      expect(button('Save').disabled).toBe(true);
    });

    it('should clear errors on Reset', async () => {
      await type('app-name', '');
      expect(el.textContent).toContain('Enter an app name.');

      await click('Reset');

      expect(el.textContent).not.toContain('Enter an app name.');
    });

    it('should not save invalid values', async () => {
      const success = vi.spyOn(toast, 'success');
      const before = service.activeApp().metadata;

      await type('app-slug', 'Not Valid');
      await click('Save');

      expect(el.querySelector('hlm-field-error')?.textContent).toContain(
        'lowercase',
      );
      expect(service.activeApp().metadata).toEqual(before);
      expect(success).not.toHaveBeenCalled();
    });

    it('should show errors for untouched fields on Save', async () => {
      await type('app-name', '', false);
      expect(el.textContent).not.toContain('Enter an app name.');

      await click('Save');

      expect(el.textContent).toContain('Enter an app name.');
    });

    it('should trim the name when saving', async () => {
      await type('app-name', '  Shop  ');
      await click('Save');

      expect(service.activeApp().metadata.name).toBe('Shop');
      expect(input('app-name').value).toBe('Shop');
    });

    it('should reject a whitespace-only name', async () => {
      const before = service.activeApp().metadata.name;

      await type('app-name', '   ');
      await click('Save');

      expect(el.textContent).toContain('Enter an app name.');
      expect(service.activeApp().metadata.name).toBe(before);
    });

    it('should show a single error for an empty slug', async () => {
      await type('app-slug', '');
      await click('Save');

      const field = input('app-slug').closest('[data-slot=field]')!;
      const errors = field.querySelectorAll('hlm-field-error');
      expect(errors).toHaveLength(1);
      expect(errors[0].textContent).toContain('Enter a slug.');
    });

    it('should reject non-semver version', async () => {
      await type('app-version', 'abc');
      await click('Save');

      expect(el.textContent).toContain('semantic version');
      expect(service.activeApp().metadata.version).toBe('1.0.0');
    });

    it('should discard unsaved edits when active app changes', async () => {
      const first = service.activeApp().metadata.name;
      await type('app-name', 'Unsaved');

      service.createApp('Second');
      await fixture.whenStable();
      service.selectApp(service.apps()[0].id);
      await fixture.whenStable();

      expect(input('app-name').value).toBe(first);
    });
  });

  describe('version and prefix', () => {
    const trigger = () =>
      el.querySelector<HTMLButtonElement>('[data-slot=collapsible-trigger]')!;
    const content = () =>
      el.querySelector<HTMLElement>('[data-slot=collapsible-content]')!;

    it('should explain what version means', () => {
      expect(el.textContent).toContain('Version of the generated app');
    });

    it('should not auto-bump version on save', async () => {
      await type('app-name', 'Shop');
      await click('Save');

      expect(service.activeApp().metadata.version).toBe('1.0.0');
    });

    it('should keep prefix inside a collapsed Advanced section', () => {
      expect(trigger().textContent).toContain('Advanced');
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(content().querySelector('#app-prefix')).toBeTruthy();
      expect(content().getAttribute('data-state')).toBe('closed');
    });

    it('should expand Advanced on click', async () => {
      trigger().click();
      await fixture.whenStable();

      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect(content().getAttribute('data-state')).toBe('open');
    });

    it('should warn that renaming prefix keeps generated components', () => {
      expect(content().textContent).toContain(
        "doesn't rename components you already generated",
      );
    });

    it('should open Advanced when Save fails on an invalid prefix', async () => {
      await type('app-prefix', 'ng', false);
      await click('Save');

      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect(content().textContent).toContain('reserved');
    });

    it('should reject a prefix starting with a digit', async () => {
      await type('app-prefix', '1app', false);
      await click('Save');

      expect(service.activeApp().metadata.prefix).toBe('app');
    });
  });

  it('should preview selector with prefix', async () => {
    await type('app-prefix', 'shop');

    expect(el.textContent).toContain('<shop-header>');
  });

  it('should reload form when active app changes', async () => {
    const first = service.activeApp().id;
    service.createApp('Second');
    await fixture.whenStable();
    expect(input('app-name').value).toBe('Second');

    service.selectApp(first);
    await fixture.whenStable();

    expect(input('app-name').value).toBe(service.activeApp().metadata.name);
    expect(input('app-name').value).not.toBe('Second');
  });
});
