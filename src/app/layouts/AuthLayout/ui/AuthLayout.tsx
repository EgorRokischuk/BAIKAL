import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import * as s from './AuthLayout.module.scss';


const AuthLayout = () => {
	return (
		<section>
			<Header />

			<main className={s.main}>
				<div className={s.container}>
					<Suspense fallback={<h1>loading...</h1>}>
						<Outlet />
					</Suspense>
				</div>
			</main>

			<Footer />
		</section>
	);
};

export { AuthLayout };
