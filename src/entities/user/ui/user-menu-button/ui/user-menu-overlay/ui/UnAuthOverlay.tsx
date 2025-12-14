import { Typography } from '@mui/material';
import { MenuProps } from '@mui/material/Menu';
import { globalActions } from '@/app/providers/store';
import { ROUTES } from '@/shared/config/router/routes';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { CustomMenu } from '../config';
import * as s from './UserMenuOverlay.module.scss';

const UnAuthOverlay: React.FC<MenuProps> = (props) => {
	const dispatch = useAppDispatch();

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
                                        <Typography variant="subtitle1">{'Вы используете гостевой режим'}</Typography>
                                </div>

                                <div className={s.menu_block__text}>
                                        <Typography variant="body2">
                                                {
                                                        'Чтобы получить возможность сохранять и выгружать данные, а также зайти в личный кабинет — пройдите авторизацию.'
                                                }
                                                <br />
                                                <br />
                                                {'Если у вас все еще нет учетной записи — пройдите регистрацию.'}
                                        </Typography>
                                </div>

				<div className={s.menu_block__buttons}>
					<button
						className={s.menu_block__button}
						onClick={() => dispatch(globalActions.setCurrentPage(ROUTES.auth.login.page))}
					>
						<Typography variant="subtitle1">{'Авторизация'}</Typography>
					</button>
					<button
						className={s.menu_block__button}
						onClick={() => dispatch(globalActions.setCurrentPage(ROUTES.auth.register.page))}
					>
						<Typography variant="subtitle1">{'Регистрация'}</Typography>
					</button>
				</div>
			</div>
		</CustomMenu>
	);
};

export { UnAuthOverlay };
