import { Controller, useFormContext } from 'react-hook-form';
import { FileInput } from '@/shared/ui/FileInput';
import { InputField } from '@/shared/ui/InputField';

export const ExternalResourceFields: React.FC = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	return (
		<>
			<Controller
				name="title"
				control={control}
				render={({ field: { ref, ...field } }) => (
					<InputField
						label="Заголовок"
						error={Boolean(errors.title)}
						helperText={errors.title?.message as string}
						inputRef={ref}
						{...field}
					/>
				)}
			/>

			<Controller
				name="link"
				control={control}
				render={({ field: { ref, ...field } }) => (
					<InputField
						label="Ссылка"
						error={Boolean(errors.link)}
						helperText={errors.link?.message as string}
						inputRef={ref}
						{...field}
					/>
				)}
			/>

			<Controller
				name="image"
				control={control}
				render={() => <FileInput name="image" accept="iamge/*" multiple={false} />}
			/>
		</>
	);
};
