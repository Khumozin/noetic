import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from '../../models/field';
import { TextBlockField } from './text-block-field';

function makeField(overrides: Partial<FormField> = {}): FormField {
  return {
    id: 'f1',
    type: 'text-block',
    required: false,
    label: 'Fallback label',
    content: 'Hello world',
    ...overrides,
  };
}

describe('TextBlockField', () => {
  let component: TextBlockField;
  let fixture: ComponentFixture<TextBlockField>;
  let el: HTMLElement;

  async function setField(field: FormField) {
    fixture = TestBed.createComponent(TextBlockField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextBlockField],
    }).compileComponents();
  });

  it('should create', async () => {
    await setField(makeField());
    expect(component).toBeTruthy();
  });

  it.each([
    ['h1', 'h1'],
    ['h2', 'h2'],
    ['h3', 'h3'],
    ['h4', 'h4'],
    ['lead', 'p'],
    ['small', 'small'],
    ['muted', 'p'],
    ['blockquote', 'blockquote'],
    ['code', 'code'],
  ] as const)('should render %s as a <%s>', async (variant, tag) => {
    await setField(makeField({ typographyVariant: variant }));

    const node = el.querySelector(tag)!;
    expect(node).toBeTruthy();
    expect(node.textContent).toContain('Hello world');
  });

  it('should render large as a div', async () => {
    await setField(makeField({ typographyVariant: 'large' }));

    expect(el.querySelector('div')?.textContent).toContain('Hello world');
  });

  it('should default to a paragraph when no variant is set', async () => {
    await setField(makeField({ typographyVariant: undefined }));

    expect(el.querySelector('p')?.textContent).toContain('Hello world');
  });

  it('should fall back to the label when there is no content', async () => {
    await setField(makeField({ content: undefined }));

    expect(el.textContent).toContain('Fallback label');
  });
});
