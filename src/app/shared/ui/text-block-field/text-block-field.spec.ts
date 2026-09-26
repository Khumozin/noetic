import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextBlockField } from './text-block-field';

describe('TextBlockField', () => {
  let component: TextBlockField;
  let fixture: ComponentFixture<TextBlockField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextBlockField],
    }).compileComponents();

    fixture = TestBed.createComponent(TextBlockField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
