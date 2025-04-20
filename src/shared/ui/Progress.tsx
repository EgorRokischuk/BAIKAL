import { LinearProgress } from '@mui/material';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

interface IProps extends React.ComponentProps<typeof LinearProgress> {}

const Progress: React.FC<IProps> = (props) => {
	const isLoading = useAppSelector(({ global }) => global.isLoading);

	if (!isLoading) return null;

	return <LinearProgress color="primary" {...props} />;
};

export { Progress };
