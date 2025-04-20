import { Box } from '@mui/material';
import { CreateEntity } from '@/features/create-entity';
import * as s from './ExternalResources.module.scss';

const ExternalResources: React.FC = () => {
	return (
		<Box className={s.page}>
			<Box>
				<Box className={s.page__block} />
			</Box>

			<Box className={s.page__gallery}>{'External Resources'}</Box>

			<Box className={s.page__block}>
				<CreateEntity type="external-resource" />
			</Box>
		</Box>
	);
};

export { ExternalResources };
