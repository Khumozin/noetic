import { ComponentFixture, TestBed } from '@angular/core/testing';
import Apps from './apps';

describe('Apps', () => {
  let component: Apps;
  let fixture: ComponentFixture<Apps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Apps],
    }).compileComponents();

    fixture = TestBed.createComponent(Apps);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render primary and content outlets', () => {
    const outlets = fixture.nativeElement.querySelectorAll('router-outlet');

    expect(outlets).toHaveLength(2);
    expect(outlets[1].getAttribute('name')).toBe('content');
  });

  it('should lay out list and content side by side', () => {
    const host: HTMLElement = fixture.nativeElement;
    const aside = host.querySelector('aside');
    const section = host.querySelector('section');

    expect(host.classList).toContain('flex');
    expect(aside?.querySelector('router-outlet:not([name])')).toBeTruthy();
    expect(section?.querySelector('router-outlet[name=content]')).toBeTruthy();
    expect(aside?.nextElementSibling).toBe(section);
  });

  it('should split 80/20 between list and metadata', () => {
    const host: HTMLElement = fixture.nativeElement;

    expect(host.querySelector('aside')?.classList).toContain('basis-4/5');
    expect(host.querySelector('section')?.classList).toContain('basis-1/5');
  });
});
