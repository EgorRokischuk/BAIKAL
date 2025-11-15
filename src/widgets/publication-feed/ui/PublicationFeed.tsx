import { Box, Divider, Typography } from '@mui/material';
import { DeletePublication } from '@/features/Publication/publication-delete';
import { RedirectPublication } from '@/features/Publication/publication-redirect';
import { UpdatePublication } from '@/features/Publication/publication-update';
import { IPublicationResponse } from '@/entities/Publication';
import { getUserRights } from '@/entities/User';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { EAppRole } from '@/shared/types';
import * as s from './PublicationFeed.module.scss';
import { PublicationFeedSkeleton } from './PublicationFeed.skeleton';

interface IPublicationFeedProps {
	data: Array<IPublicationResponse>;
	isLoading: boolean;
}

export const PublicationFeed: React.FC<IPublicationFeedProps> = ({ isLoading, data }) => {
	const userRights = useAppSelector(getUserRights);

	if (isLoading) return <PublicationFeedSkeleton />;

	return (
		<Box sx={{ padding: '0px 20px' }}>
			{data.map((p) => (
				<>
					<Box key={p.id} className={s.block}>
						<Typography>{`${p.title} (${p.authors})`}</Typography>

						<Box className={s.block__actions}>
							<RedirectPublication url={p.url} />
							{userRights.some((role) => role === EAppRole.ADMIN) && (
								<>
									<UpdatePublication publication={p} />
									<DeletePublication id={`${p.id}`} />
								</>
							)}
						</Box>
					</Box>
					<Divider />
				</>
			))}
		</Box>
	);
};
