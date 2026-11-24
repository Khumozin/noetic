import { Component, computed, input } from '@angular/core';
import { HlmTypographyImports } from '@neotic/helm/typography';
import { FormField } from '../../models/field';

/** Body text: plain paragraph, or the 'lead'/'muted' typography variants. */
@Component({
  imports: [HlmTypographyImports],
  selector: 'app-paragraph-field',
  styles: ``,
  template: `
    @switch (field().typographyVariant) {
      @case ('lead') {
        <p hlmLead>{{ text() }}</p>
      }
      @case ('muted') {
        <p hlmMuted>{{ text() }}</p>
      }
      @default {
        <p hlmP>{{ text() }}</p>
      }
    }
  `,
})
export class ParagraphField {
  field = input.required<FormField>();

  protected readonly text = computed(
    () => this.field().content || this.field().label,
  );
}
