import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import * as s from './UserMenuButton.module.scss';
import { Typography } from '@mui/material';

export const UserMenuButton = () => {
    return (
        <div className={s.user_menu_button}>            
            <div style={{ textAlign: 'center'}}>
                <AccountCircleOutlinedIcon  sx={{fontSize: 70}} />
            </div>
            <div style={{ textAlign: 'center'}}>
                <Typography variant='caption' >
                    Гость
                </Typography>
            </div>            
		</div>
    )
}