import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AboutRecordFields } from '@/entities/AboutRecord';
import { ExternalResourceFields } from '@/entities/ExternalResource';
import { PublicationFields } from '@/entities/Publication';
import { Button } from '@/shared/ui/Button';
import { EntityForm } from '@/shared/ui/EntityForm';
import { initDefaultValues, initEntitySchema, useEntityService } from '../lib';
import * as s from './CreateEntity.module.scss';

interface ICreateEntityBaseProps {
	type: 'external-resource' | 'publication' | 'about-record';
}

const EntityFields = ({ type }: ICreateEntityBaseProps) => {
	switch (type) {
		case 'external-resource':
			return <ExternalResourceFields />;
		case 'publication':
			return <PublicationFields />;
		case 'about-record':
			return <AboutRecordFields />;
		default:
			return null;
	}
};

interface ICreateEntityProps extends ICreateEntityBaseProps {
	width?: number;
}

export const CreateEntity = <T,>({ width = 500, type }: ICreateEntityProps): React.ReactElement => {
	const [open, setOpen] = useState<boolean>(false);

	const { createEntityService } = useEntityService<T>();

	const methods = useForm<T>({
		mode: 'onTouched',
		resolver: zodResolver(initEntitySchema(type)),
		defaultValues: initDefaultValues(type),
	});

	const { handleSubmit, watch, reset } = methods;

	const entity = watch();

	const handleModal = () => {
		if (!open) reset();
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

			<FormProvider {...methods}>
				<EntityForm
					open={open}
					title="Добавление записи"
					width={width}
					onSubmit={handleSubmit(onCreateClick)}
					onCancel={handleModal}
				>
					<EntityFields type={type} />
				</EntityForm>
			</FormProvider>
		</>
	);
};
