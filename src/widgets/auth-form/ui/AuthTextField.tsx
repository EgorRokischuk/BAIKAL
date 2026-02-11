import { InputAdornment, TextField, type TextFieldProps } from '@mui/material';
import clsx from 'classnames';
import React from 'react';
import * as styles from './AuthTextField.module.scss';

type AuthTextFieldProps = TextFieldProps & {
	requiredMark?: boolean;
};

const AuthTextField: React.FC<AuthTextFieldProps> = ({
	className,
	requiredMark = false,
	InputProps,
	InputLabelProps,
	FormHelperTextProps,
	...props
}) => {
	const adornmentItems: React.ReactNode[] = [];

	if (InputProps?.endAdornment) {
		adornmentItems.push(InputProps.endAdornment);
	}

	if (requiredMark) {
		adornmentItems.push(<span className={styles.requiredMark}>*</span>);
	}

	const endAdornment =
		adornmentItems.length > 0 ? (
			<InputAdornment position="end">
				<span className={styles.endAdornment}>
					{adornmentItems.map((item, index) => (
						<span className={styles.endAdornmentItem} key={index}>
							{item}
						</span>
					))}
				</span>
			</InputAdornment>
		) : undefined;

	return (
		<TextField
			{...props}
			variant="outlined"
			fullWidth
			margin="none"
			placeholder={
				props.placeholder ??
				(typeof props.label === 'string' ? props.label : undefined)
			}
			className={clsx(styles.field, className)}
			InputLabelProps={{
				shrink: false,
				...InputLabelProps,
			}}
			FormHelperTextProps={{
				className: styles.helperText,
				...FormHelperTextProps,
			}}
			InputProps={{
				...InputProps,
				endAdornment,
				sx: {
					borderRadius: '10px',
					backgroundColor: '#fdfdfd',
					'& .MuiOutlinedInput-notchedOutline': {
						borderColor: '#a6a6a6',
					},
					'&:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: '#1E5DAC',
					},
					'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
						borderColor: '#1E5DAC',
						borderWidth: 1.5,
					},
					'& input::placeholder': {
						color: '#6b6b6b',
						opacity: 1,
					},
					'& input': {
						padding: '14px 16px',
					},
					...(InputProps?.sx ?? {}),
				},
			}}
		/>
	);
};

export { AuthTextField };
