import { Box } from '@mui/material';
import React, { ReactNode } from 'react';
import { Progress } from '@/shared/ui/Progress';
import * as styles from './AuthForm.module.scss';

interface AuthFormProps {
	title: string;
	width?: number;
	onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
	children: ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, width = 400, onSubmit, children }) => {
	return (
		<Box className={styles.authFormContainer} width={width}>
			<h2 className={styles.authFormTitle}>{title}</h2>
			<Progress color="primary" />

			<form className={styles.authForm} onSubmit={onSubmit}>
				{children}
			</form>
		</Box>
	);
};

export { AuthForm };
