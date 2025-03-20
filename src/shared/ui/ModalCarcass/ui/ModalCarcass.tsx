import { Box, Typography } from '@mui/material';
import { Modal } from '@mui/material';
import { PropsWithChildren } from 'react';
import * as s from './ModalCarcass.module.scss';

interface IModalProps {
	open: boolean;
	width?: number;
	title: string;
}

export const ModalCarcass: React.FC<PropsWithChildren<IModalProps>> = ({
	open,
	width,
	title,
	children,
}) => {
	const handleClose = () => {
		open = false;
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box className={s.modal} width={width ?? 400}>
				<Box id="modal-modal-title" className={s.modal__title}>
					<Typography variant="modal_title">{title}</Typography>
				</Box>

				<Box id="modal-modal-description" className={s.modal__content}>
					{children}
				</Box>
			</Box>
		</Modal>
	);
};
