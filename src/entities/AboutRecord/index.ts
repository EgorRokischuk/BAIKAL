export { aboutRecordHandlers } from './api/__mocks__';
export {
	aboutRecordApi,
	useGetAboutRecordsListQuery,
	useGetAboutRecordByIdQuery,
	useCreateAboutRecordMutation,
	useUpdateAboutRecordMutation,
	useDeleteAboutRecordMutation,
} from './api/aboutRecordApi';
export type { IAboutRecordRequest, IAboutRecordResponse } from './types';
export { AboutRecordFields } from './ui/AboutRecordFields';
