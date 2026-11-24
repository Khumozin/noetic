import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/components/main-layout/main-layout'),
    children: [
      {
        path: 'apps',
        loadChildren: () => import('./features/apps/apps.routes'),
      },
      {
        path: 'pages',
        loadChildren: () => import('./features/pages/pages.routes'),
      },
    ],
  },
];
