import { Component, input, linkedSignal } from '@angular/core';
import { HlmCollapsibleImports } from '@neotic/helm/collapsible';
import { HlmDropdownMenuImports } from '@neotic/helm/dropdown-menu';
import { HlmSidebarImports } from '@neotic/helm/sidebar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBlocks, lucidePlus } from '@ng-icons/lucide';

interface Team {
  name: string;
  logo: string;
  plan: string;
}

@Component({
  imports: [
    HlmSidebarImports,
    HlmCollapsibleImports,
    HlmDropdownMenuImports,
    NgIcon,
  ],
  providers: [provideIcons({ lucideBlocks, lucidePlus })],
  selector: 'app-team-switcher',
  styles: ``,
  template: `
    <ul hlmSidebarMenu>
      <li hlmSidebarMenuItem>
        <!-- class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"   -->
        <a
          hlmSidebarMenuButton
          [hlmDropdownMenuTrigger]="menu"
          align="center"
          size="lg"
          class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <!-- bg-foreground text-accent  -->
          <div
            class="bg-primary text-sidebar-accent flex aspect-square size-8 items-center justify-center rounded-lg border">
            <ng-icon [name]="activeTeam()?.logo" class="size-4" />
          </div>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-medium">{{ activeTeam()?.name }}</span>
            <span class="truncate text-xs">{{ activeTeam()?.plan }}</span>
          </div>
          <ng-icon name="lucideChevronsUpDown" class="ml-auto" />
        </a>
      </li>
    </ul>

    <ng-template #menu>
      <hlm-dropdown-menu
        class="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg">
        <hlm-dropdown-menu-label class="text-muted-foreground text-xs">
          Teams
        </hlm-dropdown-menu-label>

        <hlm-dropdown-menu-group>
          @for (team of teams(); track $index) {
            <button
              hlmDropdownMenuItem
              class="gap-2 p-2"
              (click)="activeTeam.set(team)">
              <div
                class="flex size-6 items-center justify-center rounded-md border">
                <ng-icon [name]="team.logo" class="size-3.5 shrink-0" />
              </div>
              {{ team.name }}
              <div hlmSidebarMenuBadge>⌘{{ $index + 1 }}</div>
            </button>
          }
        </hlm-dropdown-menu-group>

        <hlm-dropdown-menu-separator />

        <hlm-dropdown-menu-group>
          <button hlmDropdownMenuItem class="gap-2 p-2">
            <div
              class="flex size-6 items-center justify-center rounded-md border bg-transparent">
              <ng-icon hlm name="lucidePlus" class="size-4" />
            </div>
            <div class="text-muted-foreground font-medium">Add team</div>
          </button>
        </hlm-dropdown-menu-group>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class TeamSwitcher {
  readonly teams = input.required<Team[]>();

  readonly activeTeam = linkedSignal(() => {
    const teams = this.teams();
    if (teams.length) {
      return teams[0];
    }

    return null;
  });
}
