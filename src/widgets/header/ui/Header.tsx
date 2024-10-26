import { memo } from 'react';

import * as s from './Header.module.scss';
import { UserMenuButton } from '@/entities/user';
import { UserMenuOverlay } from '@/entities/user/ui/user-menu-button/UserMenuOverlay';

const MemoHeader = () => {
	return (
		<div>
			<div className={s.header}>
				<div></div>
				<div className={s.header__title}>
					<span>
						{'ИС анализа Байкальской природной'}
						<br />
						{' зоны с помощью спутниковых снимков'}
					</span>
				</div>
				<div className={s.header__user_button} >
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
