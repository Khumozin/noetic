import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpField } from './otp-field';

describe('OtpField', () => {
  let component: OtpField;
  let fixture: ComponentFixture<OtpField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpField],
    }).compileComponents();

    fixture = TestBed.createComponent(OtpField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
