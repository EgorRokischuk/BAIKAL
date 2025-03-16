import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { Navbar } from '@/widgets/navbar';
import type { IMenuItem } from '@/widgets/navbar';
import { useProfileQuery } from '@/entities/User';
import { Snackbar } from '@/shared/ui/Snackbar';
import * as s from './MainLayout.module.scss';
import { MainLayoutSkeleton } from './MainLayout.skeleton';

interface IMainLayoutProps {
	navbarItems?: IMenuItem[];
}

const MainLayout = ({ navbarItems }: IMainLayoutProps) => {
	const { isLoading } = useProfileQuery();

	if (isLoading) return <MainLayoutSkeleton />;

	return (
		<Suspense fallback={<MainLayoutSkeleton />}>
			<section>
				<Header isUserMenuVisible />
				<Navbar menuItems={navbarItems} />

				<main className={s.main}>
					<div className={s.container}>
						<Suspense fallback={<h1>{'loading...'}</h1>}>
							<Outlet />
						</Suspense>
					</div>
				</main>

				<Footer useLightText={false} />
			</section>

			<Snackbar />
		</Suspense>
	);
};

export { MainLayout };
