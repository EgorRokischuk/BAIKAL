import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { AuthForm } from '@/widgets/auth-form';
import {
	ISupportTicketRequest,
	SupportTicketFields,
	useSendSupportTicketMutation,
} from '@/entities/SupportTicket';
import { Button } from '@/shared/ui/Button';
import { defaultValues, supportTicketSchema } from '../model';

const Support: React.FC = () => {
	const methods = useForm<ISupportTicketRequest>({
		mode: 'onSubmit',
		resolver: zodResolver(supportTicketSchema),
		defaultValues,
	});

	const { handleSubmit, watch } = methods;

	const data = watch();

	const [sendMutation] = useSendSupportTicketMutation();

	const onSend = async () => {
		await sendMutation(data);
	};

	return (
		<div>
			<FormProvider {...methods}>
				<AuthForm title={'Сообщить о проблеме'} width={500} onSubmit={handleSubmit(onSend)}>
					<SupportTicketFields />

					<Button size="small" type="submit" variant="contained" color="primary">
						{'Подтвердить'}
					</Button>
				</AuthForm>
			</FormProvider>
		</div>
	);
};

export { Support };
