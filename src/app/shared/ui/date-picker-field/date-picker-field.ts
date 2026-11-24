import { Component, computed, input } from '@angular/core';
import { HlmDatePickerImports } from '@neotic/helm/date-picker';
import { HlmLabelImports } from '@neotic/helm/label';
import { FormField } from '../../models/field';
import { getValueForViewport } from '../../utils/responsive-helpers';

@Component({
  imports: [HlmDatePickerImports, HlmLabelImports],
  selector: 'app-date-picker-field',
  styles: ``,
  template: `
    @if (shouldShowLabel()) {
      <label hlmLabel class="mb-2" [for]="field().id">
        {{ field().label }}
      </label>
    }

    <hlm-date-picker [id]="field().id" class="w-full">
      <hlm-date-picker-trigger class="w-full" [buttonId]="field().id">
        {{ field().placeholder }}
      </hlm-date-picker-trigger>
    </hlm-date-picker>
  `,
})
export class DatePickerField {
  field = input.required<FormField>();

  shouldShowLabel = computed(() =>
    getValueForViewport(this.field().showLabel, 'lg', true),
  );
}
