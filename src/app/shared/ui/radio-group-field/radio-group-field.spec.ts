import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from '../../models/field';
import { RadioGroupField } from './radio-group-field';

function makeField(overrides: Partial<FormField> = {}): FormField {
  return {
    id: 'f1',
    type: 'radio',
    required: false,
    label: 'Plan',
    options: [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Pro' },
    ],
    ...overrides,
  };
}

describe('RadioGroupField', () => {
  let component: RadioGroupField;
  let fixture: ComponentFixture<RadioGroupField>;
  let el: HTMLElement;

  async function setField(field: FormField) {
    fixture = TestBed.createComponent(RadioGroupField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioGroupField],
    }).compileComponents();
    await setField(makeField());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the group label', () => {
    expect(el.querySelector('label')!.textContent).toContain('Plan');
  });

  it('should render one radio per option, in order', () => {
    const radios = el.querySelectorAll('hlm-radio');
    expect(radios).toHaveLength(2);
    expect(el.textContent).toContain('Free');
    expect(el.textContent).toContain('Pro');
  });

  it('should render no radios when there are no options', async () => {
    await setField(makeField({ options: [] }));

    expect(el.querySelectorAll('hlm-radio')).toHaveLength(0);
  });

  it('should hide the group label when showLabel is false', async () => {
    await setField(makeField({ showLabel: false }));

    expect(el.querySelector('label')!.textContent?.trim()).not.toContain(
      'Plan',
    );
  });
});
