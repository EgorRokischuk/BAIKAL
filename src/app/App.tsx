import { Outlet, useLocation } from 'react-router-dom';
import './styles/normalize.scss';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { globalActions } from './providers/store';
import { useEffect } from 'react';

const App = () => {
	const location = useLocation();
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(globalActions.setCurrentPage(location.pathname));
	}, []);

	return <Outlet />;
};

export { App };
