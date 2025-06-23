import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useDeletePublicationMutation } from '@/entities/Publication';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { btnStyle } from '../config/sxStyles';

interface IPublicationDeleteProps {
	id: string;
}

export const PublicationDelete: React.FC<IPublicationDeleteProps> = ({ id }) => {
	const [deletePublicationMutation] = useDeletePublicationMutation();

	const [showModal, setShowModal] = useState<boolean>(false);

	const handleModal = () => {
		setShowModal((prev) => !prev);
	};

	const onDelete = async () => {
		await deletePublicationMutation(id);

		handleModal();
	};

	return (
		<>
			<Button sx={btnStyle} onClick={handleModal}>
				<DeleteIcon fontSize="inherit" />
			</Button>

			<Alert
				open={showModal}
				title="Предупреждение"
				onOkClick={onDelete}
				onCancelClick={handleModal}
			>
				{'Вы действительно хотите удалить выбранную запись?'}
			</Alert>
		</>
	);
};
