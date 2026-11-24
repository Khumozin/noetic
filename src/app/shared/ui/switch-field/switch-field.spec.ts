import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from '../../models/field';
import { SwitchField } from './switch-field';

function makeField(overrides: Partial<FormField> = {}): FormField {
  return {
    id: 'f1',
    type: 'switch',
    required: false,
    label: 'Enable notifications',
    ...overrides,
  };
}

describe('SwitchField', () => {
  let component: SwitchField;
  let fixture: ComponentFixture<SwitchField>;
  let el: HTMLElement;

  async function setField(field: FormField) {
    fixture = TestBed.createComponent(SwitchField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchField],
    }).compileComponents();
    await setField(makeField());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the switch and its label', () => {
    expect(el.querySelector('hlm-switch')).toBeTruthy();
    expect(el.querySelector('label')!.textContent).toContain(
      'Enable notifications',
    );
  });

  it('should link the label to the switch input id', () => {
    expect(el.querySelector('label')!.getAttribute('for')).toBe('f1');
  });

  it('should hide the label when showLabel is false', async () => {
    await setField(makeField({ showLabel: false }));

    expect(el.querySelector('label')).toBeNull();
    expect(el.querySelector('hlm-switch')).toBeTruthy();
  });
});
