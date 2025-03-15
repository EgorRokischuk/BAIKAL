import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './styles/normalize.scss';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { globalActions } from './providers/store';

const App = () => {
	const location = useLocation();
	const dispatch = useAppDispatch();

	const navigate = useNavigate();
	const pathname = useAppSelector(({ global }) => global.currentPage);

	useEffect(() => {
		if (location.pathname === pathname) return;

		dispatch(globalActions.setCurrentPage(location.pathname));
	}, [location]);

	useEffect(() => {
		navigate(pathname);
	}, [pathname]);

	return <Outlet />;
};

export { App };
