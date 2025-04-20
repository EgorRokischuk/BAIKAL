import {
	IExternalResourceRequest,
	useCreateExternalResourceMutation,
} from '@/entities/ExternalResource';
import { externalResourceDefaultValue, externalResourceSchema } from '../model';

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

export const initEntitySchema = (type: string) => {
	switch (type) {
		case 'external-resource':
			return externalResourceSchema;
	}
};

export const initDefaultValues = <T>(type: string) => {
	switch (type) {
		case 'external-resource':
			return externalResourceDefaultValue as T;
	}
};
