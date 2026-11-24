import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from '../../models/field';
import { CheckboxField } from './checkbox-field';

function makeField(overrides: Partial<FormField> = {}): FormField {
  return {
    id: 'f1',
    type: 'checkbox',
    required: false,
    label: 'Accept terms',
    ...overrides,
  };
}

describe('CheckboxField', () => {
  let component: CheckboxField;
  let fixture: ComponentFixture<CheckboxField>;
  let el: HTMLElement;

  async function setField(field: FormField) {
    fixture = TestBed.createComponent(CheckboxField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxField],
    }).compileComponents();
    await setField(makeField());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the checkbox and its label', () => {
    expect(el.querySelector('hlm-checkbox')).toBeTruthy();
    expect(el.querySelector('label')!.textContent).toContain('Accept terms');
  });

  it('should link the label to the checkbox input id', () => {
    const brnCheckbox = el.querySelector('[id="f1"]');
    expect(brnCheckbox).toBeTruthy();
    expect(el.querySelector('label')!.getAttribute('for')).toBe('f1');
  });

  it('should hide the label when showLabel is false', async () => {
    await setField(makeField({ showLabel: false }));

    expect(el.querySelector('label')).toBeNull();
    expect(el.querySelector('hlm-checkbox')).toBeTruthy();
  });
});
