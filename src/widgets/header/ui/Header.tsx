import { memo } from 'react';

import * as s from './Header.module.scss';
import { UserMenuButton } from '@/entities/user';
import { UserMenuOverlay } from '@/entities/user/ui/user-menu-button/UserMenuOverlay';
import { Typography } from '@mui/material';

const MemoHeader = () => {
	return (
		<div>
			<div className={s.header}>
				<div></div>
				<div className={s.header__title}>
					<Typography
						variant='h5'
					>
						{'ИС анализа Байкальской природной'}
						<br />
						{' зоны с помощью спутниковых снимков'}
					</Typography>
				</div>
				<div>
					<UserMenuButton />
				</div>
			</div>
			<div className={s.header__user_menu_block} >
					<UserMenuOverlay />
			</div>
		</div>
	);
};

export const Header = memo(MemoHeader);
