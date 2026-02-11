import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import clsx from 'classnames';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { Navbar } from '@/widgets/navbar';
import type { IMenuItem } from '@/widgets/navbar';
import { useProfileQuery } from '@/entities/User';
import { Snackbar } from '@/shared/ui/Snackbar';
import { ROUTES } from '@/shared/config/router/routes';
import * as s from './MainLayout.module.scss';
import { MainLayoutSkeleton } from './MainLayout.skeleton';

interface IMainLayoutProps {
	navbarItems?: Array<IMenuItem>;
}

const MainLayout = ({ navbarItems }: IMainLayoutProps) => {
	const { isLoading } = useProfileQuery();
	const location = useLocation();
	const isPublications = location.pathname === ROUTES.publications.page;
	const isFooterFloating = !isPublications;

	if (isLoading) return <MainLayoutSkeleton />;

	return (
		<Suspense fallback={<MainLayoutSkeleton />}>
			<section>
				<Header isUserMenuVisible />
				<Navbar menuItems={navbarItems} />

				<main className={clsx(s.main, isPublications && s.mainAuto)}>
					<div className={clsx(s.container, isPublications && s.containerAuto)}>
						<Suspense fallback={<h1>{'loading...'}</h1>}>
							<Outlet />
						</Suspense>
					</div>
				</main>

				<Footer useLightText={false} isFloating={isFooterFloating} />
			</section>

			<Snackbar />
		</Suspense>
	);
};

export { MainLayout };
