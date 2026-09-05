import { Component, signal } from '@angular/core';
import { HlmButtonImports } from '@neotic/helm/button';

@Component({
  imports: [HlmButtonImports],
  selector: 'app-root',
  styles: ``,
  template: `
    <button hlmBtn>Noetic</button>
  `,
})
export class App {
  protected readonly title = signal('noetic');
}
