import { Component, computed, input } from '@angular/core';
import { HlmFieldImports } from '@neotic/helm/field';
import { HlmInputImports } from '@neotic/helm/input';
import { FormField } from '../../models/field';
import { getValueForViewport } from '../../utils/responsive-helpers';

@Component({
  imports: [HlmFieldImports, HlmInputImports],
  selector: 'app-text-field',
  styles: ``,
  template: `
    <div
      hlmField
      [class.flex]="labelPosition() || labelAlignment()"
      [class.flex-col]="labelPosition() === 'top'"
      [class.flex-row]="labelPosition() === 'right'"
      [class.flex-row-reverse]="labelPosition() === 'left'"
      [class.items-start]="labelAlignment() === 'alignLeft'"
      [class.items-end]="labelAlignment() === 'alignRight'"
      [class.items-center]="labelAlignment() === 'alignCenter'">
      @if (shouldShowLabel()) {
        <label hlmFieldLabel [for]="field().id">
          {{ field().label }}
        </label>
      }

      <input
        hlmInput
        [type]="field().inputType || 'text'"
        [id]="field().id"
        [placeholder]="field().placeholder || ''"
        [class.mb-0]="labelPosition() !== 'top'" />

      @if (field().hint) {
        <p hlmFieldDescription>{{ field().hint }}</p>
      }
    </div>
  `,
})
export class TextField {
  field = input.required<FormField>();

  shouldShowLabel = computed(() =>
    getValueForViewport(this.field().showLabel, 'lg', true),
  );

  labelPosition = computed(() =>
    getValueForViewport(this.field().labelPosition, 'lg', 'top'),
  );

  labelAlignment = computed(() =>
    getValueForViewport(this.field().labelAlignment, 'lg', 'alignLeft'),
  );
}
