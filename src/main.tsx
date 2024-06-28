import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './reset.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Cities from './pages/Cities/Cities.tsx';
import Weather from './pages/Weather/Weather.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/cities',
        element: <Cities />,
      },
      {
        path: '/weather',
        element: <Weather />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
