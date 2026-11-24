import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from '../../models/field';
import { InlineCodeField } from './inline-code-field';

function makeField(overrides: Partial<FormField> = {}): FormField {
  return {
    id: 'f1',
    type: 'inline-code',
    required: false,
    label: 'Fallback snippet',
    content: 'npm install',
    ...overrides,
  };
}

describe('InlineCodeField', () => {
  let component: InlineCodeField;
  let fixture: ComponentFixture<InlineCodeField>;
  let el: HTMLElement;

  async function setField(field: FormField) {
    fixture = TestBed.createComponent(InlineCodeField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InlineCodeField],
    }).compileComponents();
    await setField(makeField());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the content inside a code element', () => {
    expect(el.querySelector('code')?.textContent?.trim()).toBe('npm install');
  });

  it('should fall back to the label when there is no content', async () => {
    await setField(makeField({ content: undefined }));

    expect(el.querySelector('code')?.textContent?.trim()).toBe(
      'Fallback snippet',
    );
  });
});
