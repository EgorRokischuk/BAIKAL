import { Box, Typography } from '@mui/material';
import { DeleteRecord } from '@/features/AboutRecord/record-delete';
import { UpdateRecord } from '@/features/AboutRecord/record-update';
import { useGetAboutRecordsListQuery } from '@/entities/AboutRecord';
import * as s from './AboutRecordFeed.module.scss';
import { AboutRecordFeedSkeleton } from './AboutRecordFeed.skeleton';

export const AboutRecordFeed: React.FC = () => {
	const { data, isFetching } = useGetAboutRecordsListQuery();

	if (isFetching) return <AboutRecordFeedSkeleton />;

	return data.map((ar) => (
		<Box className={s.block} key={ar.id}>
			<Box className={s.block_header}>
				<Box className={s.block_header__content}>
					<Box className={s.block_header__text}>
						<Typography variant="about_record_title">{ar.title}</Typography>
					</Box>

					<Box>
						<UpdateRecord record={ar} />
					</Box>
				</Box>

				<Box>
					<DeleteRecord id={ar.id} />
				</Box>
			</Box>

			<Box className={s.block_description}>
				<Typography variant="about_record_description">{ar.description}</Typography>
			</Box>
		</Box>
	));
};
