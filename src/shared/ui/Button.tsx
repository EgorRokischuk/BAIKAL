import { Button as MuiButton } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

interface IProps extends React.ComponentProps<typeof MuiButton> {}

const Button: React.FC<PropsWithChildren<IProps>> = ({ children, ...props }) => {
	const isLoading = useAppSelector(({ global }) => global.isLoading);

	return (
		<MuiButton {...props} disabled={isLoading}>
			{children}
		</MuiButton>
	);
};

export { Button };
