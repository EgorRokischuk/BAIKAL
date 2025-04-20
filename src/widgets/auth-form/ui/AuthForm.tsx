import React, { ReactNode } from 'react';
import { Progress } from '@/shared/ui/Progress';
import * as styles from './AuthForm.module.scss';

interface AuthFormProps {
	title: string;
	onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
	children: ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, onSubmit, children }) => {
	return (
		<div className={styles.authFormContainer}>
			<h2 className={styles.authFormTitle}>{title}</h2>
			<Progress color="primary" />

			<form className={styles.authForm} onSubmit={onSubmit}>
				{children}
			</form>
		</div>
	);
};

export { AuthForm };
