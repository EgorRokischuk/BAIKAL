import { aboutRecordHandlers } from '@/entities/AboutRecord';
import { externalResourceHandlers } from '@/entities/ExternalResource';
import { authHandlers } from '@/entities/User';

export const handlers = [...authHandlers, ...externalResourceHandlers, ...aboutRecordHandlers];
