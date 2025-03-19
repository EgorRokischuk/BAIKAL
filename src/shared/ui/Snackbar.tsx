import { Alert, Snackbar as SnackbarMUI } from '@mui/material';
import { useEffect, useState } from 'react';
import { globalActions } from '@/app/providers/store';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';

export const Snackbar: React.FC = () => {
	const message = useAppSelector(({ global }) => global.message);
	const type = useAppSelector(({ global }) => global.messageType);
	const dispatch = useAppDispatch();

	const [snackbar, setSnackbar] = useState<boolean>(false);

	useEffect(() => {
		setSnackbar(message !== '');
	}, [message]);

	const handleClose = () => {
		dispatch(globalActions.clearMeesage());
	};

	return (
		<SnackbarMUI
			open={snackbar}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			message={message}
			autoHideDuration={3000}
			onClose={handleClose}
		>
			<Alert onClose={handleClose} severity={type} variant="filled" sx={{ width: '100%' }}>
				{message}
			</Alert>
		</SnackbarMUI>
	);
};
