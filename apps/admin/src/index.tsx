import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import router from './router';
import './assets/main.css';

// 初始化时设置默认主题
const savedTheme = localStorage.getItem('theme') || 'pink'
document.documentElement.setAttribute('data-theme', savedTheme)

const rootEl = document.getElementById('root')!;
createRoot(rootEl).render(<RouterProvider router={router} />);
