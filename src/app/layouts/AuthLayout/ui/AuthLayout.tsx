import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import clsx from 'classnames';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { IMenuItem, Navbar } from '@/widgets/navbar';
import { Snackbar } from '@/shared/ui/Snackbar';
import * as s from './AuthLayout.module.scss';
import { AuthLayoutSkeleton } from './AuthLayout.skeleton';

interface IAuthLayoutProps {
	showUserMenu?: boolean;
	navbarItems?: Array<IMenuItem>;
	showHeader?: boolean;
}

const AuthLayout: React.FC<IAuthLayoutProps> = ({
	showUserMenu = false,
	navbarItems = [],
	showHeader = true,
}) => {
	return (
		<Suspense fallback={<AuthLayoutSkeleton />}>
			<section>
				{showHeader && <Header isUserMenuVisible={showUserMenu} />}
				{showHeader && !!navbarItems.length && <Navbar menuItems={navbarItems} />}

				<main className={clsx(s.auth, !showHeader && s.authNoHeader)}>
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
