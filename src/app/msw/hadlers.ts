import { mapHandlers } from '@/entities/Map';
import { authHandlers } from '@/entities/User';

export const handlers = [...authHandlers, ...mapHandlers];
