import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { Avatar } from '@/shared/ui/Avatar';
import { getFullProfile } from '../../../model/selector';
import { AuthOverlay, UnAuthOverlay } from './user-menu-overlay';
import * as s from './UserMenuButton.module.scss';

const UserMenuButton: React.FC = () => {
	const [anchorEl, setAnchorEl] = useState<Element | null>(null);
	const profile = useAppSelector(getFullProfile);

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
				<div className={s.menu_button}>
					<div className={s.menu_button__avatar}>
						<Avatar alt={profile?.email} src={'' /** profile?.avatarUrl */} sizes="40px" />
					</div>

					<span className={s.menu_button__caption}>
						<Typography variant="body2">
							{profile?.fullname
								? `${profile?.fullname.split(' ')[0]} ${profile?.fullname.split(' ')[1][0]}. ${profile?.fullname.split(' ')[2][0]}.`
								: 'Гость'}
						</Typography>
					</span>
				</div>
			</Button>

			{profile ? (
				<AuthOverlay open={anchorEl !== null} anchorEl={anchorEl} onClose={() => handleClick()} />
			) : (
				<UnAuthOverlay open={anchorEl !== null} anchorEl={anchorEl} onClose={() => handleClick()} />
			)}
		</div>
	);
};

export { UserMenuButton };
