import { Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { ISupportTicketRequest } from '@/entities/SupportTicket/types';
import { FileInput } from '@/shared/ui/FileInput';
import { InputField } from '@/shared/ui/InputField';

export const SupportTicketFields: React.FC = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext<ISupportTicketRequest>();

	return (
		<>
			<Controller
				name="subject"
				control={control}
				render={({ field: { ref, ...field } }) => (
					<InputField
						label="Тема"
						error={Boolean(errors.subject)}
						helperText={errors.subject?.message as string}
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
						label="Подробно опишите проблему"
						multiline
						rows={5}
						error={Boolean(errors.description)}
						helperText={errors.description?.message as string}
						inputRef={ref}
						{...field}
					/>
				)}
			/>

			<div>
				<Typography>{'Дополнительная информация (не обязательно)'}</Typography>

				<Controller
					name="email"
					control={control}
					render={({ field: { ref, ...field } }) => (
						<InputField
							label="Электронная почта"
							error={Boolean(errors.email)}
							helperText={errors.email?.message as string}
							inputRef={ref}
							{...field}
						/>
					)}
				/>
			</div>

			<Controller
				name="file"
				control={control}
				render={() => <FileInput name="file" multiple={false} />}
			/>
		</>
	);
};
