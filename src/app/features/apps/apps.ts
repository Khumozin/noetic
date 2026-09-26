import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-apps',
  styles: ``,
  template: `
    <aside class="h-full min-w-0 basis-4/5 overflow-y-auto">
      <router-outlet />
    </aside>
    <section
      class="border-border h-full min-w-0 basis-1/5 overflow-y-auto border-l">
      <router-outlet name="content" />
    </section>
  `,
  host: {
    class: 'flex h-full w-full',
  },
})
export default class Apps {}
