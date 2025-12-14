import { Box, Fade, Typography } from '@mui/material';
import { Modal } from '@mui/material';
import { PropsWithChildren } from 'react';
import * as s from './ModalCarcass.module.scss';

interface IModalProps {
        open: boolean;
        width?: number;
        title: string;
        onClose?: () => void;
}

export const ModalCarcass: React.FC<PropsWithChildren<IModalProps>> = ({
        open,
        width,
        title,
        onClose,
        children,
}) => {
        const hasTitle = Boolean(title);

        return (
                <Modal
                        open={open}
                        onClose={onClose}
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                >
                        <Fade in={open} timeout={500}>
                                <Box className={s.modal} width={width ?? 400}>
                                        {hasTitle && (
                                                <Typography id="modal-title" variant="h6" className={s.modal__title}>
                                                        {title}
                                                </Typography>
                                        )}

                                        <Box id="modal-description" className={s.modal__content}>
                                                {children}
                                        </Box>
                                </Box>
                        </Fade>
                </Modal>
        );
};
