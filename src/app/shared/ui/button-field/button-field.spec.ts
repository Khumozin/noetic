import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonField } from './button-field';

describe('ButtonField', () => {
  let component: ButtonField;
  let fixture: ComponentFixture<ButtonField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonField],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
