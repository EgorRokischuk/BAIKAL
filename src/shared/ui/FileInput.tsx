import { InputHTMLAttributes } from 'react';
import { useController, useFormContext } from 'react-hook-form';

interface IFileInputProps extends InputHTMLAttributes<HTMLInputElement> {
	name: string;
}

export const FileInput: React.FC<IFileInputProps> = ({ name, ...props }) => {
	const { control } = useFormContext();
	const { field } = useController({ control, name });

	return (
		<input
			type="file"
			{...props}
			onChange={(e) => {
				field.onChange(e.target.files[0]);
			}}
		/>
	);
};
