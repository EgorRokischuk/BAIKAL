import {
	IExternalResourceRequest,
	useCreateExternalResourceMutation,
} from '@/entities/ExternalResource';

export const useEntityService = <T>() => {
	const [createExternalResourceMutation] = useCreateExternalResourceMutation();

	const createEntityService = async (type: string, entity: T) => {
		switch (type) {
			case 'external-resource':
				return createExternalResourceMutation(entity as IExternalResourceRequest);
			case 'publication':
				return null; // not released
			case 'about-record':
				return null; // not released
			default:
				return null; // returns when uncorrect type
		}
	};

	return { createEntityService };
};
