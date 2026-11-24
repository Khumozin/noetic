import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@neotic/helm/button';
import { HlmItemImports } from '@neotic/helm/item';
import { HlmTooltipImports } from '@neotic/helm/tooltip';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideLayoutTemplate,
  lucidePlus,
  lucideTrash2,
} from '@ng-icons/lucide';
import { PagesService } from '../../../../shared/services/pages-service';

@Component({
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmItemImports,
    HlmTooltipImports,
    RouterLink,
  ],
  providers: [provideIcons({ lucideLayoutTemplate, lucidePlus, lucideTrash2 })],
  selector: 'app-pages-list',
  styles: ``,
  template: `
    <div class="flex h-full w-full flex-col">
      <div
        class="border-border flex h-12 shrink-0 items-center justify-between border-b px-3">
        <h2
          class="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          Pages
          <span class="text-muted-foreground/70 ms-1 font-normal">
            {{ _pageService.pages().length }}
          </span>
        </h2>
        <button
          hlmBtn
          size="icon"
          variant="ghost"
          class="size-7"
          hlmTooltip="Create page"
          aria-label="Create page"
          (click)="_pageService.addPage()">
          <ng-icon hlm name="lucidePlus" aria-hidden="true" class="text-base" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-3">
        <ul hlmItemGroup class="gap-2">
          @for (page of _pageService.pages(); track page.id) {
            <li
              hlmItem
              variant="outline"
              class="group hover:bg-muted/50 has-[button[aria-current]]:border-primary/40 has-[button[aria-current]]:bg-primary/5 rounded-lg shadow-xs">
              <div
                hlmItemMedia
                class="bg-primary/5 text-primary size-8 rounded-lg">
                <ng-icon
                  hlm
                  name="lucideLayoutTemplate"
                  class="text-base"
                  aria-hidden="true" />
              </div>
              <button
                hlmItemContent
                type="button"
                class="focus-visible:ring-ring min-w-0 cursor-pointer rounded-md text-left outline-none focus-visible:ring-2"
                [attr.aria-current]="isActive(page.id) ? 'true' : null"
                [routerLink]="[
                  './',
                  { outlets: { content: ['detail', page.id] } },
                ]"
                (click)="_pageService.selectPage(page.id)">
                <span hlmItemTitle class="truncate">
                  {{ page.name }}
                </span>
                <span hlmItemDescription class="truncate text-xs">
                  {{ page.title }}
                </span>
              </button>
              @if (_pageService.pages().length > 1) {
                <div hlmItemActions>
                  <button
                    hlmBtn
                    variant="ghost"
                    size="icon"
                    class="text-muted-foreground hover:text-destructive size-7 shrink-0 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
                    [attr.aria-label]="'Delete ' + page.name"
                    (click)="_pageService.deletePage(page.id)">
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
export default class PagesList {
  protected readonly _pageService = inject(PagesService);

  isActive(id: string): boolean {
    return this._pageService.activePage()?.id === id;
  }
}
