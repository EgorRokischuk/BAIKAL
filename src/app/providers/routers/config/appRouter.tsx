import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from '@/app/App';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { MainLayout } from '@/app/layouts/MainLayout';
import { About } from '@/pages/about';
import { AccessDenied } from '@/pages/access-denied';
import { ExternalResources } from '@/pages/external-resources';
import { Login } from '@/pages/login';
import { Map } from '@/pages/map';
import { NotFound } from '@/pages/not-found';
import { Publications } from '@/pages/publications';
import { SignUp } from '@/pages/sign-up';
import { Support } from '@/pages/support';
import { ROUTES } from '@/shared/config/router/routes';
import { UnAuthRoute } from '../ui/UnAuthRoute';

const navBarItems = [
	{ name: 'Продукты и данные', route: '/' },
	{ name: 'О проекте', route: '/about' },
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
		name: 'Обратная связь',
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
				element: <MainLayout navbarItems={navBarItems} />,
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
						path: '*',
						element: <Navigate to={ROUTES.exceptions.accessDenied.page} />,
					},
					{
						path: ROUTES.exceptions.notFound.route,
						element: <NotFound />,
					},
					{
						path: ROUTES.exceptions.accessDenied.route,
						element: <AccessDenied />,
					},
				],
			},
			{
				path: ROUTES.support.route,
				element: <AuthLayout showUserMenu navbarItems={navBarItems} />,
				children: [
					{
						index: true,
						element: <Support />,
					},
				],
			},
			{
				path: ROUTES.auth.route,
				element: (
					<UnAuthRoute>
						<AuthLayout />
					</UnAuthRoute>
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
