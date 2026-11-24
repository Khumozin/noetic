import { Component, input } from '@angular/core';
import { HlmButtonImports } from '@neotic/helm/button';
import { FormField } from '../../models/field';

@Component({
  imports: [HlmButtonImports],
  selector: 'app-button-field',
  styles: ``,
  template: `
    <button
      hlmBtn
      class="w-full"
      [variant]="field().variant"
      [type]="field().type">
      {{ field().content }}
    </button>
  `,
})
export class ButtonField {
  field = input.required<FormField>();
}
