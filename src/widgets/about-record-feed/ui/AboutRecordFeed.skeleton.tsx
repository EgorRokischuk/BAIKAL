import { Skeleton, Stack } from '@mui/material';

export const AboutRecordFeedSkeleton: React.FC = () => {
	return (
		<Stack spacing={1} sx={{ height: '100%' }}>
			<Skeleton variant="rectangular" height={450} />

			<Skeleton variant="rectangular" height={150} />

			<Skeleton variant="rectangular" height={150} />
		</Stack>
	);
};
