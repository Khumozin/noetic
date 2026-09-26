import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioGroupField } from './radio-group-field';

describe('RadioGroupField', () => {
  let component: RadioGroupField;
  let fixture: ComponentFixture<RadioGroupField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioGroupField],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioGroupField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
