import { Component, computed, input } from '@angular/core';
import { HlmCheckboxImports } from '@neotic/helm/checkbox';
import { HlmLabelImports } from '@neotic/helm/label';
import { FormField } from '../../models/field';
import { getValueForViewport } from '../../utils/responsive-helpers';

@Component({
  imports: [HlmLabelImports, HlmCheckboxImports],
  selector: 'app-checkbox-field',
  styles: ``,
  template: `
    <div class="flex items-center gap-3">
      <hlm-checkbox [inputId]="field().id" />
      @if (shouldShowLabel()) {
        <label hlmLabel [for]="field().id">
          {{ field().label }}
        </label>
      }
    </div>
  `,
})
export class CheckboxField {
  field = input.required<FormField>();

  shouldShowLabel = computed(() =>
    getValueForViewport(this.field().showLabel, 'lg', true),
  );
}
