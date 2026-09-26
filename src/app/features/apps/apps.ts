import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-apps',
  styles: ``,
  template: `
    <router-outlet />
  `,
  host: {
    class: 'w-full',
  },
})
export default class Apps {}
