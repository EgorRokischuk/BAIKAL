import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { appActions } from '@/store/slices/appSlice';

export const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(appActions.setCurrentPath(location.pathname));
  }, [dispatch, location.pathname]);

  return <Outlet />;
};
