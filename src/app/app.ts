import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterImports } from '@neotic/helm/sonner';

@Component({
  imports: [RouterOutlet, HlmToasterImports],
  selector: 'app-root',
  styles: ``,
  template: `
    <hlm-toaster />
    <div
      class="pointer-events-none fixed top-0 left-0 z-40 h-345 w-140 -translate-y-87.5 -rotate-45 bg-radial-(--spotlight-gradient)"></div>
    <router-outlet />
  `,
})
export class App {
  protected readonly title = signal('noetic');
}
