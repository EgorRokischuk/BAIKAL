import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { Snackbar } from '@/shared/ui/Snackbar';
import * as s from './AuthLayout.module.scss';
import { AuthLayoutSkeleton } from './AuthLayout.skeleton';

const AuthLayout: React.FC = () => {
	return (
		<Suspense fallback={<AuthLayoutSkeleton />}>
			<section>
				<Header isUserMenuVisible={false} />

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
