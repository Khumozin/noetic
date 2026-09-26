import { computed, Service, signal } from '@angular/core';

export interface AngularApp {
  id: string;
  homePageId: string | null;
}

@Service()
export class AppService {
  private readonly _apps = signal<AngularApp[]>([]);
  private readonly _activeAppId = signal<string>('');

  readonly apps = computed(() => this._apps());

  readonly activeApp = computed<AngularApp>(
    () =>
      this._apps().find(a => a.id === this._activeAppId()) ?? this._apps()?.[0],
  );

  constructor() {
    // validate active app id; fix if it points to a non-existent app
    const apps = this._apps();
    if (!apps.find(a => a.id === this._activeAppId())) {
      this._activeAppId.set(apps?.[0].id ?? '');
    }
  }
}
