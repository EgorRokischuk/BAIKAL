import { Box, Typography } from '@mui/material';
import { useGetAboutRecordsListQuery } from '@/entities/AboutRecord';
import * as s from './AboutRecordFeed.module.scss';
import { AboutRecordFeedSkeleton } from './AboutRecordFeed.skeleton';

export const AboutRecordFeed: React.FC = () => {
	const { data, isLoading } = useGetAboutRecordsListQuery();

	if (isLoading) return <AboutRecordFeedSkeleton />;

	return data.map((ar) => (
		<Box className={s.block} key={ar.id}>
			<Box className={s.block_header}>
				<Box>
					<Box className={s.block_header__text}>
						<Typography variant="about_record_title">{ar.title}</Typography>
					</Box>

					<Box>{/* TODO: edit button */}</Box>
				</Box>

				<Box>{/* TODO: delete button */}</Box>
			</Box>

			<Box className={s.block_description}>
				<Typography variant="about_record_description">{ar.description}</Typography>
			</Box>
		</Box>
	));
};
