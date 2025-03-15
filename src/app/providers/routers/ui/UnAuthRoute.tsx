import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { LS_ACCESS_TOKEN } from '@/shared/config/constants/authConstants';
import { ROUTES } from '@/shared/config/router/routes';
import { getFromLS } from '@/shared/lib/manageLocalStorage';

export const UnAuthRoute: React.FC<PropsWithChildren> = ({ children }) => {
	const isAuth = getFromLS(LS_ACCESS_TOKEN);

	return !isAuth ? <>{children}</> : <Navigate to={ROUTES.appRoute} />;
};
