import { Component, computed, input } from '@angular/core';
import { HlmInputOtpImports } from '@neotic/helm/input-otp';
import { FormField } from '../../models/field';

@Component({
  imports: [HlmInputOtpImports],
  selector: 'app-otp-field',
  styles: ``,
  host: {
    class: 'flex justify-center',
  },
  template: `
    <hlm-input-otp
      [length]="otpLength()"
      [inputMode]="inputMode()"
      [inputId]="field().id">
      @for (group of slotGroups(); track $index; let isLast = $last) {
        <div hlmInputOtpGroup>
          @for (slotIndex of group; track slotIndex) {
            <hlm-input-otp-slot [index]="slotIndex" />
          }
        </div>
        @if (!isLast) {
          <hlm-input-otp-separator />
        }
      }
    </hlm-input-otp>
  `,
})
export class OtpField {
  field = input.required<FormField>();

  otpLength = computed(() => this.field().otpLength ?? 6);
  inputMode = computed(() => this.field().otpInputMode ?? 'numeric');
  separatorStyle = computed(() => this.field().otpSeparator ?? 'none');

  slotGroups = computed(() => {
    const length = this.otpLength();
    const style = this.separatorStyle();

    if (style === 'none') return [Array.from({ length }, (_, i) => i)];
    if (style === 'middle') {
      const mid = Math.floor(length / 2);
      return [
        Array.from({ length: mid }, (_, i) => i),
        Array.from({ length: length - mid }, (_, i) => mid + i),
      ];
    }
    // every-3
    const groups: number[][] = [];
    for (let i = 0; i < length; i += 3) {
      groups.push(
        Array.from({ length: Math.min(3, length - i) }, (_, j) => i + j),
      );
    }
    return groups;
  });
}
