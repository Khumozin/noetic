import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavUser } from './nav-user';

describe('NavUser', () => {
  let fixture: ComponentFixture<NavUser>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NavUser],
    });

    fixture = TestBed.createComponent(NavUser);
    fixture.componentRef.setInput('user', {
      name: 'Khumo Mogorosi',
      email: 'khumo@example.com',
      avatar: 'https://example.com/avatar.png',
    });
    fixture.detectChanges();
  });

  it('renders the user name and email', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Khumo Mogorosi');
    expect(text).toContain('khumo@example.com');
  });

  it('renders the avatar fallback before the image has loaded', () => {
    const fallback = fixture.nativeElement.querySelector('[hlmAvatarFallback]');

    expect(fallback?.textContent?.trim()).toBe('KM');
  });

  it('opens a menu with the user actions on trigger click', async () => {
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[hlmSidebarMenuButton]',
    );

    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const overlay = document.querySelector('.cdk-overlay-container');
    const itemLabels = Array.from(
      overlay?.querySelectorAll('[hlmDropdownMenuItem]') ?? [],
    ).map(item => item.textContent?.trim());

    expect(itemLabels).toEqual([
      'Upgrade to Pro',
      'Account',
      'Billing',
      'Notifications',
      'Log out',
    ]);
  });
});
