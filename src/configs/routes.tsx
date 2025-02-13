import { lazy } from 'react';

const HomeLazy = lazy(() => import('../pages/Home/Home'));

export const routes = [
  {
    path: '/',
    element: <HomeLazy />,
    label: 'Home',
  },
];