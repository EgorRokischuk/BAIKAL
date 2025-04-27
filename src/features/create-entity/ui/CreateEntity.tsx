import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { Control, FieldErrors, useForm } from 'react-hook-form';
import { IAboutRecordRequest } from '@/entities/AboutRecord';
import { IExternalResourceRequest } from '@/entities/ExternalResource';
import { Button } from '@/shared/ui/Button';
import { ModalCarcass } from '@/shared/ui/ModalCarcass';
import { Progress } from '@/shared/ui/Progress';
import { initDefaultValues, initEntitySchema, useEntityService } from '../lib';
import { AboutRecordContent } from './AboutRecordContent';
import * as s from './CreateEntity.module.scss';
import { ExternalResourceContent } from './ExternalResourceContent/ui/ExternalResourceContent';

interface ICreateEntityBaseProps {
	type: 'external-resource' | 'publication' | 'about-record';
}

interface ICreateEntityContentProps<T> extends ICreateEntityBaseProps {
	control: Control<T>;
	errors: FieldErrors<T>;
}

const CreateEntityContent = <T,>({ type, control, errors }: ICreateEntityContentProps<T>) => {
	switch (type) {
		case 'external-resource':
			return (
				<ExternalResourceContent
					control={control as unknown as Control<IExternalResourceRequest>}
					errors={errors as FieldErrors<IExternalResourceRequest>}
				/>
			);
		case 'publication':
			return null; // not released
		case 'about-record':
			return (
				<AboutRecordContent
					control={control as unknown as Control<IAboutRecordRequest>}
					errors={errors as FieldErrors<IAboutRecordRequest>}
				/>
			);
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

	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<T>({
		mode: 'onSubmit',
		resolver: zodResolver(initEntitySchema(type)),
		defaultValues: initDefaultValues(type),
	});

	const entity = watch();

	const handleModal = () => {
		setOpen((v) => !v);
	};

	const onCreateClick = async () => {
		console.log(entity);
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
					<form onSubmit={handleSubmit(onCreateClick)}>
						<Box className={s.modal__fields}>
							<CreateEntityContent<T> type={type} control={control} errors={errors} />
						</Box>

						<Box className={s.modal__actions}>
							<Button type="submit" fullWidth variant="contained" color="primary">
								{'Подтвердить'}
							</Button>

							<Button fullWidth variant="contained" color="secondary" onClick={handleModal}>
								{'Закрыть'}
							</Button>
						</Box>
					</form>
				</Box>
			</ModalCarcass>
		</>
	);
};
