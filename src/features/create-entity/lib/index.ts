import { IAboutRecordRequest, useCreateAboutRecordMutation } from '@/entities/AboutRecord';
import {
	IExternalResourceRequest,
	useCreateExternalResourceMutation,
} from '@/entities/ExternalResource';
import {
	aboutRecordDefaultValue,
	aboutRecordSchema,
	externalResourceDefaultValue,
	externalResourceSchema,
} from '../model';

export const useEntityService = <T>() => {
	const [createExternalResourceMutation] = useCreateExternalResourceMutation();
	const [createAboutRecordMutation] = useCreateAboutRecordMutation();

	const createEntityService = async (type: string, entity: T) => {
		switch (type) {
			case 'external-resource':
				return createExternalResourceMutation(entity as IExternalResourceRequest);
			case 'publication':
				return null; // not released
			case 'about-record':
				return createAboutRecordMutation(entity as IAboutRecordRequest);
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
		case 'about-record':
			return aboutRecordSchema;
	}
};

export const initDefaultValues = <T>(type: string) => {
	switch (type) {
		case 'external-resource':
			return externalResourceDefaultValue as T;
		case 'about-record':
			return aboutRecordDefaultValue as T;
	}
};
