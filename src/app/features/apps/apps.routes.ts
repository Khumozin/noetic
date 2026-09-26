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
      {
        path: 'metadata/:id',
        loadComponent: () => import('./features/app-metadata/app-metadata'),
        outlet: 'content',
      },
    ],
  },
];

export default APPS_ROUTES;
