import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { IMenuItem, Navbar } from '@/widgets/navbar';
import { Snackbar } from '@/shared/ui/Snackbar';
import * as s from './AuthLayout.module.scss';
import { AuthLayoutSkeleton } from './AuthLayout.skeleton';

interface IAuthLayoutProps {
	showUserMenu?: boolean;
	navbarItems?: Array<IMenuItem>;
}

const AuthLayout: React.FC<IAuthLayoutProps> = ({ showUserMenu = false, navbarItems = [] }) => {
	return (
		<Suspense fallback={<AuthLayoutSkeleton />}>
			<section>
				<Header isUserMenuVisible={showUserMenu} />
				{navbarItems.length && <Navbar menuItems={navbarItems} />}

				<main className={s.auth}>
					<div className={s.container}>
						<Suspense fallback={<h1>{'loading...'}</h1>}>
							<Outlet />
						</Suspense>
					</div>
				</main>

				<Footer useLightText />
			</section>

			<Snackbar />
		</Suspense>
	);
};

export { AuthLayout };
