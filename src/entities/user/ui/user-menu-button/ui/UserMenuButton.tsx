import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Avatar, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useProfileQuery } from '../../../api/authApi';
import { UserMenuOverlay } from './user-menu-overlay';
import * as s from './UserMenuButton.module.scss';

const UserMenuButton: React.FC = () => {
	const [anchorEl, setAnchorEl] = useState<Element | null>(null);
	const { data: profile } = useProfileQuery();

	const handleClick = (event?: React.MouseEvent) => {
		setAnchorEl(event?.currentTarget ?? null);
	};

	return (
		<div>
			<Button
				id="demo-positioned-button"
				aria-controls={anchorEl !== null ? 'demo-positioned-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={anchorEl !== null ? 'true' : undefined}
				onClick={handleClick}
			>
				<div className={s.user_menu_button}>
					<div className={s.user_menu_button_avatar_container}>
						{profile?.user.avatarUrl ? (
							<Avatar alt={profile?.user.email} src={profile.user.avatarUrl} />
						) : (
							<AccountCircleOutlinedIcon sx={{ fontSize: 50 }} />
						)}
					</div>

					<span className={s.user_menu_button_caption}>
						<Typography variant="caption">{profile?.user.fullname ?? 'Гость'}</Typography>
					</span>
				</div>
			</Button>

			<UserMenuOverlay open={anchorEl !== null} anchorEl={anchorEl} onClose={() => handleClick()} />
		</div>
	);
};

export { UserMenuButton };
