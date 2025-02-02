import classNames from 'classnames';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { Navbar } from '@/widgets/navbar';
import type { IMenuItem } from '@/widgets/navbar';
import * as s from './MainLayout.module.scss';

interface IMainLayoutProps {
	isAuth: boolean;
	navbarItems?: IMenuItem[];
}

const MainLayout = ({ isAuth, navbarItems }: IMainLayoutProps) => {
	return (
		<section>
			<Header />
			{!isAuth && <Navbar menuItems={navbarItems} />}

			<main
				className={classNames({
					[s.main]: !isAuth,
					[s.auth]: isAuth,
				})}
			>
				<div className={s.container}>
					{/* TODO: Add skeleton */}
					<Suspense fallback={<h1>loading...</h1>}>
						<Outlet />
					</Suspense>
				</div>
			</main>

			<Footer useLightText={isAuth} />
		</section>
	);
};

export { MainLayout };
