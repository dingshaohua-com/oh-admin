import { lazy } from 'react';
import { createHashRouter } from 'react-router';
import Layout from '../components/layout';

export const router = createHashRouter([
  {
    path: '/login',
    Component: lazy(() => import('../pages/login')),
  },
  {
    path: '/home',
    Component: lazy(() => import('../pages/home')),
  },
    {
      path: '/',
      
      Component: Layout,
      children: [
        { index: true, Component: lazy(() => import('@/pages/demo')) },
        // { index: true, Component: lazy(() => import('@/pages/welcome')) },
        { path: 'users', Component: lazy(() => import('@/pages/users')) },
        // { path: 'content', Component: lazy(() => import('@/pages/content')) },
        // { path: 'settings', Component: lazy(() => import('@/pages/settings')) },
        // { path: 'settings/security', Component: lazy(() => import('@/pages/settings/security')) },
      ],
    },
]);

export default router;
