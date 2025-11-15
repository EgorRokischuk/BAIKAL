import { Box } from '@mui/material';
import { AboutRecordFeed } from '@/widgets/about-record-feed';
import { CreateEntity } from '@/features/create-entity';
import { getUserRights } from '@/entities/User';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { EAppRole } from '@/shared/types';
import * as s from './About.module.scss';

const About: React.FC = () => {
	const userRights = useAppSelector(getUserRights);

	console.log(userRights);

	return (
		<Box className={s.page}>
			<Box>
				<Box className={s.page__block} />
			</Box>

			<Box className={s.page__gallery}>
				<AboutRecordFeed />
			</Box>

			<Box>
				{userRights.some((role) => role === EAppRole.ADMIN) && <CreateEntity type="about-record" />}
				<Box className={s.page__block} />
			</Box>
		</Box>
	);
};

export { About };
