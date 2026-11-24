import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from '../../models/field';
import { TextAreaField } from './text-area-field';

function makeField(overrides: Partial<FormField> = {}): FormField {
  return {
    id: 'f1',
    type: 'textarea',
    required: false,
    label: 'Bio',
    ...overrides,
  };
}

describe('TextAreaField', () => {
  let component: TextAreaField;
  let fixture: ComponentFixture<TextAreaField>;
  let el: HTMLElement;

  async function setField(field: FormField) {
    fixture = TestBed.createComponent(TextAreaField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAreaField],
    }).compileComponents();
    await setField(makeField());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label linked to the textarea', () => {
    const label = el.querySelector('label')!;
    const textarea = el.querySelector('textarea')!;

    expect(label.textContent).toContain('Bio');
    expect(label.getAttribute('for')).toBe('f1');
    expect(textarea.id).toBe('f1');
  });

  it('should set the placeholder', async () => {
    await setField(makeField({ placeholder: 'Tell us about yourself' }));

    expect(el.querySelector('textarea')!.placeholder).toBe(
      'Tell us about yourself',
    );
  });

  it('should hide the label when showLabel is false', async () => {
    await setField(makeField({ showLabel: false }));

    expect(el.querySelector('label')).toBeNull();
  });

  it('should show the hint as a field description', async () => {
    await setField(makeField({ hint: 'Markdown supported' }));

    expect(el.textContent).toContain('Markdown supported');
  });
});
