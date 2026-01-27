import { Typography } from '@mui/material';
import { memo } from 'react';
import { UserMenuButton } from '@/entities/User';
import * as s from './Header.module.scss';

interface IHeaderProps {
	isUserMenuVisible: boolean;
}

const MemoHeader: React.FC<IHeaderProps> = ({ isUserMenuVisible }) => {
	const organizationUrl = process.env.ORGANIZATION_URL || '/';

	return (
		<div>
			<div className={s.header}>
				<div className={s.header__image}>
					<a
						href={organizationUrl}
						className={s.header__logo_link}
						aria-label="Перейти на сайт организации"
					>
						<img style={{ maxWidth: '100%' }} src="/logo.png" alt="Логотип" />
					</a>
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
