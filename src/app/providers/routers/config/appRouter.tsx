import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ROUTES } from '@/shared/config/router/routes';
import { MainLayout } from '@/app/layouts/MainLayout';

import { Map } from '@/pages/map';

import { App } from '@/app/App';
import { Login } from '@/pages/login';
import { SignUp } from '@/pages/sign-up';
import { NotFound } from '@/pages/not-found';
import { About } from '@/pages/about';
import { Publications } from '@/pages/publications';
import { ExternalResources } from '@/pages/external-resources';
import { AccessDenied } from '@/pages/access-denied';

const navBarItems = [
	{ name: 'Карта', route: '/', },
	{ name: 'О проекте', route: '/about'},
	{
	  name: 'Публикации',
	  route: '/publications',
	},
	{
	  name: 'Внешние ресурсы',
	  route: '/externalResources',
	},
	{
	  name: 'Руководство пользователя',
	  route: '/guide',
	},
	{
	  name: 'Служба поддержки',
	  route: '/support',
	},
  ];

const router = createBrowserRouter([
	{
		path: ROUTES.appRoute,
		element: <App />,
		children: [
			{
				path: ROUTES.appRoute,
				element: (
					<MainLayout navbarItems={navBarItems} />
				),
				children: [
					{
						index: true,
						element: <Map />,
					},
					{
						path: ROUTES.about.route,
						element: <About />,
					},
					{
						path: ROUTES.publications.route,
						element: <Publications />,
					},
					{
						path: ROUTES.externalResources.route,
						element: <ExternalResources />,
					},
					{
						path: ROUTES.guide.route,
						element: <Navigate to={ROUTES.exceptions.accessDenied.page} />,
					},
					{
						path: ROUTES.support.route,
						element: <Navigate to={ROUTES.exceptions.accessDenied.page} />,
					},
					{
						path: '*',
						element: <Navigate to={ROUTES.exceptions.notFound.page} />,
					},
					{
						path: ROUTES.exceptions.notFound.route,
						element: <NotFound />,
					},
					{
						path: ROUTES.exceptions.accessDenied.route,
						element: <AccessDenied />
					}
				],
			},
			{
				path: ROUTES.auth.route,
				element: (
					<MainLayout navbarItems={navBarItems} />
				),
				children: [
					{
						path: ROUTES.auth.login.route,
						element: <Login />,
					},
					{
						path: ROUTES.auth.register.route,
						element: <SignUp />,
					},
				],
			},
		],
	},
]);

export { router };
