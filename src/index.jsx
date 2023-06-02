import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Root, NotFound, Spiral, Squares } from './pages';
import { Layout, ErrorBoundary } from './components';

import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Root />,
      },
      {
        path: 'sketches/spiral',
        element: <Spiral />,
      },
      {
        path: 'sketches/squares',
        element: <Squares />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
