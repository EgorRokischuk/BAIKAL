import React from 'react';
import { TextField as MUITextField, TextFieldProps } from '@mui/material';

const InputField: React.FC<TextFieldProps> = ({ label, ...props }) => {
	return <MUITextField label={label} variant="standard" fullWidth margin="none" {...props} />;
};

export { InputField };
