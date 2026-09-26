import { computed, inject, Service, signal } from '@angular/core';
import { AppPage } from '../models/page.schema';
import { AppService } from './app-service';

@Service()
export class PagesService {
  private readonly _appService = inject(AppService);

  private readonly _activePageId = signal<string | null>(null);

  readonly pages = computed(() => this._appService.activeApp().pages);

  readonly activePage = computed<AppPage | null>(() => {
    const id = this._activePageId();
    return this._appService.activeApp().pages.find(p => p.id === id) ?? null;
  });

  selectPage(id: string): void {
    this._activePageId.set(id);
  }

  addPage(page: Partial<AppPage>): string {
    const id = crypto.randomUUID();
    const newPage = {
      name: 'New Page',
      slug: 'new-page',
      type: 'form',
      ...page,
      id,
    } satisfies AppPage;
    this._appService.updateActiveApp(app => ({
      ...app,
      pages: [...app.pages, newPage],
    }));
    return id;
  }

  updatePage(pageId: string, data: Partial<Omit<AppPage, 'id'>>): void {
    this._appService.updateActiveApp(app => ({
      ...app,
      pages: app.pages.map(p => (p.id === pageId ? { ...p, ...data } : p)),
    }));
  }

  deletePage(pageId: string): void {
    this._appService.updateActiveApp(app => ({
      ...app,
      pages: app.pages.filter(p => p.id !== pageId),
    }));
  }
}
