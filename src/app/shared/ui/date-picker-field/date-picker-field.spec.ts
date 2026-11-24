import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { FormField } from '../../models/field';
import { DatePickerField } from './date-picker-field';

function makeField(overrides: Partial<FormField> = {}): FormField {
  return {
    id: 'f1',
    type: 'date',
    required: false,
    label: 'Start date',
    placeholder: 'Select a date',
    ...overrides,
  };
}

describe('DatePickerField', () => {
  let component: DatePickerField;
  let fixture: ComponentFixture<DatePickerField>;
  let el: HTMLElement;

  async function setField(field: FormField) {
    fixture = TestBed.createComponent(DatePickerField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    // the calendar popover needs these, which jsdom doesn't implement
    Element.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
      },
    );

    await TestBed.configureTestingModule({
      imports: [DatePickerField],
    }).compileComponents();
    await setField(makeField());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label and placeholder on the trigger', () => {
    expect(el.querySelector('label')!.textContent).toContain('Start date');
    expect(el.querySelector('button')!.textContent).toContain('Select a date');
  });

  it('should link the label to the trigger button', () => {
    expect(el.querySelector('label')!.getAttribute('for')).toBe('f1');
    expect(el.querySelector('button')!.id).toBe('f1');
  });

  it('should hide the label when showLabel is false', async () => {
    await setField(makeField({ showLabel: false }));

    expect(el.querySelector('label')).toBeNull();
    expect(el.querySelector('hlm-date-picker')).toBeTruthy();
  });
});
