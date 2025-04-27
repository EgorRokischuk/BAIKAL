import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useDeleteAboutRecordMutation } from '@/entities/AboutRecord';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import * as s from './RecordDelete.module.scss';

interface IRecordDeleteProps {
	id: string;
}

export const RecordDelete: React.FC<IRecordDeleteProps> = ({ id }) => {
	const [deleteAboutRecordMutation] = useDeleteAboutRecordMutation();

	const [showModal, setShowModal] = useState<boolean>(false);

	const handleModal = () => {
		setShowModal((prev) => !prev);
	};

	const onDelete = async () => {
		await deleteAboutRecordMutation(id);

		handleModal();
	};

	return (
		<>
			<Button className={s.delete__btn} onClick={handleModal}>
				<DeleteIcon />
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
