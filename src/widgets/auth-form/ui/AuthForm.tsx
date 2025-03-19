import { LinearProgress } from '@mui/material';
import React, { ReactNode } from 'react';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import * as styles from './AuthForm.module.scss';

interface AuthFormProps {
	title: string;
	onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
	children: ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, onSubmit, children }) => {
	const isLoading = useAppSelector(({ global }) => global.isLoading);

	return (
		<div className={styles.authFormContainer}>
			<h2 className={styles.authFormTitle}>{title}</h2>
			{isLoading && <LinearProgress color="primary" />}

			<form className={styles.authForm} onSubmit={onSubmit}>
				{children}
			</form>
		</div>
	);
};

export { AuthForm };
