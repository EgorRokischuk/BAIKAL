import { SxProps, TextField as MUITextField, TextFieldProps, Theme } from '@mui/material';
import React from 'react';

const InputField: React.FC<TextFieldProps> = ({ label, sx, ...props }) => {
  const baseSx: SxProps<Theme> = {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      minHeight: 44,
      '& fieldset': { borderColor: '#000000' },
      '&:hover fieldset': { borderColor: '#000000' },
      '&.Mui-focused fieldset': { borderColor: '#1a72de', borderWidth: 2 },
    },
    '& .MuiInputLabel-root': {
      color: '#111827',
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
