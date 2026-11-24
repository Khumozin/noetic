import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from '../../models/field';
import { ButtonField } from './button-field';

function makeField(overrides: Partial<FormField> = {}): FormField {
  return {
    id: 'f1',
    type: 'button',
    required: false,
    label: 'Button',
    content: 'Click me',
    variant: 'outline',
    ...overrides,
  };
}

describe('ButtonField', () => {
  let component: ButtonField;
  let fixture: ComponentFixture<ButtonField>;
  let el: HTMLElement;

  async function setField(field: FormField) {
    fixture = TestBed.createComponent(ButtonField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonField],
    }).compileComponents();
    await setField(makeField());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the content as the button text', () => {
    expect(el.querySelector('button')!.textContent?.trim()).toBe('Click me');
  });

  it('should use the field type as the native button type', async () => {
    await setField(makeField({ type: 'submit' }));

    expect(el.querySelector('button')!.type).toBe('submit');
  });

  it('should apply the variant', () => {
    const button = el.querySelector('button')!;
    expect(button.className).toContain('border');
  });
});
