import { Box, Fade, Typography } from '@mui/material';
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
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
		>
			<Fade in={open} timeout={500}>
				<Box className={s.modal} width={width ?? 400}>
					<Box id="modal-title" className={s.modal__title}>
						<Typography variant="modal_title">{title}</Typography>
					</Box>

					<Box id="modal-description" className={s.modal__content}>
						{children}
					</Box>
				</Box>
			</Fade>
		</Modal>
	);
};
