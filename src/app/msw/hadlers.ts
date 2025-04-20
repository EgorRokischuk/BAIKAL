import { externalResourceHandlers } from '@/entities/ExternalResource';
import { authHandlers } from '@/entities/User';

export const handlers = [...authHandlers, ...externalResourceHandlers];
