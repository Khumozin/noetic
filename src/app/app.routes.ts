import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/components/main-layout/main-layout'),
    children: [
      {
        path: 'pages',
        loadComponent: () => import('./features/pages/pages'),
      },
    ],
  },
];
