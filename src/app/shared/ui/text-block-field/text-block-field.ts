import { Component, input } from '@angular/core';
import { HlmTypographyImports } from '@neotic/helm/typography';
import { FormField } from '../../models/field';

@Component({
  imports: [HlmTypographyImports],
  selector: 'app-text-block-field',
  styles: ``,
  template: `
    @switch (field().typographyVariant) {
      @case ('h1') {
        <h1 hlmH1>{{ field().content || field().label }}</h1>
      }
      @case ('h2') {
        <h2 hlmH2>{{ field().content || field().label }}</h2>
      }
      @case ('h3') {
        <h3 hlmH3>{{ field().content || field().label }}</h3>
      }
      @case ('h4') {
        <h4 hlmH4>{{ field().content || field().label }}</h4>
      }
      @case ('lead') {
        <p hlmLead>{{ field().content || field().label }}</p>
      }
      @case ('large') {
        <div hlmLarge>{{ field().content || field().label }}</div>
      }
      @case ('small') {
        <small hlmSmall>{{ field().content || field().label }}</small>
      }
      @case ('muted') {
        <p hlmMuted>{{ field().content || field().label }}</p>
      }
      @case ('blockquote') {
        <blockquote hlmBlockquote>
          {{ field().content || field().label }}
        </blockquote>
      }
      @case ('code') {
        <code hlmCode>{{ field().content || field().label }}</code>
      }
      @default {
        <p hlmP>{{ field().content || field().label }}</p>
      }
    }
  `,
})
export class TextBlockField {
  field = input.required<FormField>();
}
