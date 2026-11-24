import { Component, computed, input } from '@angular/core';
import { HlmLabelImports } from '@neotic/helm/label';
import { HlmSwitchImports } from '@neotic/helm/switch';
import { FormField } from '../../models/field';
import { getValueForViewport } from '../../utils/responsive-helpers';

@Component({
  imports: [HlmLabelImports, HlmSwitchImports],
  selector: 'app-switch-field',
  styles: ``,
  template: `
    <div class="flex items-center">
      <hlm-switch class="mr-2" [inputId]="field().id" />
      @if (shouldShowLabel()) {
        <label hlmLabel [for]="field().id">
          {{ field().label }}
        </label>
      }
    </div>
  `,
})
export class SwitchField {
  field = input.required<FormField>();

  shouldShowLabel = computed(() =>
    getValueForViewport(this.field().showLabel, 'lg', true),
  );
}
