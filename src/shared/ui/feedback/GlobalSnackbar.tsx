import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { appActions } from '@/store/slices/appSlice';
import { selectMessage, selectMessageType } from '@/store/slices/appSelectors';

export type IAlertColor = 'success' | 'info' | 'warning' | 'error';

export const GlobalSnackbar = () => {
  const dispatch = useAppDispatch();
  const message = useAppSelector(selectMessage);
  const type = useAppSelector(selectMessageType);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(Boolean(message));
  }, [message]);

  const handleClose = () => {
    setOpen(false);
    dispatch(appActions.clearMessage());
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={3200}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} variant="filled" severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
