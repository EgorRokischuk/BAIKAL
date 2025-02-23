import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './styles/normalize.scss';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { Snackbar } from '@/shared/ui/Snackbar';
import { globalActions } from './providers/store';

const App = () => {
	const location = useLocation();
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(globalActions.setCurrentPage(location.pathname));
	}, []);

	return (
		<>
			<Outlet />
			<Snackbar />
		</>
	);
};

export { App };
