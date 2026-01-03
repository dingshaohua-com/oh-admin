import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import router from './router';
import './assets/main.css';

const rootEl = document.getElementById('root')!;
createRoot(rootEl).render(<RouterProvider router={router} />);
