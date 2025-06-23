import { IAboutRecordRequest, useCreateAboutRecordMutation } from '@/entities/AboutRecord';
import {
	IExternalResourceRequest,
	useCreateExternalResourceMutation,
} from '@/entities/ExternalResource';
import { IPublicationRequest, useCreatePublicationMutation } from '@/entities/Publication';
import {
	aboutRecordDefaultValue,
	aboutRecordSchema,
	externalResourceDefaultValue,
	externalResourceSchema,
	publicationDefaultValue,
	publicationSchema,
} from '../model';

export const useEntityService = <T>() => {
	const [createExternalResourceMutation] = useCreateExternalResourceMutation();
	const [createAboutRecordMutation] = useCreateAboutRecordMutation();
	const [createPublicationMutation] = useCreatePublicationMutation();

	const createEntityService = async (type: string, entity: T) => {
		switch (type) {
			case 'external-resource':
				return createExternalResourceMutation(entity as IExternalResourceRequest);
			case 'publication':
				return createPublicationMutation(entity as IPublicationRequest);
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
		case 'publication':
			return publicationSchema;
	}
};

export const initDefaultValues = <T>(type: string) => {
	switch (type) {
		case 'external-resource':
			return externalResourceDefaultValue as T;
		case 'about-record':
			return aboutRecordDefaultValue as T;
		case 'publication':
			return publicationDefaultValue as T;
	}
};
