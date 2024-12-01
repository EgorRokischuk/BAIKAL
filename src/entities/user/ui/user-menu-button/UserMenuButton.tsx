import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import * as s from './UserMenuButton.module.scss';
import { Typography } from '@mui/material';
import * as React from 'react';
import Button from '@mui/material/Button';
import { UserMenuOverlay } from './UserMenuOverlay';

export const UserMenuButton = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <div className={s.user_menu_button}>
                    <div className={s.user_menu_button_avatar_container}>
                        <AccountCircleOutlinedIcon
                            sx={{ fontSize: 50 }} />
                    </div>
                    <span className={s.user_menu_button_caption}>
                        <Typography variant='caption'>Гость</Typography>
                    </span>
                </div>
            </Button>
            <UserMenuOverlay
                open={open}
                anchorEl={anchorEl}
                handleClose={handleClose}
            />
        </div>
    );
}