import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from '../../models/field';
import { HeadingField } from './heading-field';

function makeField(overrides: Partial<FormField> = {}): FormField {
  return {
    id: 'f1',
    type: 'heading',
    required: false,
    label: 'Fallback heading',
    content: 'Section title',
    ...overrides,
  };
}

describe('HeadingField', () => {
  let component: HeadingField;
  let fixture: ComponentFixture<HeadingField>;
  let el: HTMLElement;

  async function setField(field: FormField) {
    fixture = TestBed.createComponent(HeadingField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadingField],
    }).compileComponents();
    await setField(makeField());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to h2', () => {
    expect(el.querySelector('h2')?.textContent).toContain('Section title');
  });

  it.each(['h1', 'h3', 'h4'] as const)('should render %s', async level => {
    await setField(makeField({ typographyVariant: level }));

    expect(el.querySelector(level)?.textContent).toContain('Section title');
  });

  it('should fall back to h2 for a non-heading variant', async () => {
    await setField(makeField({ typographyVariant: 'blockquote' }));

    expect(el.querySelector('h2')).toBeTruthy();
  });

  it('should fall back to the label when there is no content', async () => {
    await setField(makeField({ content: undefined }));

    expect(el.textContent).toContain('Fallback heading');
  });
});
