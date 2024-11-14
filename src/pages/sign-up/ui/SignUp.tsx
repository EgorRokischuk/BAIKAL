import InputField from "@/shared/lib/components/InputField/InputField";
import { AuthForm } from "@/widgets/authForm/ui";
import { Button } from "@mui/material";

function SignUp() {
	return (
		<div>
			<AuthForm title={'Регистрация'}>
				<Button href="/" size="small" variant="contained" color="secondary">Вернуться на главную</Button>
				<Button href="/auth/login" size="small" variant="contained" color="secondary">Авторизация</Button>
			</AuthForm>
		</div>
	);
}

export { SignUp };
