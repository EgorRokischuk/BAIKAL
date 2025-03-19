import { Menu, MenuProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CustomMenu = styled((props: MenuProps) => <Menu {...props} />)(({ theme }) => ({
	'& .MuiPaper-root': {
		backgroundColor: 'rgb(12, 68, 147)',
		borderRadius: 0,
		marginLeft: theme.spacing(2),
		boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14)',
	},
}));
