import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';
import { Button } from '../../Button';
import { ModalCarcass } from '../../ModalCarcass';
import { Progress } from '../../Progress';
import * as s from './EntityForm.module.scss';

interface IEntityFormProps {
	open: boolean;
	title?: string;
	width?: number;

	onSubmit: () => Promise<void>;
	onCancel: () => void;
}

export const EntityForm: React.FC<PropsWithChildren<IEntityFormProps>> = ({
	children,
	open,
	onSubmit,
	onCancel,
	width = 500,
	title = 'Добавление записи',
}) => {
	return (
		<ModalCarcass open={open} title={title} width={width}>
			<Progress />

			<Box className={s.modal}>
				<Box className={s.modal__fields}>{children}</Box>

				<Box className={s.modal__actions}>
					<Button fullWidth variant="contained" color="primary" onClick={onSubmit}>
						{'Подтвердить'}
					</Button>

					<Button fullWidth variant="contained" color="secondary" onClick={onCancel}>
						{'Закрыть'}
					</Button>
				</Box>
			</Box>
		</ModalCarcass>
	);
};
