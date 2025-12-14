import { Box } from '@mui/material';
import clsx from 'classnames';
import React, { ReactNode } from 'react';
import * as styles from './AuthForm.module.scss';

interface AuthFormProps {
        title: string;
        width?: number;
        onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
        children: ReactNode;
        className?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, width = 460, onSubmit, children, className }) => {
        return (
                <Box className={clsx(styles.authFormContainer, className)} width={width}>
                        <h2 className={styles.authFormTitle}>{title}</h2>

                        <form className={styles.authForm} onSubmit={onSubmit}>
                                {children}
                        </form>
                </Box>
        );
};

export { AuthForm };
