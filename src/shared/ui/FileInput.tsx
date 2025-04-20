import { InputHTMLAttributes, useState } from 'react';
import { Control, useController } from 'react-hook-form';

interface IFileInputProps extends InputHTMLAttributes<HTMLInputElement> {
	name: string;
	control: Control;
}

export const FileInput: React.FC<IFileInputProps> = ({ control, name, ...props }) => {
	const { field } = useController({ control, name });
	const [value, setValue] = useState<string>('');
	return (
		<input
			type="file"
			{...props}
			value={value}
			onChange={(e) => {
				setValue(e.target.value);
				field.onChange(e.target.files[0]);
			}}
		/>
	);
};
