import { Control, Controller, FieldErrors } from 'react-hook-form';
import { IExternalResourceRequest } from '@/entities/ExternalResource';
import { FileInput } from '@/shared/ui/FileInput';
import { InputField } from '@/shared/ui/InputField';

interface IExternalResourceContentProps {
	control: Control<IExternalResourceRequest>;
	errors: FieldErrors<IExternalResourceRequest>;
}

export const ExternalResourceContent: React.FC<IExternalResourceContentProps> = (props) => {
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
				name="link"
				control={props.control}
				render={({ field: { ref, ...field } }) => (
					<InputField
						label="Ссылка"
						error={Boolean(props.errors.link)}
						helperText={props.errors.link?.message}
						inputRef={ref}
						{...field}
					/>
				)}
			/>

			<Controller
				name="image"
				control={props.control}
				render={() => (
					<FileInput
						name="image"
						control={props.control as unknown as Control}
						accept="iamge/*"
						multiple={false}
					/>
				)}
			/>
		</>
	);
};
