import { Button } from '@mui/material';
import { globalActions } from '@/app/providers/store';
import { AuthForm } from '@/widgets/auth-form';
import { ROUTES } from '@/shared/config/router/routes';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

const SignUp: React.FC = () => {
	const dispatch = useAppDispatch();

	return (
		<div>
			<AuthForm title={'Регистрация'}>
				<Button
					size="small"
					variant="contained"
					color="secondary"
					onClick={() => dispatch(globalActions.setCurrentPage(ROUTES.appRoute))}
				>
					{'Вернуться на главную'}
				</Button>
				<Button
					size="small"
					variant="contained"
					color="secondary"
					onClick={() => dispatch(globalActions.setCurrentPage(ROUTES.auth.login.page))}
				>
					{'Авторизация'}
				</Button>
			</AuthForm>
		</div>
	);
};

export { SignUp };
