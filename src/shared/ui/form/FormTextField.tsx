import TextField, { type TextFieldProps } from '@mui/material/TextField';

export const FormTextField = (props: TextFieldProps) => {
  return <TextField variant="outlined" size="small" fullWidth {...props} />;
};
