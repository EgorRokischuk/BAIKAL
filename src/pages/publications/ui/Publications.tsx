import { Box } from '@mui/material';
import { useEffect } from 'react';
import { PublicationFeed } from '@/widgets/publication-feed';
import { CreateEntity } from '@/features/create-entity';
import { SearchPublication } from '@/features/Publication/search-publication';
import { useLazyGetPublicationsListQuery } from '@/entities/Publication';
import { getUserRights } from '@/entities/User';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import * as s from './Publications.module.scss';

const Publications: React.FC = () => {
	const userRights = useAppSelector(getUserRights);

	const [trigger, { data = [], isFetching }] = useLazyGetPublicationsListQuery();

	useEffect(() => {
		trigger();
	}, []);

	return (
		<Box className={s.page}>
			<Box>
				<Box className={s.page__block} />
			</Box>

			<Box className={s.page__gallery}>
				<Box className={s.page__gallery__search}>
					<SearchPublication onClick={trigger} />
				</Box>
				<Box className={s.page__gallery__content}>
					<PublicationFeed data={data} isLoading={isFetching} />
				</Box>
			</Box>

			<Box>
				{userRights.some((role) => role.name === 'admin') && <CreateEntity type="publication" />}
				<Box className={s.page__block} />
			</Box>
		</Box>
	);
};

export { Publications };
