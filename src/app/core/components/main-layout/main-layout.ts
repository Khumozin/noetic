import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@neotic/helm/sidebar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideDownload,
  lucideMonitor,
  lucidePlay,
  lucideUpload,
} from '@ng-icons/lucide';
import { Breadcrumb } from '../breadcrumb/breadcrumb';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  imports: [Breadcrumb, Sidebar, NgIcon, RouterOutlet, HlmSidebarImports],
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideMonitor,
      lucidePlay,
      lucideDownload,
      lucideUpload,
    }),
  ],
  selector: 'app-main-layout',
  styles: ``,
  template: `
    <div hlmSidebarWrapper class="h-svh overflow-hidden">
      <app-sidebar />
      <main hlmSidebarInset class="flex flex-1 flex-col">
        <header
          class="bg-background border-border flex h-16 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div class="flex items-center gap-2 px-4">
            <button hlmSidebarTrigger class="-ml-1">
              <span class="sr-only"></span>
            </button>
            <app-breadcrumb />
          </div>

          <div class="flex items-center gap-2 px-4">
            <button hlmBtn variant="outline" size="xs" class="gap-1.5">
              <ng-icon size="xs" name="lucidePlay" />
              Preview
            </button>
          </div>
        </header>

        <div class="flex-1 overflow-hidden">
          <main class="bg-background flex h-full" cdkDropListGroup>
            <!-- <app-builder-left-panel />
                <app-builder-canvas class="flex-1" />
                <app-builder-right-panel /> -->
          </main>
        </div>
        <!-- <router-outlet class="hidden" /> -->
      </main>
    </div>
  `,
})
export default class MainLayout {}
