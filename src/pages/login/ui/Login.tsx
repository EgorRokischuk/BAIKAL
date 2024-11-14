import InputField from "@/shared/lib/components/InputField/InputField";
import { AuthForm } from "@/widgets/authForm/ui";
import { Button } from "@mui/material";

function Login() {
	return (
		<div>
			<AuthForm title={'Авторизация'}>
				<InputField  required label="Логин" />
				<InputField required type="password" label="Пароль" />
				<Button href="/" size="small" type='submit' variant="contained" color="primary">Войти</Button>
				<Button href="/" size="small" variant="contained" color="secondary">Вернуться на главную</Button>
				<Button href="/auth/register" size="small" variant="contained" color="secondary">Регистрация</Button>
			</AuthForm>
		</div>
	);
}

export { Login };
