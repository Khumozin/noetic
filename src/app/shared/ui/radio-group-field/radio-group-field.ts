import { Component, computed, input } from '@angular/core';
import { HlmLabelImports } from '@neotic/helm/label';
import { HlmRadioGroupImports } from '@neotic/helm/radio-group';
import { FormField } from '../../models/field';
import { getValueForViewport } from '../../utils/responsive-helpers';

@Component({
  imports: [HlmLabelImports, HlmRadioGroupImports],
  selector: 'app-radio-group-field',
  styles: ``,
  template: `
    @if (shouldShowLabel()) {
      <label hlmLabel class="mb-2" [for]="field().id">
        {{ field().label }}
      </label>
    }

    <hlm-radio-group>
      @for (option of field().options || []; track option.value) {
        <div class="flex items-center gap-3">
          <hlm-radio
            [inputId]="field().id + '-' + option.value"
            [value]="option.value">
            <hlm-radio-indicator indicator />
          </hlm-radio>
          <label hlmLabel [for]="field().id + '-' + option.value">
            {{ option.label }}
          </label>
        </div>
      }
    </hlm-radio-group>
  `,
})
export class RadioGroupField {
  field = input.required<FormField>();

  shouldShowLabel = computed(() =>
    getValueForViewport(this.field().showLabel, 'lg', true),
  );
}
