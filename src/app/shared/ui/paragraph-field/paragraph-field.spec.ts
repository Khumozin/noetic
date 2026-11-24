import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from '../../models/field';
import { ParagraphField } from './paragraph-field';

function makeField(overrides: Partial<FormField> = {}): FormField {
  return {
    id: 'f1',
    type: 'paragraph',
    required: false,
    label: 'Fallback text',
    content: 'Body copy goes here.',
    ...overrides,
  };
}

describe('ParagraphField', () => {
  let component: ParagraphField;
  let fixture: ComponentFixture<ParagraphField>;
  let el: HTMLElement;

  async function setField(field: FormField) {
    fixture = TestBed.createComponent(ParagraphField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParagraphField],
    }).compileComponents();
    await setField(makeField());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a plain paragraph by default', () => {
    const p = el.querySelector('p')!;
    expect(p.textContent).toContain('Body copy goes here.');
    expect(p.className).not.toContain('text-muted-foreground');
  });

  it('should render the lead variant', async () => {
    await setField(makeField({ typographyVariant: 'lead' }));

    expect(el.querySelector('p')?.textContent).toContain(
      'Body copy goes here.',
    );
  });

  it('should render the muted variant', async () => {
    await setField(makeField({ typographyVariant: 'muted' }));

    expect(el.querySelector('p')?.className).toContain('text-muted-foreground');
  });

  it('should fall back to the label when there is no content', async () => {
    await setField(makeField({ content: undefined }));

    expect(el.textContent).toContain('Fallback text');
  });
});
