import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from '../../models/field';
import { TextField } from './text-field';

function makeField(overrides: Partial<FormField> = {}): FormField {
  return {
    id: 'f1',
    type: 'text',
    required: false,
    label: 'Name',
    ...overrides,
  };
}

describe('TextField', () => {
  let component: TextField;
  let fixture: ComponentFixture<TextField>;
  let el: HTMLElement;

  async function setField(field: FormField) {
    fixture = TestBed.createComponent(TextField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextField],
    }).compileComponents();
    await setField(makeField());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label linked to the input', () => {
    const label = el.querySelector('label')!;
    const input = el.querySelector('input')!;

    expect(label.textContent).toContain('Name');
    expect(label.getAttribute('for')).toBe('f1');
    expect(input.id).toBe('f1');
  });

  it('should default to a text input', () => {
    expect(el.querySelector('input')!.type).toBe('text');
  });

  it('should use inputType for the native input type', async () => {
    await setField(makeField({ inputType: 'email' }));

    expect(el.querySelector('input')!.type).toBe('email');
  });

  it('should set the placeholder', async () => {
    await setField(makeField({ placeholder: 'Jane Doe' }));

    expect(el.querySelector('input')!.placeholder).toBe('Jane Doe');
  });

  it('should hide the label when showLabel is false', async () => {
    await setField(makeField({ showLabel: false }));

    expect(el.querySelector('label')).toBeNull();
  });

  it('should show the hint as a field description', async () => {
    await setField(makeField({ hint: 'Enter your full name' }));

    expect(el.textContent).toContain('Enter your full name');
  });

  it('should not render a description when there is no hint', () => {
    expect(el.querySelector('[data-slot=field-description]')).toBeNull();
  });
});
