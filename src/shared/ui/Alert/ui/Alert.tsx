import { Box, Button, Typography } from '@mui/material';
import { ModalCarcass } from '@/shared/ui/ModalCarcass';
import * as s from './Alert.module.scss';

interface IAlertProps {
	children: string;

	open: boolean;
	width?: number;
	title: string;

	hideCancelButton?: boolean;

	onOkClick?: () => void | Promise<void>;
	onCancelClick?: () => void | Promise<void>;
	close: () => void;
}

export const Alert: React.FC<IAlertProps> = ({ hideCancelButton = false, ...props }) => {
	const onOkClick = async () => {
		if (props.onOkClick) await props.onOkClick();

		props.close();
	};

	const onCancelClick = async () => {
		if (props.onCancelClick) await props.onCancelClick();

		props.close();
	};

	return (
		<ModalCarcass open={props.open} title={props.title} width={props.width}>
			<Box className={s.alert}>
				<Box className={s.alert__description}>
					<Typography>{props.children}</Typography>
				</Box>

				<Box className={s.alert__actions}>
					<Button variant="contained" color="primary" sx={{ width: '45%' }} onClick={onOkClick}>
						{'Подтвердить'}
					</Button>

					{!hideCancelButton && (
						<Button
							fullWidth
							variant="contained"
							color="secondary"
							sx={{ width: '45%' }}
							onClick={onCancelClick}
						>
							{'Отмена'}
						</Button>
					)}
				</Box>
			</Box>
		</ModalCarcass>
	);
};
