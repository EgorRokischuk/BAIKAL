import * as s from './UserMenuOverlay.module.scss';
import { Typography } from '@mui/material';

export const UserMenuOverlay = () => {
    return (
        <div>
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
    )
}