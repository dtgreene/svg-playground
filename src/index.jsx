import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';

import { Root, NotFound, Sketch } from './pages';
import { Layout, ErrorBoundary } from './components';
import { sketches } from './sketches';

import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';

const sketchRoutes = sketches.map(({ path, ...other }) => ({
  path,
  element: <Sketch {...other} />,
}));

const basename = import.meta.env.PROD ? 'svg-playground/dist' : undefined;
const router = createHashRouter(
  [
    {
      element: <Layout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          index: true,
          element: <Root />,
        },
        ...sketchRoutes,
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
  ],
  {
    basename,
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
