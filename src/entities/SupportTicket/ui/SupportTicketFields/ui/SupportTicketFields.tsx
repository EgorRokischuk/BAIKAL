import { Controller, useFormContext } from 'react-hook-form';
import { ISupportTicketRequest } from '@/entities/SupportTicket/types';
import { FileInput } from '@/shared/ui/FileInput';
import { InputField } from '@/shared/ui/InputField';

interface ISupportTicketFieldsProps {
        fieldClassName?: string;
        fileInputClassName?: string;
}

export const SupportTicketFields: React.FC<ISupportTicketFieldsProps> = ({ fieldClassName, fileInputClassName }) => {
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
                                                className={fieldClassName}
                                                label="Тема"
                                                required
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
                                                className={fieldClassName}
                                                label="Подробно опишите проблему"
                                                multiline
                                                rows={5}
                                                required
                                                error={Boolean(errors.description)}
                                                helperText={errors.description?.message as string}
                                                inputRef={ref}
                                                {...field}
                                        />
                                )}
                        />

                        <Controller
                                name="email"
                                control={control}
                                render={({ field: { ref, ...field } }) => (
                                        <InputField
                                                className={fieldClassName}
                                                label="Электронная почта"
                                                required
                                                error={Boolean(errors.email)}
                                                helperText={errors.email?.message as string}
                                                inputRef={ref}
                                                {...field}
                                        />
                                )}
                        />

                        <Controller
                                name="file"
                                control={control}
                                render={() => <FileInput className={fileInputClassName} name="file" multiple />}
                        />
                </>
        );
};
