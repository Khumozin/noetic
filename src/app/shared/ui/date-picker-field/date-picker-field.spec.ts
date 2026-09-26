import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePickerField } from './date-picker-field';

describe('DatePickerField', () => {
  let component: DatePickerField;
  let fixture: ComponentFixture<DatePickerField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerField],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
