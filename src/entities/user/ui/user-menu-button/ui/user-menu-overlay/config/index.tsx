import { Menu, MenuProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CustomMenu = styled((props: MenuProps) => <Menu {...props} />)(({ theme }) => ({
        '& .MuiPaper-root': {
                backgroundColor: 'transparent',
                borderRadius: 12,
                marginLeft: 0,
                boxShadow: 'none',
                padding: theme.spacing(0.5),
        },
}));