import { Skeleton, Stack } from '@mui/material';

export const AuthLayoutSkeleton: React.FC = () => {
	return (
		<Stack spacing={1} sx={{ height: '100vh' }}>
			<Skeleton variant="rectangular" height={70} />

			<Skeleton variant="rectangular" width="100%" height="100%" />

			<Skeleton variant="rectangular" height={30} />
		</Stack>
	);
};
