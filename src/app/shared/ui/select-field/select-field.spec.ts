import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { FormField } from '../../models/field';
import { SelectField } from './select-field';

function makeField(overrides: Partial<FormField> = {}): FormField {
  return {
    id: 'f1',
    type: 'select',
    required: false,
    label: 'Country',
    options: [
      { value: 'za', label: 'South Africa' },
      { value: 'us', label: 'United States' },
    ],
    ...overrides,
  };
}

describe('SelectField', () => {
  let component: SelectField;
  let fixture: ComponentFixture<SelectField>;
  let el: HTMLElement;

  async function setField(field: FormField) {
    fixture = TestBed.createComponent(SelectField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    // the select panel portals to document.body and needs these, which jsdom
    // doesn't implement
    Element.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
      },
    );

    await TestBed.configureTestingModule({
      imports: [SelectField],
    }).compileComponents();
    await setField(makeField());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label linked to the trigger', () => {
    const trigger = el.querySelector<HTMLButtonElement>('#f1')!;

    expect(el.querySelector('label')!.textContent).toContain('Country');
    expect(el.querySelector('label')!.getAttribute('for')).toBe('f1');
    expect(trigger).toBeTruthy();
  });

  it('should list every option when opened', async () => {
    el.querySelector<HTMLButtonElement>('#f1')!.click();
    await fixture.whenStable();

    const labels = Array.from(document.querySelectorAll('hlm-select-item')).map(
      i => i.textContent?.trim(),
    );
    expect(labels).toEqual(['South Africa', 'United States']);
  });

  it('should hide the label when showLabel is false', async () => {
    await setField(makeField({ showLabel: false }));

    expect(el.querySelector('label')).toBeNull();
  });
});
