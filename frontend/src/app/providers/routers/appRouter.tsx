import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { Login } from '@/pages/login';
import { SignUp } from '@/pages/sign-up';
import { Map } from '@/pages/map';

import { AccessDenied } from '@/pages/access-denied';
import { NotFound } from '@/pages/not-found';

const router = createBrowserRouter([
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/signup',
		element: <SignUp />,
	},
	{
		path: '/',
		element: <Map />,
	},
	{
		path: '/403',
		element: <AccessDenied />,
	},
	{
		path: '/404',
		element: <NotFound />,
	},
	{
		path: '/*',
		element: <Navigate to="/404" />,
	},
]);

function AppRouter() {
	return <RouterProvider router={router} />;
}

export { AppRouter };
