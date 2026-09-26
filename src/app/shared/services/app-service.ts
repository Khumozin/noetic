import { computed, Service } from '@angular/core';
import {
  AngularApp,
  ApplicationMetadata,
  storedAppsSchema,
} from '../models/app.schema';
import { persistedSignal } from '../utils/persisted-signal';

export type { AngularApp, ApplicationMetadata };

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'app'
  );
}

function createDefaultApp(name = 'My Apps'): AngularApp {
  const homePageId = crypto.randomUUID();

  return {
    id: crypto.randomUUID(),
    homePageId,
    metadata: {
      name,
      slug: slugify(name),
      description: '',
      prefix: 'app',
      version: '1.0.0',
    },
  } satisfies AngularApp;
}

const APPS_STORAGE_KEY = 'noetic-apps';
const ACTIVE_APP_ID_STORAGE_KEY = 'noetic-app-active-id';

@Service()
export class AppService {
  private readonly _apps = persistedSignal<AngularApp[]>(APPS_STORAGE_KEY, {
    fallback: () => [createDefaultApp()],
    // null (invalid shape) fails isValid, so the default app is used instead
    deserialize: raw => {
      const result = storedAppsSchema.safeParse(JSON.parse(raw));
      return result.success ? result.data : null;
    },
    isValid: (v): v is AngularApp[] => Array.isArray(v),
  });

  // stored as a plain string (not JSON) for backwards compatibility
  private readonly _activeAppId = persistedSignal<string>(
    ACTIVE_APP_ID_STORAGE_KEY,
    {
      fallback: () => '',
      isValid: (v): v is string => typeof v === 'string',
      serialize: id => id,
      deserialize: raw => raw,
    },
  );

  readonly apps = computed(() => this._apps());

  readonly activeApp = computed<AngularApp>(
    () =>
      this._apps().find(a => a.id === this._activeAppId()) ?? this._apps()?.[0],
  );

  constructor() {
    // validate active app id; fix if it points to a non-existent app
    const apps = this._apps();
    if (!apps.find(a => a.id === this._activeAppId())) {
      this._activeAppId.set(apps[0]?.id ?? '');
    }
  }

  createApp(name = 'New App'): string {
    const app = createDefaultApp(name);
    this._apps.update(apps => [...apps, app]);
    this.selectApp(app.id);
    return app.id;
  }

  selectApp(id: string): void {
    this._activeAppId.set(id);
  }

  deleteApp(id: string): void {
    const remaining = this._apps().filter(a => a.id !== id);
    if (remaining.length === 0) return; // protect from deleting the last app

    this._apps.set(remaining);
    if (this._activeAppId() !== remaining[0].id) {
      this.selectApp(remaining[0].id);
    }
  }

  updateActiveAppMetadata(data: Partial<ApplicationMetadata>): void {
    this._updateActiveApp(app => ({
      ...app,
      metadata: { ...app.metadata, ...data },
    }));
  }

  private _updateActiveApp(fn: (app: AngularApp) => AngularApp): void {
    const id = this._activeAppId();
    this._apps.update(apps => apps.map(a => (a.id === id ? fn(a) : a)));
  }
}
