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
				<div className={s.header__image}>
					<img style={{ maxWidth: '100%' }} src="/logo.png" />
				</div>

				<div className={s.header__title}>
					<Typography variant="h1">{'Информационная система «Байкал»'}</Typography>
				</div>

				<div className={s.header__profile}>{isUserMenuVisible && <UserMenuButton />}</div>
			</div>
		</div>
	);
};

export const Header = memo(MemoHeader);
