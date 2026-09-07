import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HlmCollapsibleImports } from '@neotic/helm/collapsible';
import { HlmDropdownMenuImports } from '@neotic/helm/dropdown-menu';
import { HlmSidebarImports } from '@neotic/helm/sidebar';
import { NgIcon } from '@ng-icons/core';

interface NavMainItem {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  defaultOpen?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

@Component({
  imports: [
    HlmSidebarImports,
    HlmCollapsibleImports,
    HlmDropdownMenuImports,
    NgIcon,
    RouterLink,
    RouterLinkActive,
  ],
  selector: 'app-nav-main',
  styles: ``,
  template: `
    <div hlmSidebarGroup>
      <div hlmSidebarGroupLabel>Platform</div>
      <div hlmSidebarGroupContent>
        <ul hlmSidebarMenu>
          @for (item of items(); track $index) {
            <li hlmSidebarMenuItem>
              <a
                hlmSidebarMenuButton
                routerLinkActive
                #rla="routerLinkActive"
                [routerLink]="item.url"
                [class.bg-accent]="rla.isActive">
                <ng-icon [name]="item.icon" hlm />
                <span>{{ item.title }}</span>
              </a>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
})
export class NavMain {
  items = input.required<NavMainItem[]>();
}
