import { zodResolver } from '@hookform/resolvers/zod';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Button } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AboutRecordFields, useUpdateAboutRecordMutation } from '@/entities/AboutRecord';
import { IAboutRecordResponse } from '@/entities/AboutRecord';
import { EntityForm } from '@/shared/ui/EntityForm';
import { btnStyle } from '../config/sxStyles';
import { aboutRecordEditSchema } from '../model';

interface IRecordUpdateProps {
	record: IAboutRecordResponse;
}

export const RecordUpdate: React.FC<IRecordUpdateProps> = ({ record }) => {
	const [updateAboutRecordMutation] = useUpdateAboutRecordMutation();

	const [showModal, setShowModal] = useState<boolean>(false);

	const methods = useForm<IAboutRecordResponse>({
		mode: 'onTouched',
		resolver: zodResolver(aboutRecordEditSchema),
		defaultValues: { ...record },
	});

	const { handleSubmit, reset } = methods;

	const handleModal = () => {
		if (!showModal) reset();
		setShowModal((prev) => !prev);
	};

	const onUpdate = async (record: IAboutRecordResponse) => {
		await updateAboutRecordMutation(record);
	};

	return (
		<>
			<Button sx={btnStyle} onClick={handleModal}>
				<EditOutlinedIcon fontSize="inherit" />
			</Button>

			<FormProvider {...methods}>
				<EntityForm
					open={showModal}
					title="Редактирование записи"
					onSubmit={handleSubmit(onUpdate)}
					onCancel={handleModal}
				>
					<AboutRecordFields />
				</EntityForm>
			</FormProvider>
		</>
	);
};
