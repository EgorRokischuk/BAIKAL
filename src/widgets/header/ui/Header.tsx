import { Typography } from '@mui/material';
import { memo } from 'react';
import { UserMenuButton } from '@/entities/User';
import * as s from './Header.module.scss';

interface IHeaderProps {
	isUserMenuVisible: boolean;
}

const MemoHeader: React.FC<IHeaderProps> = ({ isUserMenuVisible }) => {
	return (
		<div>
			<div className={s.header}>
				<div className={s.header__profile} />

				<div className={s.header__title}>
					<Typography variant="h5">
						{'ИС анализа Байкальской природной'}
						<br />
						{' зоны с помощью спутниковых снимков'}
					</Typography>
				</div>

				<div className={s.header__profile}>{isUserMenuVisible && <UserMenuButton />}</div>
			</div>
		</div>
	);
};

export const Header = memo(MemoHeader);
