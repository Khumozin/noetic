import { Component } from '@angular/core';
import { HlmSidebarImports } from '@neotic/helm/sidebar';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeftRight,
  lucideBell,
  lucideBlocks,
  lucideChevronsUpDown,
  lucideGitBranch,
  lucideGlobe,
  lucideLayoutGrid,
  lucideLayoutTemplate,
  lucideTable2,
} from '@ng-icons/lucide';
import { NavMain } from '../nav-main/nav-main';
import { NavUser } from '../nav-user/nav-user';
import { TeamSwitcher } from '../team-switcher/team-switcher';

const data = {
  user: {
    name: 'Khumo Mogorosi',
    email: 'm@example.com',
    avatar:
      'https://avatars.githubusercontent.com/u/30941916?s=400&u=99cb30e3609f8089467a7b3bd3f7570b5178e8ea&v=4',
  },
  teams: [
    {
      name: 'UI Builder',
      logo: 'lucideBlocks',
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Pages',
      url: '/pages',
      icon: 'lucideLayoutTemplate',
      items: [],
    },
  ],
};

@Component({
  imports: [HlmSidebarImports, NavMain, NavUser, TeamSwitcher],
  providers: [
    provideIcons({
      lucideBlocks,
      lucideLayoutGrid,
      lucideLayoutTemplate,
      lucideArrowLeftRight,
      lucideTable2,
      lucideGlobe,
      lucideBell,
      lucideGitBranch,
      lucideChevronsUpDown,
    }),
  ],
  selector: 'app-sidebar',
  styles: ``,
  template: `
    <hlm-sidebar [collapsible]="'icon'" data-cy="sidebar">
      <div hlmSidebarHeader>
        <app-team-switcher [teams]="_data.teams" />
      </div>
      <div hlmSidebarContent>
        <app-nav-main [items]="_data.navMain" />
      </div>
      <div hlmSidebarFooter>
        <app-nav-user [user]="_data.user" />
      </div>
    </hlm-sidebar>
  `,
})
export class Sidebar {
  readonly _data = data;
}
