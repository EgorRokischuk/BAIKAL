import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './styles/normalize.scss';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { Snackbar } from '@/shared/ui/Snackbar';
import { globalActions } from './providers/store';

const App = () => {
	const location = useLocation();
	const dispatch = useAppDispatch();

	const navigate = useNavigate();
	const pathname = useAppSelector(({ global }) => global.currentPage);

	useEffect(() => {
		dispatch(globalActions.setCurrentPage(location.pathname));
	}, []);

	useEffect(() => {
		navigate(pathname);
	}, [pathname]);

	return (
		<>
			<Outlet />
			<Snackbar />
		</>
	);
};

export { App };
