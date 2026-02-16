import type { InputHTMLAttributes } from 'react';
import { useController, useFormContext } from 'react-hook-form';

interface FormFileFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export const FormFileField = ({ name, ...props }: FormFileFieldProps) => {
  const { control } = useFormContext();
  const { field } = useController({ control, name });

  return (
    <input
      type="file"
      {...props}
      onChange={(event) => {
        const file = event.target.files?.[0];
        field.onChange(file);
      }}
    />
  );
};
