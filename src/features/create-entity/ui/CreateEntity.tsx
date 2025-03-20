import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { ModalCarcass } from '@/shared/ui/ModalCarcass';
import * as s from './CreateEntity.module.scss';

interface ICreateEntityProps<T> {
	width?: number;

	type: 'external-resource' | 'publication' | 'about-record';
	entity: T;

	action: () => Promise<boolean>;
}

const CreateEntityContent = <T,>({
	type,
	entity,
}: Pick<ICreateEntityProps<T>, 'type' | 'entity'>) => {
	switch (type) {
		case 'external-resource':
			return <div>{entity as string}</div>; // not released
		case 'publication':
			return null; // not released
		case 'about-record':
			return null; // not released
		default:
			return null;
	}
};

export const CreateEntity = <T,>({
	width = 500,
	type,
	entity,
	action,
}: ICreateEntityProps<T>): React.ReactElement => {
	const [open, setOpen] = useState<boolean>(false);

	const handleModal = () => {
		setOpen((v) => !v);
	};

	const onCreateClick = async () => {
		const response = await action();

		if (response) handleModal();
	};

	return (
		<>
			<Box className={s.create}>
				<Button
					className={s.create__btn}
					variant="contained"
					color="secondary"
					onClick={handleModal}
				>
					<AddIcon />
				</Button>

				<Typography variant="body2">{'Новая запись'}</Typography>
			</Box>

			<ModalCarcass open={open} title="Добавление записи" width={width}>
				<Box className={s.modal}>
					<CreateEntityContent<T> type={type} entity={entity} />

					<Box className={s.modal__actions}>
						<Button fullWidth variant="contained" color="primary" onClick={onCreateClick}>
							{'Подтвердить'}
						</Button>

						<Button fullWidth variant="contained" color="secondary" onClick={handleModal}>
							{'Закрыть'}
						</Button>
					</Box>
				</Box>
			</ModalCarcass>
		</>
	);
};
