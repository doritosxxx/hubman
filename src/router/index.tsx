import React from 'react';

import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';

import { SetupPage } from '../pages/Setup';
import { DashboardPage } from '../pages/Dashboard';
import { SetupsPage } from '../pages/Setups';
import { ErrorFallback } from '../core/GlobalErrorBoundary/ErrorFallback';

const routes: RouteObject[] = [
    {
        path: 'setup/:id/:page',
        element: <SetupPage />,
    },
    {
        path: '/',
        element: <DashboardPage />,
    },
];

const router = createBrowserRouter([
    {
        path: '/',
        element: <SetupsPage />,
        children: routes,
        errorElement: <ErrorFallback />,
    },
]);

export const Router = () => (
    <RouterProvider router={router} />
);
