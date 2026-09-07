import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamSwitcher } from './team-switcher';

describe('TeamSwitcher', () => {
  let fixture: ComponentFixture<TeamSwitcher>;
  let component: TeamSwitcher;

  function setup(teams: { name: string; logo: string; plan: string }[]) {
    TestBed.configureTestingModule({
      imports: [TeamSwitcher],
    });

    fixture = TestBed.createComponent(TeamSwitcher);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('teams', teams);
    fixture.detectChanges();
  }

  it('defaults the active team to the first team', () => {
    setup([
      { name: 'UI Builder', logo: 'lucideBlocks', plan: 'Free' },
      { name: 'Other Team', logo: 'lucideBlocks', plan: 'Pro' },
    ]);

    expect(component.activeTeam()).toEqual({
      name: 'UI Builder',
      logo: 'lucideBlocks',
      plan: 'Free',
    });
  });

  it('renders the active team name and plan', () => {
    setup([{ name: 'UI Builder', logo: 'lucideBlocks', plan: 'Free' }]);

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('UI Builder');
    expect(text).toContain('Free');
  });

  it('has no active team when there are no teams', () => {
    setup([]);

    expect(component.activeTeam()).toBeNull();
  });

  it('re-derives the active team when a new team list drops the current one', () => {
    setup([{ name: 'UI Builder', logo: 'lucideBlocks', plan: 'Free' }]);

    fixture.componentRef.setInput('teams', [
      { name: 'Other Team', logo: 'lucideBlocks', plan: 'Pro' },
    ]);
    fixture.detectChanges();

    expect(component.activeTeam()).toEqual({
      name: 'Other Team',
      logo: 'lucideBlocks',
      plan: 'Pro',
    });
  });

  async function openMenu() {
    const trigger: HTMLAnchorElement = fixture.nativeElement.querySelector(
      'a[hlmSidebarMenuButton]',
    );

    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    return document.querySelector('.cdk-overlay-container') as HTMLElement;
  }

  it('lists every team and an add-team action in the menu', async () => {
    setup([
      { name: 'UI Builder', logo: 'lucideBlocks', plan: 'Free' },
      { name: 'Other Team', logo: 'lucideBlocks', plan: 'Pro' },
    ]);

    const overlay = await openMenu();
    const items = Array.from(
      overlay.querySelectorAll('[hlmDropdownMenuItem]'),
    ).map(item => item.textContent?.trim());

    expect(items).toEqual([
      expect.stringContaining('UI Builder'),
      expect.stringContaining('Other Team'),
      'Add team',
    ]);
  });

  it('switches the active team when a menu item is clicked', async () => {
    setup([
      { name: 'UI Builder', logo: 'lucideBlocks', plan: 'Free' },
      { name: 'Other Team', logo: 'lucideBlocks', plan: 'Pro' },
    ]);

    const overlay = await openMenu();
    const items = Array.from(
      overlay.querySelectorAll<HTMLButtonElement>('[hlmDropdownMenuItem]'),
    );
    const otherTeamItem = items.find(item =>
      item.textContent?.includes('Other Team'),
    );

    otherTeamItem?.click();
    fixture.detectChanges();

    expect(component.activeTeam()).toEqual({
      name: 'Other Team',
      logo: 'lucideBlocks',
      plan: 'Pro',
    });
  });
});
