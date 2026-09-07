import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavMain } from '../nav-main/nav-main';
import { NavUser } from '../nav-user/nav-user';
import { TeamSwitcher } from '../team-switcher/team-switcher';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();
  });

  it('passes the configured teams to the team switcher', () => {
    const teamSwitcher = fixture.debugElement.query(
      el => el.componentInstance instanceof TeamSwitcher,
    ).componentInstance as TeamSwitcher;

    expect(teamSwitcher.teams()).toEqual([
      { name: 'UI Builder', logo: 'lucideBlocks', plan: 'Free' },
    ]);
  });

  it('passes the configured navigation items to nav-main', () => {
    const navMain = fixture.debugElement.query(
      el => el.componentInstance instanceof NavMain,
    ).componentInstance as NavMain;

    expect(navMain.items()).toEqual([
      {
        title: 'Pages',
        url: '/pages',
        icon: 'lucideLayoutTemplate',
        items: [],
      },
    ]);
  });

  it('passes the configured user to nav-user', () => {
    const navUser = fixture.debugElement.query(
      el => el.componentInstance instanceof NavUser,
    ).componentInstance as NavUser;

    expect(navUser.user()).toEqual(
      expect.objectContaining({
        name: 'Khumo Mogorosi',
        email: 'm@example.com',
      }),
    );
  });

  it('marks the sidebar collapsible by icon', () => {
    const sidebarEl: HTMLElement = fixture.nativeElement.querySelector(
      '[data-cy="sidebar"]',
    );

    expect(sidebarEl).not.toBeNull();
  });
});
