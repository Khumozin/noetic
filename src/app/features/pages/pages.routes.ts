import { Routes } from '@angular/router';

const PAGES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages'),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/pages-list/pages-list'),
      },
    ],
  },
];

export default PAGES_ROUTES;
