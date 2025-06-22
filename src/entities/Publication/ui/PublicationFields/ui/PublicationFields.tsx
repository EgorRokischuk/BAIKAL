import { Controller, useFormContext } from 'react-hook-form';
import { IPublicationRequest } from '@/entities/Publication/types';
import { InputField } from '@/shared/ui/InputField';

export const PublicationFields: React.FC = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext<IPublicationRequest>();

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

			<Controller
				name="authors"
				control={control}
				render={({ field: { ref, ...field } }) => (
					<InputField
						label="Авторы"
						multiline
						rows={5}
						error={Boolean(errors.authors)}
						helperText={errors.authors?.message as string}
						inputRef={ref}
						{...field}
					/>
				)}
			/>

			<Controller
				name="url"
				control={control}
				render={({ field: { ref, ...field } }) => (
					<InputField
						label="Внешний ресурс"
						multiline
						rows={5}
						error={Boolean(errors.url)}
						helperText={errors.url?.message as string}
						inputRef={ref}
						{...field}
					/>
				)}
			/>
		</>
	);
};
