import { Component, computed, input } from '@angular/core';
import { HlmTypographyImports } from '@neotic/helm/typography';
import { FormField } from '../../models/field';

/**
 * A focused heading block (h1-h4), for palette entries that want "Heading"
 * as its own item rather than one more case of text-block-field's switch.
 */
@Component({
  imports: [HlmTypographyImports],
  selector: 'app-heading-field',
  styles: ``,
  template: `
    @switch (level()) {
      @case ('h1') {
        <h1 hlmH1>{{ text() }}</h1>
      }
      @case ('h3') {
        <h3 hlmH3>{{ text() }}</h3>
      }
      @case ('h4') {
        <h4 hlmH4>{{ text() }}</h4>
      }
      @default {
        <h2 hlmH2>{{ text() }}</h2>
      }
    }
  `,
})
export class HeadingField {
  field = input.required<FormField>();

  protected readonly text = computed(
    () => this.field().content || this.field().label,
  );

  protected readonly level = computed(() => {
    const variant = this.field().typographyVariant;
    return variant === 'h1' || variant === 'h3' || variant === 'h4'
      ? variant
      : 'h2';
  });
}
