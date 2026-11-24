import { ComponentFixture, TestBed } from '@angular/core/testing';
import { toast } from '@spartan-ng/brain/sonner';
import { vi } from 'vitest';
import { PagesService } from '../../../../shared/services/pages-service';
import PageDetail from './page-detail';

describe('PageDetail', () => {
  let component: PageDetail;
  let fixture: ComponentFixture<PageDetail>;
  let service: PagesService;
  let el: HTMLElement;

  beforeEach(async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => undefined,
    });
    // the select's overlay panel needs these, which jsdom doesn't implement
    Element.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
      },
    );

    await TestBed.configureTestingModule({
      imports: [PageDetail],
    }).compileComponents();

    service = TestBed.inject(PagesService);
    fixture = TestBed.createComponent(PageDetail);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const input = (id: string) => el.querySelector<HTMLInputElement>(`#${id}`)!;
  const button = (label: string) =>
    Array.from(el.querySelectorAll<HTMLButtonElement>('form button')).find(
      b => b.textContent?.trim() === label,
    )!;
  const selectTrigger = () =>
    el.querySelector<HTMLButtonElement>('#page-type')!;

  async function type(id: string, value: string, blur = true) {
    const control = input(id);
    control.value = value;
    control.dispatchEvent(new Event('input'));
    if (blur) control.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  }

  async function click(target: HTMLElement) {
    target.click();
    await fixture.whenStable();
  }

  // the select panel portals to document.body, outside the fixture's element
  async function chooseType(label: string) {
    await click(selectTrigger());
    const item = Array.from(
      document.querySelectorAll<HTMLElement>('hlm-select-item'),
    ).find(i => i.textContent?.trim() === label)!;
    await click(item);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an empty state when no page is selected', () => {
    expect(el.textContent).toContain('Select a page to edit its settings.');
    expect(el.querySelector('form')).toBeNull();
  });

  describe('with a selected page', () => {
    let id: string;

    beforeEach(async () => {
      id = service.addPage({ name: 'Home', slug: 'home', type: 'form' });
      service.selectPage(id);
      await fixture.whenStable();
    });

    it('should show the form', () => {
      expect(el.querySelector('form')).toBeTruthy();
      expect(el.textContent).not.toContain(
        'Select a page to edit its settings.',
      );
    });

    it('should label every control', () => {
      expect(el.querySelector('label[for=page-name]')).toBeTruthy();
      expect(el.querySelector('label[for=page-slug]')).toBeTruthy();
      expect(el.querySelector('label[for=page-title]')).toBeTruthy();
      expect(el.querySelector('label[for=page-type]')).toBeTruthy();
    });

    it('should show the page values', () => {
      expect(input('page-name').value).toBe('Home');
      expect(input('page-slug').value).toBe('home');
      expect(input('page-title').value).toBe('');
      expect(selectTrigger().textContent).toContain('Form');
    });

    it('should name the page in the header', () => {
      expect(
        el.querySelector('h2')!.nextElementSibling?.textContent?.trim(),
      ).toBe('Home');
    });

    it('should list every page type in the select, capitalized', async () => {
      await click(selectTrigger());

      const labels = Array.from(
        document.querySelectorAll('hlm-select-item'),
      ).map(i => i.textContent?.trim());
      expect(labels).toEqual(['Form', 'Table', 'Custom']);
    });

    it('should disable Save and Reset until something changes', () => {
      expect(button('Save').disabled).toBe(true);
      expect(button('Reset').disabled).toBe(true);
    });

    it('should enable Save and Reset once the name changes', async () => {
      await type('page-name', 'Dashboard');

      expect(button('Save').disabled).toBe(false);
      expect(button('Reset').disabled).toBe(false);
    });

    it('should enable Save and Reset once the type changes', async () => {
      await chooseType('Table');

      expect(button('Save').disabled).toBe(false);
      expect(selectTrigger().textContent).toContain('Table');
    });

    it('should not save while typing', async () => {
      await type('page-name', 'Dashboard');

      expect(service.pages()[0].name).toBe('Home');
    });

    it('should save valid edits on Save', async () => {
      const success = vi.spyOn(toast, 'success');

      await type('page-name', 'Dashboard');
      await type('page-slug', 'dashboard');
      await type('page-title', 'Dashboard overview');
      await click(button('Save'));

      expect(service.pages()[0]).toEqual(
        expect.objectContaining({
          name: 'Dashboard',
          slug: 'dashboard',
          title: 'Dashboard overview',
        }),
      );
      expect(success).toHaveBeenCalledOnce();
    });

    it('should save a type change', async () => {
      await chooseType('Table');
      await click(button('Save'));

      expect(service.pages()[0].type).toBe('table');
    });

    it('should disable buttons again after saving', async () => {
      await type('page-name', 'Dashboard');
      await click(button('Save'));

      expect(button('Save').disabled).toBe(true);
      expect(button('Reset').disabled).toBe(true);
    });

    it('should restore saved values on Reset', async () => {
      await type('page-name', 'Dashboard');
      await chooseType('Table');

      await click(button('Reset'));

      expect(input('page-name').value).toBe('Home');
      expect(selectTrigger().textContent).toContain('Form');
      expect(service.pages()[0].name).toBe('Home');
      expect(button('Save').disabled).toBe(true);
    });

    it('should reject an empty name', async () => {
      await type('page-name', '');
      await click(button('Save'));

      expect(el.textContent).toContain('Enter a page name.');
      expect(service.pages()[0].name).toBe('Home');
    });

    it('should reject an invalid slug', async () => {
      const success = vi.spyOn(toast, 'success');

      await type('page-slug', 'Not Valid');
      await click(button('Save'));

      expect(el.querySelector('hlm-field-error')?.textContent).toContain(
        'lowercase',
      );
      expect(service.pages()[0].slug).toBe('home');
      expect(success).not.toHaveBeenCalled();
    });

    it('should trim the name when saving', async () => {
      await type('page-name', '  Dashboard  ');
      await click(button('Save'));

      expect(service.pages()[0].name).toBe('Dashboard');
      expect(input('page-name').value).toBe('Dashboard');
    });

    it('should allow an empty title', async () => {
      await type('page-name', 'Dashboard');
      await click(button('Save'));

      expect(service.pages()[0].title).toBe('');
    });

    it('should switch to a different page when selection changes', async () => {
      const other = service.addPage({ name: 'About', slug: 'about' });
      await type('page-name', 'Unsaved edit', false);

      service.selectPage(other);
      await fixture.whenStable();

      expect(input('page-name').value).toBe('About');
      expect(service.pages()[0].name).toBe('Home');
    });

    it('should show the empty state again once the page is deleted', async () => {
      service.addPage({ name: 'About' });

      service.deletePage(id);
      await fixture.whenStable();

      expect(el.textContent).toContain('Select a page to edit its settings.');
    });
  });
});
