import { aboutRecordHandlers } from '@/entities/AboutRecord';
import { mapHandlers } from '@/entities/Map';
import { externalResourceHandlers } from '@/entities/ExternalResource';
import { authHandlers } from '@/entities/User';

export const handlers = [...authHandlers, ...externalResourceHandlers, ...mapHandlers, ...aboutRecordHandlers];
