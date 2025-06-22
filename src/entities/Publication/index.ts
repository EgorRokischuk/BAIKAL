export { publicationHandlers } from './api/__mocks__';
export {
	publicationApi,
	useGetPublicationsListQuery,
	useGetPublicationByIdQuery,
	useCreatePublicationMutation,
	useUpdateAboutRecordMutation,
	useDeletePublicationMutation,
} from './api/publicationApi';
export type { IPublicationRequest, IPublicationResponse } from './types';
export { PublicationFields } from './ui/PublicationFields';
