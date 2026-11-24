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
      {
        path: 'detail/:id',
        loadComponent: () => import('./features/page-detail/page-detail'),
        outlet: 'content',
      },
    ],
  },
];

export default PAGES_ROUTES;
