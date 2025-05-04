import { Controller, useFormContext } from 'react-hook-form';
import { InputField } from '@/shared/ui/InputField';

export const AboutRecordFields: React.FC = () => {
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
				name="description"
				control={control}
				render={({ field: { ref, ...field } }) => (
					<InputField
						label="Описание"
						multiline
						rows={5}
						error={Boolean(errors.description)}
						helperText={errors.description?.message as string}
						inputRef={ref}
						{...field}
					/>
				)}
			/>
		</>
	);
};
