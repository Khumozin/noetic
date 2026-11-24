import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from '../../models/field';
import { ListField } from './list-field';

function makeField(overrides: Partial<FormField> = {}): FormField {
  return {
    id: 'f1',
    type: 'list',
    required: false,
    label: 'Checklist',
    options: [
      { label: 'First item', value: 'a' },
      { label: 'Second item', value: 'b' },
    ],
    ...overrides,
  };
}

describe('ListField', () => {
  let component: ListField;
  let fixture: ComponentFixture<ListField>;
  let el: HTMLElement;

  async function setField(field: FormField) {
    fixture = TestBed.createComponent(ListField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListField],
    }).compileComponents();
    await setField(makeField());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a bullet list by default', () => {
    const ul = el.querySelector('ul')!;
    const items = ul.querySelectorAll('li');

    expect(ul).toBeTruthy();
    expect(el.querySelector('ol')).toBeNull();
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toBe('First item');
    expect(items[1].textContent).toBe('Second item');
  });

  it('should render a numbered list when inputType is ordered', async () => {
    await setField(makeField({ inputType: 'ordered' }));

    expect(el.querySelector('ol')).toBeTruthy();
    expect(el.querySelector('ul')).toBeNull();
    expect(el.querySelectorAll('li')).toHaveLength(2);
  });

  it('should fall back to the raw value when an option has no label', async () => {
    await setField(makeField({ options: [{ value: 'raw-value' }] }));

    expect(el.querySelector('li')?.textContent).toBe('raw-value');
  });

  it('should render no items when there are no options', async () => {
    await setField(makeField({ options: [] }));

    expect(el.querySelectorAll('li')).toHaveLength(0);
  });
});
