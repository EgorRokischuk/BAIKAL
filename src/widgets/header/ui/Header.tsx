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
				<img src="/logo.png" />

				<img className={s.header__rotated} src="/satellite.png" />

				<div className={s.header__title}>
					<Typography variant="h1">{'Информационная система «Байкал»'}</Typography>
				</div>

				<img className={s.header__image} src="/river.png" />

				<div className={s.header__profile}>{isUserMenuVisible && <UserMenuButton />}</div>
			</div>
		</div>
	);
};

export const Header = memo(MemoHeader);
