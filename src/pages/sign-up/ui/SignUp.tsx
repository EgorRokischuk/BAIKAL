import { Button } from '@mui/material';
import { AuthForm } from '@/widgets/auth-form';

const SignUp: React.FC = () => {
	return (
		<div>
			<AuthForm title={'Регистрация'}>
				<Button href="/" size="small" variant="contained" color="secondary">
					{'Вернуться на главную'}
				</Button>
				<Button href="/auth/login" size="small" variant="contained" color="secondary">
					{'Авторизация'}
				</Button>
			</AuthForm>
		</div>
	);
};

export { SignUp };
