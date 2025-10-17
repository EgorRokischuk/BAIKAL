import { MenuProps, Typography } from '@mui/material';
import { globalActions } from '@/app/providers/store';
import { useLogoutMutation, useProfileQuery } from '@/entities/User/api/authApi'; // ← ИЗМЕНИТЬ ИМПОРТ
import { ROUTES } from '@/shared/config/router/routes';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { Avatar } from '@/shared/ui/Avatar';
import { CustomMenu } from '../config';
import * as s from './UserMenuOverlay.module.scss';

const AuthOverlay: React.FC<MenuProps> = (props) => {
	const dispatch = useAppDispatch();

	const { data: profile } = useProfileQuery();
	const [logoutMutation] = useLogoutMutation();

	const onLogout = () => logoutMutation();

	return (
		<CustomMenu
			id="demo-positioned-menu"
			aria-labelledby="demo-positioned-button"
			anchorEl={props.anchorEl}
			open={props.open}
			onClose={props.onClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
		>
			<div className={s.menu_block}>
				<div className={s.menu_block__header}>
					<Avatar alt={profile?.email} src={'' /** avatarUrl */} sizes="100px" />

					<Typography variant="subtitle1">{profile?.fullname}</Typography>
					<Typography variant="subtitle2">{profile?.email}</Typography>
				</div>

				<div className={s.menu_block__links}>
					<Typography
						className={s.menu_block__link}
						variant="subtitle1"
						onClick={() => dispatch(globalActions.setCurrentPage(ROUTES.profile.page))}
					>
						{'Личный кабинет'}
					</Typography>
					<Typography className={s.menu_block__link} variant="subtitle1" onClick={onLogout}>
						{'Выйти'}
					</Typography>
				</div>
			</div>
		</CustomMenu>
	);
};

export { AuthOverlay };