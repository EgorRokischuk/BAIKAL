import { Box } from '@mui/material';
import { CreateEntity } from '@/features/create-entity';
import { getUserRights } from '@/entities/User';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import * as s from './Publications.module.scss';

const Publications: React.FC = () => {
	const userRights = useAppSelector(getUserRights);

	console.log(userRights);

	return (
		<Box className={s.page}>
			<Box>
				<Box className={s.page__block} />
			</Box>

			<Box className={s.page__gallery}>
				<Box>{/** TODO: Search Publication By Name Feature */}</Box>
				<Box>{/** TODO: Publications Feed */}</Box>
			</Box>

			<Box>
				{userRights.some((role) => role.name === 'admin') && <CreateEntity type="publication" />}
				<Box className={s.page__block} />
			</Box>
		</Box>
	);
};

export { Publications };
