import { MenuProps, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { globalActions } from '@/app/providers/store';
import { getFullProfile } from '@/entities/User/model/selector';
import { userActions } from '@/entities/User/model/slices';
import { LS_ACCESS_TOKEN, LS_REFRESH_TOKEN } from '@/shared/config/constants/authConstants';
import { ROUTES } from '@/shared/config/router/routes';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { removeFromLS } from '@/shared/lib/manageLocalStorage';
import { Avatar } from '@/shared/ui/Avatar';
import { CustomMenu } from '../config';
import * as s from './UserMenuOverlay.module.scss';

const AuthOverlay: React.FC<MenuProps> = (props) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const profile = useAppSelector(getFullProfile);

	const onLogout = () => {
		removeFromLS(LS_ACCESS_TOKEN);
		removeFromLS(LS_REFRESH_TOKEN);
		dispatch(globalActions.setAccessToken(''));
		dispatch(userActions.setProfile(null));

		navigate(ROUTES.appRoute);
	};

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
