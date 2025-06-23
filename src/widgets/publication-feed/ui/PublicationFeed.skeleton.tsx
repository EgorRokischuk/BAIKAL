import { Skeleton, Stack } from '@mui/material';

export const PublicationFeedSkeleton: React.FC = () => {
	return (
		<Stack spacing={1} sx={{ height: '100%', padding: '0px 20px' }}>
			<Skeleton variant="rectangular" height={60} />

			<Skeleton variant="rectangular" height={60} />

			<Skeleton variant="rectangular" height={60} />

			<Skeleton variant="rectangular" height={60} />

			<Skeleton variant="rectangular" height={60} />

			<Skeleton variant="rectangular" height={60} />

			<Skeleton variant="rectangular" height={60} />

			<Skeleton variant="rectangular" height={60} />

			<Skeleton variant="rectangular" height={60} />

			<Skeleton variant="rectangular" height={60} />

			<Skeleton variant="rectangular" height={60} />
		</Stack>
	);
};
