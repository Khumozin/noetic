import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from '../../models/field';
import { OtpField } from './otp-field';

function makeField(overrides: Partial<FormField> = {}): FormField {
  return {
    id: 'f1',
    type: 'otp',
    required: false,
    label: 'Code',
    ...overrides,
  };
}

describe('OtpField', () => {
  let component: OtpField;
  let fixture: ComponentFixture<OtpField>;
  let el: HTMLElement;

  async function setField(field: FormField) {
    fixture = TestBed.createComponent(OtpField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpField],
    }).compileComponents();
    await setField(makeField());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to 6 slots with no separator', () => {
    expect(el.querySelectorAll('hlm-input-otp-slot')).toHaveLength(6);
    expect(el.querySelectorAll('hlm-input-otp-separator')).toHaveLength(0);
  });

  it('should respect a custom otpLength', async () => {
    await setField(makeField({ otpLength: 4 }));

    expect(el.querySelectorAll('hlm-input-otp-slot')).toHaveLength(4);
  });

  it('should split into two groups with a middle separator', async () => {
    await setField(makeField({ otpLength: 6, otpSeparator: 'middle' }));

    expect(el.querySelectorAll('[hlmInputOtpGroup]')).toHaveLength(2);
    expect(el.querySelectorAll('hlm-input-otp-separator')).toHaveLength(1);
  });

  it('should split into groups of 3 with every-3 separators', async () => {
    await setField(makeField({ otpLength: 9, otpSeparator: 'every-3' }));

    expect(el.querySelectorAll('[hlmInputOtpGroup]')).toHaveLength(3);
    expect(el.querySelectorAll('hlm-input-otp-separator')).toHaveLength(2);
  });

  it('should set the input mode', async () => {
    await setField(makeField({ otpInputMode: 'text' }));

    expect(el.querySelector('input')!.getAttribute('inputmode')).toBe('text');
  });
});
