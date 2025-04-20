import { Box } from '@mui/material';
import { CreateEntity } from '@/features/create-entity';
import { getUserRights } from '@/entities/User';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import * as s from './ExternalResources.module.scss';

const ExternalResources: React.FC = () => {
	const userRights = useAppSelector(getUserRights);
	return (
		<Box className={s.page}>
			<Box>
				<Box className={s.page__block} />
			</Box>

			<Box className={s.page__gallery}>{'External Resources'}</Box>

			<Box>
				{userRights.some((role) => role.name === 'admin') && (
					<CreateEntity type="external-resource" />
				)}
				<Box className={s.page__block} />
			</Box>
		</Box>
	);
};

export { ExternalResources };
