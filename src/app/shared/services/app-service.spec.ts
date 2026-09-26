import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { AngularApp, AppService } from './app-service';

const APPS_KEY = 'noetic-apps';
const ACTIVE_KEY = 'noetic-app-active-id';

function makeApp(id: string, name = id): AngularApp {
  return {
    id,
    homePageId: `${id}-home`,
    metadata: {
      name,
      slug: name,
      description: '',
      prefix: 'app',
      version: '1.0.0',
    },
  };
}

function createMemoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: key => data.get(key) ?? null,
    key: index => [...data.keys()][index] ?? null,
    removeItem: key => void data.delete(key),
    setItem: (key, value) => void data.set(key, String(value)),
  };
}

describe('AppService', () => {
  let service: AppService;

  function createService(): AppService {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    return TestBed.inject(AppService);
  }

  beforeEach(() => {
    vi.stubGlobal('localStorage', createMemoryStorage());
    service = createService();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should seed a default app when storage is empty', () => {
      expect(service.apps()).toHaveLength(1);
      expect(service.apps()[0].metadata).toEqual({
        name: 'My Apps',
        slug: 'my-apps',
        description: '',
        prefix: 'app',
        version: '1.0.0',
      });
      expect(service.apps()[0].homePageId).toBeTruthy();
    });

    it('should make default app active', () => {
      expect(service.activeApp().id).toBe(service.apps()[0].id);
    });

    it('should load apps from storage', () => {
      localStorage.setItem(
        APPS_KEY,
        JSON.stringify([makeApp('a'), makeApp('b')]),
      );

      service = createService();

      expect(service.apps().map(a => a.id)).toEqual(['a', 'b']);
    });

    it('should default description for apps saved without one', () => {
      const legacy = makeApp('a') as unknown as {
        metadata: Record<string, unknown>;
      };
      delete legacy.metadata['description'];
      localStorage.setItem(APPS_KEY, JSON.stringify([legacy]));

      service = createService();

      expect(service.apps()[0].metadata.description).toBe('');
    });

    it('should keep stored apps whose values the form would now reject', () => {
      const app = makeApp('a', 'Old App');
      app.metadata.slug = 'Old App!';
      localStorage.setItem(APPS_KEY, JSON.stringify([app]));

      service = createService();

      expect(service.apps()[0].metadata.slug).toBe('Old App!');
    });

    it('should load active app id from storage', () => {
      localStorage.setItem(
        APPS_KEY,
        JSON.stringify([makeApp('a'), makeApp('b')]),
      );
      localStorage.setItem(ACTIVE_KEY, 'b');

      service = createService();

      expect(service.activeApp().id).toBe('b');
    });

    it('should fall back to first app when stored active id is stale', () => {
      localStorage.setItem(
        APPS_KEY,
        JSON.stringify([makeApp('a'), makeApp('b')]),
      );
      localStorage.setItem(ACTIVE_KEY, 'gone');

      service = createService();

      expect(service.activeApp().id).toBe('a');
    });

    it.each([
      ['empty array', '[]'],
      ['wrong shape', '[{"foo":1}]'],
      ['not an array', '{}'],
    ])('should seed default app when stored apps are %s', (_, raw) => {
      localStorage.setItem(APPS_KEY, raw);

      service = createService();

      expect(service.apps()).toHaveLength(1);
      expect(service.apps()[0].metadata.name).toBe('My Apps');
    });

    it('should seed default app when stored apps are corrupt', () => {
      localStorage.setItem(APPS_KEY, '{not json');

      service = createService();

      expect(service.apps()).toHaveLength(1);
      expect(service.apps()[0].metadata.name).toBe('My Apps');
    });
  });

  describe('createApp', () => {
    it('should append app and return its id', () => {
      const id = service.createApp();

      expect(service.apps()).toHaveLength(2);
      expect(service.apps()[1].id).toBe(id);
    });

    it('should use default name when none given', () => {
      service.createApp();

      expect(service.apps()[1].metadata.name).toBe('New App');
    });

    it('should build metadata from name', () => {
      service.createApp('My Cool  App');

      expect(service.apps()[1].metadata).toEqual({
        name: 'My Cool  App',
        slug: 'my-cool-app',
        description: '',
        prefix: 'app',
        version: '1.0.0',
      });
    });

    it.each([
      ['My App!', 'my-app'],
      ['  Spaced   Out  ', 'spaced-out'],
      ['Café 2', 'caf-2'],
      ['!!!', 'app'],
    ])('should slugify %j as %j', (name, slug) => {
      service.createApp(name);

      expect(service.apps()[1].metadata.slug).toBe(slug);
    });

    it('should set a home page id', () => {
      service.createApp();

      expect(service.apps()[1].homePageId).toBeTruthy();
    });

    it('should make new app active', () => {
      const id = service.createApp('Two');

      expect(service.activeApp().id).toBe(id);
    });

    it('should generate unique ids', () => {
      const a = service.createApp();
      const b = service.createApp();

      expect(a).not.toBe(b);
    });
  });

  describe('selectApp', () => {
    it('should switch active app', () => {
      const first = service.apps()[0].id;
      service.createApp('Two');

      service.selectApp(first);

      expect(service.activeApp().id).toBe(first);
    });

    it('should fall back to first app when id unknown', () => {
      const first = service.apps()[0].id;
      service.createApp('Two');

      service.selectApp('missing');

      expect(service.activeApp().id).toBe(first);
    });
  });

  describe('deleteApp', () => {
    it('should remove app', () => {
      const first = service.apps()[0].id;
      const second = service.createApp('Two');

      service.deleteApp(second);

      expect(service.apps().map(a => a.id)).toEqual([first]);
    });

    it('should select first remaining app when active app deleted', () => {
      const first = service.apps()[0].id;
      const second = service.createApp('Two');
      expect(service.activeApp().id).toBe(second);

      service.deleteApp(second);

      expect(service.activeApp().id).toBe(first);
    });

    it('should not delete last app', () => {
      const only = service.apps()[0].id;

      service.deleteApp(only);

      expect(service.apps().map(a => a.id)).toEqual([only]);
      expect(service.activeApp().id).toBe(only);
    });

    it('should ignore unknown id', () => {
      service.createApp('Two');

      service.deleteApp('missing');

      expect(service.apps()).toHaveLength(2);
    });
  });

  describe('persistence', () => {
    function stored(): AngularApp[] {
      return JSON.parse(localStorage.getItem(APPS_KEY) ?? '[]');
    }

    it('should persist seeded app and active id on init', () => {
      TestBed.tick();

      expect(stored()).toEqual(service.apps());
      expect(localStorage.getItem(ACTIVE_KEY)).toBe(service.activeApp().id);
    });

    it('should persist created app and new active id', () => {
      const id = service.createApp('Two');
      TestBed.tick();

      expect(stored().map(a => a.id)).toContain(id);
      expect(localStorage.getItem(ACTIVE_KEY)).toBe(id);
    });

    it('should persist deletion', () => {
      const first = service.apps()[0].id;
      const second = service.createApp('Two');
      TestBed.tick();

      service.deleteApp(second);
      TestBed.tick();

      expect(stored().map(a => a.id)).toEqual([first]);
      expect(localStorage.getItem(ACTIVE_KEY)).toBe(first);
    });

    it('should persist metadata updates', () => {
      service.updateActiveAppMetadata({ name: 'Renamed' });
      TestBed.tick();

      expect(stored()[0].metadata.name).toBe('Renamed');
    });

    it('should restore state in a new service instance', () => {
      const id = service.createApp('Two');
      service.updateActiveAppMetadata({ name: 'Renamed' });
      TestBed.tick();

      service = createService();

      expect(service.apps()).toHaveLength(2);
      expect(service.activeApp().id).toBe(id);
      expect(service.activeApp().metadata.name).toBe('Renamed');
    });

    it('should not throw when storage writes fail', () => {
      vi.stubGlobal('localStorage', {
        ...createMemoryStorage(),
        setItem: () => {
          throw new Error('quota');
        },
      });
      service = createService();

      expect(() => {
        service.createApp('Two');
        TestBed.tick();
      }).not.toThrow();
      expect(service.apps()).toHaveLength(2);
    });
  });

  describe('updateActiveAppMetadata', () => {
    it('should merge partial metadata into active app', () => {
      service.updateActiveAppMetadata({ name: 'Renamed', version: '2.0.0' });

      expect(service.activeApp().metadata).toEqual({
        name: 'Renamed',
        slug: 'my-apps',
        description: '',
        prefix: 'app',
        version: '2.0.0',
      });
    });

    it('should leave other apps untouched', () => {
      const first = service.apps()[0];
      service.createApp('Two');

      service.updateActiveAppMetadata({ name: 'Renamed' });

      expect(service.apps()[0]).toEqual(first);
    });
  });
});
