import { Box } from '@mui/material';
import { AboutRecordFeed } from '@/widgets/about-record-feed';
import { CreateEntity } from '@/features/create-entity';
import { getUserRights } from '@/entities/User';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import * as s from './About.module.scss';

const About: React.FC = () => {
	const userRights = useAppSelector(getUserRights);

	return (
		<Box className={s.page}>
			<Box>
				<Box className={s.page__block} />
			</Box>

			<Box className={s.page__gallery}>
				<AboutRecordFeed />
			</Box>

			<Box>
				{userRights.some((role) => role.name === 'admin') && <CreateEntity type="about-record" />}
				<Box className={s.page__block} />
			</Box>
		</Box>
	);
};

export { About };
