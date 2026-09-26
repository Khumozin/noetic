import { Routes } from '@angular/router';

const APPS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./apps'),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/apps-list/apps-list'),
      },
    ],
  },
];

export default APPS_ROUTES;
