import { Component, input } from '@angular/core';
import { FormField } from '../../models/field';
import { TextBlockField } from '../text-block-field/text-block-field';

/**
 * The generic typography renderer — every variant text-block-field supports.
 * Delegates to it rather than duplicating its variant switch, so there is one
 * place that maps a `typographyVariant` to markup.
 */
@Component({
  imports: [TextBlockField],
  selector: 'app-typography-field',
  styles: ``,
  template: `
    <app-text-block-field [field]="field()" />
  `,
})
export class TypographyField {
  field = input.required<FormField>();
}
