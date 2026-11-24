import { Component, computed, input } from '@angular/core';
import { HlmFieldImports } from '@neotic/helm/field';
import { HlmTextareaImports } from '@neotic/helm/textarea';
import { FormField } from '../../models/field';
import { getValueForViewport } from '../../utils/responsive-helpers';

@Component({
  imports: [HlmFieldImports, HlmTextareaImports],
  selector: 'app-text-area-field',
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

      <textarea
        hlmTextarea
        [id]="field().id"
        [placeholder]="field().placeholder || ''"
        [class.mb-0]="labelPosition() !== 'top'"
        class="min-h-20"></textarea>

      @if (field().hint) {
        <p hlmFieldDescription>{{ field().hint }}</p>
      }
    </div>
  `,
})
export class TextAreaField {
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
