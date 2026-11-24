import { Component, computed, input } from '@angular/core';
import { HlmCode } from '@neotic/helm/typography';
import { FormField } from '../../models/field';

/** A single inline code snippet, e.g. for documenting an API or shortcut. */
@Component({
  imports: [HlmCode],
  selector: 'app-inline-code-field',
  styles: ``,
  template: `
    <code hlmCode>{{ text() }}</code>
  `,
})
export class InlineCodeField {
  field = input.required<FormField>();

  protected readonly text = computed(
    () => this.field().content || this.field().label,
  );
}
