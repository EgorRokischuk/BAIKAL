import { Control, Controller, FieldErrors } from 'react-hook-form';
import { IAboutRecordRequest } from '@/entities/AboutRecord';
import { InputField } from '@/shared/ui/InputField';

interface IAboutRecordContentProps {
	control: Control<IAboutRecordRequest>;
	errors: FieldErrors<IAboutRecordRequest>;
}

export const AboutRecordContent: React.FC<IAboutRecordContentProps> = (props) => {
	return (
		<>
			<Controller
				name="title"
				control={props.control}
				render={({ field: { ref, ...field } }) => (
					<InputField
						label="Заголовок"
						error={Boolean(props.errors.title)}
						helperText={props.errors.title?.message}
						inputRef={ref}
						{...field}
					/>
				)}
			/>

			<Controller
				name="description"
				control={props.control}
				render={({ field: { ref, ...field } }) => (
					<InputField
						label="Описание"
						error={Boolean(props.errors.description)}
						helperText={props.errors.description?.message}
						inputRef={ref}
						{...field}
					/>
				)}
			/>
		</>
	);
};
