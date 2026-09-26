import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { AppService } from './app-service';
import { PagesService } from './pages-service';

describe('PagesService', () => {
  let service: PagesService;
  let apps: AppService;

  const pages = () => apps.activeApp().pages;

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => undefined,
    });
    TestBed.configureTestingModule({});
    apps = TestBed.inject(AppService);
    service = TestBed.inject(PagesService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('pages', () => {
    it('should start empty', () => {
      expect(service.pages()).toEqual([]);
    });

    it('should reflect the active app pages', () => {
      const id = service.addPage({ name: 'A' });
      expect(service.pages().map(p => p.id)).toEqual([id]);

      apps.createApp('Two');
      expect(service.pages()).toEqual([]);

      apps.selectApp(apps.apps()[0].id);
      expect(service.pages().map(p => p.id)).toEqual([id]);
    });
  });

  describe('selectPage / activePage', () => {
    it('should have no active page initially', () => {
      service.addPage({});

      expect(service.activePage()).toBeNull();
    });

    it('should return the selected page', () => {
      const id = service.addPage({ name: 'A' });
      service.addPage({ name: 'B' });

      service.selectPage(id);

      expect(service.activePage()?.name).toBe('A');
    });

    it('should return null for an unknown id', () => {
      service.addPage({});

      service.selectPage('missing');

      expect(service.activePage()).toBeNull();
    });

    it('should follow updates to the selected page', () => {
      const id = service.addPage({ name: 'Old' });
      service.selectPage(id);

      service.updatePage(id, { name: 'New' });

      expect(service.activePage()?.name).toBe('New');
    });

    it('should become null when the selected page is deleted', () => {
      const id = service.addPage({});
      service.selectPage(id);

      service.deletePage(id);

      expect(service.activePage()).toBeNull();
    });

    it('should be null after switching to an app without that page', () => {
      const id = service.addPage({});
      service.selectPage(id);

      apps.createApp('Two');

      expect(service.activePage()).toBeNull();
    });

    it('should be selectable again after switching back', () => {
      const first = apps.apps()[0].id;
      const id = service.addPage({});
      service.selectPage(id);
      apps.createApp('Two');

      apps.selectApp(first);

      expect(service.activePage()?.id).toBe(id);
    });
  });

  describe('addPage', () => {
    it('should add a page with defaults and return its id', () => {
      const id = service.addPage({});

      expect(pages()).toEqual([
        { id, name: 'New Page', slug: 'new-page', type: 'form' },
      ]);
    });

    it('should let given values override defaults', () => {
      const id = service.addPage({
        name: 'Users',
        slug: 'users',
        type: 'table',
      });

      expect(pages()[0]).toEqual({
        id,
        name: 'Users',
        slug: 'users',
        type: 'table',
      });
    });

    it('should always generate the id', () => {
      const id = service.addPage({ id: 'forced' });

      expect(id).not.toBe('forced');
      expect(pages()[0].id).toBe(id);
    });

    it('should append and generate unique ids', () => {
      const a = service.addPage({});
      const b = service.addPage({});

      expect(a).not.toBe(b);
      expect(pages().map(p => p.id)).toEqual([a, b]);
    });

    it('should only touch the active app', () => {
      const first = apps.apps()[0].id;
      service.addPage({});
      apps.createApp('Two');

      service.addPage({ name: 'Other' });

      expect(apps.activeApp().pages.map(p => p.name)).toEqual(['Other']);
      expect(apps.apps().find(a => a.id === first)!.pages).toHaveLength(1);
    });
  });

  describe('updatePage', () => {
    it('should merge changes into the page', () => {
      const id = service.addPage({ name: 'Old' });

      service.updatePage(id, { name: 'New', title: 'Heading' });

      expect(pages()[0]).toEqual(
        expect.objectContaining({ id, name: 'New', title: 'Heading' }),
      );
    });

    it('should leave other pages untouched', () => {
      const a = service.addPage({ name: 'A' });
      service.addPage({ name: 'B' });

      service.updatePage(a, { name: 'A2' });

      expect(pages().map(p => p.name)).toEqual(['A2', 'B']);
    });

    it('should ignore an unknown id', () => {
      service.addPage({ name: 'A' });
      const before = pages();

      service.updatePage('missing', { name: 'X' });

      expect(pages()).toEqual(before);
    });
  });

  describe('deletePage', () => {
    it('should remove the page', () => {
      const a = service.addPage({ name: 'A' });
      const b = service.addPage({ name: 'B' });

      service.deletePage(a);

      expect(pages().map(p => p.id)).toEqual([b]);
    });

    it('should ignore an unknown id', () => {
      service.addPage({});

      service.deletePage('missing');

      expect(pages()).toHaveLength(1);
    });
  });
});
