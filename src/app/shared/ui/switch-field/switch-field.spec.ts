import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwitchField } from './switch-field';

describe('SwitchField', () => {
  let component: SwitchField;
  let fixture: ComponentFixture<SwitchField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchField],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
