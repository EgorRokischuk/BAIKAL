import { zodResolver } from '@hookform/resolvers/zod';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Button } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AboutRecordFields } from '@/entities/AboutRecord';
import { IPublicationResponse, useUpdatePublicationMutation } from '@/entities/Publication';
import { EntityForm } from '@/shared/ui/EntityForm';
import { btnStyle } from '../config/sxStyles';
import { publicationEditSchema } from '../model';

interface IRecordUpdateProps {
	publication: IPublicationResponse;
}

export const PublicationUpdate: React.FC<IRecordUpdateProps> = ({ publication }) => {
	const [updatePublicationMutation] = useUpdatePublicationMutation();

	const [showModal, setShowModal] = useState<boolean>(false);

	const methods = useForm<IPublicationResponse>({
		mode: 'onTouched',
		resolver: zodResolver(publicationEditSchema),
		defaultValues: { ...publication },
	});

	const { handleSubmit, reset } = methods;

	const handleModal = () => {
		if (!showModal) reset();
		setShowModal((prev) => !prev);
	};

	const onUpdate = async (publication: IPublicationResponse) => {
		await updatePublicationMutation(publication);
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
