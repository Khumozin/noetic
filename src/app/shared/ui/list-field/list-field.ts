import { Component, computed, input } from '@angular/core';
import { HlmUl } from '@neotic/helm/typography';
import { FormField } from '../../models/field';

/** A bullet or numbered list, built from the field's options. */
@Component({
  imports: [HlmUl],
  selector: 'app-list-field',
  styles: ``,
  template: `
    @if (ordered()) {
      <ol class="my-6 ml-6 list-decimal [&>li]:mt-2">
        @for (item of items(); track $index) {
          <li>{{ item.label ?? item.value }}</li>
        }
      </ol>
    } @else {
      <ul hlmUl>
        @for (item of items(); track $index) {
          <li>{{ item.label ?? item.value }}</li>
        }
      </ul>
    }
  `,
})
export class ListField {
  field = input.required<FormField>();

  protected readonly items = computed(() => this.field().options ?? []);
  protected readonly ordered = computed(
    () => this.field().inputType === 'ordered',
  );
}
