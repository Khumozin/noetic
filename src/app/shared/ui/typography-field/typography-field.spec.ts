import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from '../../models/field';
import { TypographyField } from './typography-field';

function makeField(overrides: Partial<FormField> = {}): FormField {
  return {
    id: 'f1',
    type: 'typography',
    required: false,
    label: 'Fallback label',
    content: 'Rendered text',
    typographyVariant: 'h3',
    ...overrides,
  };
}

describe('TypographyField', () => {
  let component: TypographyField;
  let fixture: ComponentFixture<TypographyField>;
  let el: HTMLElement;

  async function setField(field: FormField) {
    fixture = TestBed.createComponent(TypographyField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypographyField],
    }).compileComponents();
    await setField(makeField());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate rendering to text-block-field', () => {
    expect(el.querySelector('app-text-block-field')).toBeTruthy();
    expect(el.querySelector('h3')?.textContent).toContain('Rendered text');
  });

  it('should pass the field through unchanged', async () => {
    await setField(makeField({ typographyVariant: 'blockquote' }));

    expect(el.querySelector('blockquote')?.textContent).toContain(
      'Rendered text',
    );
  });
});
