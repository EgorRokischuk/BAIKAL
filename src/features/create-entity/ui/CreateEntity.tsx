import AddIcon from '@mui/icons-material/Add';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { ModalCarcass } from '@/shared/ui/ModalCarcass';
import { Progress } from '@/shared/ui/Progress';
import { useEntityService } from '../lib';
import * as s from './CreateEntity.module.scss';

interface ICreateEntityBaseProps {
	type: 'external-resource' | 'publication' | 'about-record';
}

interface ICreateEntityContentProps<T> extends ICreateEntityBaseProps {
	entity: T;
}

const CreateEntityContent = <T,>({ type, entity }: ICreateEntityContentProps<T>) => {
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

interface ICreateEntityProps extends ICreateEntityBaseProps {
	width?: number;
}

export const CreateEntity = <T,>({ width = 500, type }: ICreateEntityProps): React.ReactElement => {
	const [open, setOpen] = useState<boolean>(false);
	const [entity, _] = useState<T>();

	const { createEntityService } = useEntityService<T>();

	const handleModal = () => {
		setOpen((v) => !v);
	};

	const onCreateClick = async () => {
		const response = await createEntityService(type, entity);

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
				<Progress />

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
