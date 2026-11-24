import { Component, computed, input } from '@angular/core';
import { HlmFieldImports } from '@neotic/helm/field';
import { HlmSelectImports } from '@neotic/helm/select';
import { FormField } from '../../models/field';
import { getValueForViewport } from '../../utils/responsive-helpers';

@Component({
  imports: [HlmFieldImports, HlmSelectImports],
  selector: 'app-select-field',
  styles: ``,
  template: `
    <div hlmField>
      @if (shouldShowLabel()) {
        <label hlmFieldLabel [for]="field().id">
          {{ field().label }}
        </label>
      }
      <hlm-select class="inline-block w-full">
        <hlm-select-trigger buttonId="{{ field().id }}" class="w-full">
          <hlm-select-value [placeholder]="field().placeholder || ''" />
        </hlm-select-trigger>
        <hlm-select-content *hlmSelectPortal>
          <hlm-select-group>
            @for (option of field().options || []; track option.value) {
              <hlm-select-item [value]="option.value">
                {{ option.label }}
              </hlm-select-item>
            }
          </hlm-select-group>
        </hlm-select-content>
      </hlm-select>
    </div>
  `,
})
export class SelectField {
  field = input.required<FormField>();

  shouldShowLabel = computed(() =>
    getValueForViewport(this.field().showLabel, 'lg', true),
  );
}
