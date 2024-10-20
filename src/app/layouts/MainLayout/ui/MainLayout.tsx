import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import * as s from './MainLayout.module.scss';
import { Navbar } from '@/widgets/navbar';
import type { IMenuItem } from '@/widgets/navbar';

interface IMainLayoutProps {
	navbarItems: IMenuItem[];
}

const MainLayout = ({ navbarItems }: IMainLayoutProps) => {
	return (
		<section>
			<Header />
			<Navbar menuItems={navbarItems} />

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

export { MainLayout };
