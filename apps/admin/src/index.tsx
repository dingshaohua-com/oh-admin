import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import router from './router';
import './assets/main.css';
import { Toaster } from '@repo/shadcn-comps/sonner';

// 初始化时设置默认主题
const savedTheme = localStorage.getItem('theme') || 'pink';
document.documentElement.setAttribute('data-theme', savedTheme);

const rootEl = document.getElementById('root')!;
createRoot(rootEl).render(
  <>
    <Toaster />
    <RouterProvider router={router} />
  </>,
);
