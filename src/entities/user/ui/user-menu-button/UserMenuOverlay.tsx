import { styled, alpha } from '@mui/material/styles';
import * as s from './UserMenuOverlay.module.scss';
import { Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import { BorderAll, BorderClear } from '@mui/icons-material';

const CustomMenu = styled((props: any) => (
    <Menu
        {...props}
    />
    ))(({theme}) => ({ '& .MuiPaper-root': {
        backgroundColor: 'rgb(12, 68, 147)',
        borderRadius: 0,
        marginLeft: theme.spacing(2),
        boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14)'
    }}));
export const UserMenuOverlay = (
    props: any
) => {
    return (
        <CustomMenu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={props.anchorEl}
            open={props.open}
            onClose={props.handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <div className={s.user_menu_block}>
                <div className={s.user_menu_block_header}>
                    <Typography variant='subtitle1' >
                        Вы используете гостевой режим
                    </Typography>
                </div>
                <div className={s.user_menu_block_text}>
                    <Typography variant='body2' >
                        Чтобы получить возможность сохраннять и выгружать данные, а также зайти в личный кабинет - пройдите авторизацию.
                        <br></br>
                        <br></br>
                        Если у Вас все еще нет учетной записи -  пройдите регистрацию.
                    </Typography>
                </div>
                <div className={s.user_menu_block_buttons}>
                    <button className={s.user_menu_block_button}>
                        <Typography variant='subtitle1'>
                            Авторизация
                        </Typography>
                    </button>
                    <button className={s.user_menu_block_button}>
                        <Typography variant='subtitle1'>
                            Регистрация
                        </Typography>
                    </button>
                </div>
            </div>
        </CustomMenu>
    )
}