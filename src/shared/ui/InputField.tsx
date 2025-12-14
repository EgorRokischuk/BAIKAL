import { SxProps, TextField as MUITextField, TextFieldProps, Theme } from '@mui/material';
import React from 'react';

const InputField: React.FC<TextFieldProps> = ({ label, sx, ...props }) => {
  const baseSx: SxProps<Theme> = {
    backgroundColor: '#f5f7fb',
    borderRadius: '10px',
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#f5f7fb',
      borderRadius: '10px',
      minHeight: 44,
      '& fieldset': { borderColor: '#cbd4de' },
      '&:hover fieldset': { borderColor: '#92a4b5' },
      '&.Mui-focused fieldset': { borderColor: '#1a72de' },
    },
    '& .MuiInputLabel-root': {
      color: '#59616c',
      fontWeight: 600,
      fontSize: 14,
    },
  };

  const mergedSx: SxProps<Theme> = Array.isArray(sx)
    ? [baseSx, ...sx]
    : sx
      ? [baseSx, sx]
      : baseSx;

  return (
    <MUITextField
      label={label}
      variant="outlined"
      fullWidth
      margin="none"
      InputLabelProps={{ shrink: true }}
      sx={mergedSx}
      {...props}
    />
  );
};

export { InputField };
