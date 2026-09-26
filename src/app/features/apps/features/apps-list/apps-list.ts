import { Component, inject } from '@angular/core';
import { HlmButtonImports } from '@neotic/helm/button';
import { HlmItemImports } from '@neotic/helm/item';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLayoutGrid, lucidePlus, lucideTrash2 } from '@ng-icons/lucide';
import { AppService } from '../../../../shared/services/app-service';

@Component({
  imports: [NgIcon, HlmButtonImports, HlmItemImports],
  providers: [provideIcons({ lucideLayoutGrid, lucidePlus, lucideTrash2 })],
  selector: 'app-apps-list',
  styles: ``,
  template: `
    <div class="flex h-full w-full flex-col">
      <div
        class="border-border flex items-center justify-between border-b px-3 py-2">
        <h2 class="text-muted-foreground text-xs font-semibold">Apps</h2>
        <button
          hlmBtn
          size="icon"
          variant="ghost"
          class="size-6"
          aria-label="Create app"
          (click)="_appService.createApp()">
          <ng-icon hlm name="lucidePlus" aria-hidden="true" class="text-sm" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-3">
        <ul hlmItemGroup class="gap-2">
          @for (app of _appService.apps(); track app.id) {
            <li
              hlmItem
              variant="outline"
              class="group hover:bg-muted/50 has-[button[aria-current]]:border-primary/40 has-[button[aria-current]]:bg-primary/5 rounded-lg shadow-xs">
              <div
                hlmItemMedia
                class="bg-primary/5 text-primary size-8 rounded-lg">
                <ng-icon
                  hlm
                  name="lucideLayoutGrid"
                  class="text-base"
                  aria-hidden="true" />
              </div>
              <button
                hlmItemContent
                type="button"
                class="focus-visible:ring-ring min-w-0 cursor-pointer rounded-md text-left outline-none focus-visible:ring-2"
                [attr.aria-current]="isActive(app.id) ? 'true' : null"
                (click)="_appService.selectApp(app.id)">
                <span hlmItemTitle class="truncate">
                  {{ app.metadata.name }}
                </span>
                <span hlmItemDescription class="truncate text-xs">
                  v{{ app.metadata.version }}
                </span>
              </button>
              @if (_appService.apps().length > 1) {
                <div hlmItemActions>
                  <button
                    hlmBtn
                    variant="ghost"
                    size="icon"
                    class="text-muted-foreground hover:text-destructive size-7 shrink-0 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
                    [attr.aria-label]="'Delete ' + app.metadata.name"
                    (click)="_appService.deleteApp(app.id)">
                    <ng-icon
                      hlm
                      name="lucideTrash2"
                      class="text-base"
                      aria-hidden="true" />
                  </button>
                </div>
              }
            </li>
          }
        </ul>
      </div>
    </div>
  `,
})
export default class AppsList {
  protected readonly _appService = inject(AppService);

  isActive(id: string): boolean {
    return this._appService.activeApp().id === id;
  }
}
