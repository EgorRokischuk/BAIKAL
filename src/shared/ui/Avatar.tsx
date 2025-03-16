import { AccountCircleOutlined } from '@mui/icons-material';
import { Avatar as MuiAvatar, AvatarProps } from '@mui/material';

export const Avatar: React.FC<AvatarProps> = (props) => {
	return props.src ? (
		<MuiAvatar
			alt={props.alt ?? 'avatar'}
			src={props.src}
			sx={{ width: props.sizes ?? '100%', height: props.sizes ?? '100%' }}
		/>
	) : (
		<AccountCircleOutlined sx={{ width: props.sizes ?? '100%', height: props.sizes ?? '100%' }} />
	);
};
