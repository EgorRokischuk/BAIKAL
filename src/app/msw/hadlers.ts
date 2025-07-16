import { aboutRecordHandlers } from '@/entities/AboutRecord';
import { externalResourceHandlers } from '@/entities/ExternalResource';
import { geeHandlers } from '@/entities/GEE';
import { mapHandlers } from '@/entities/Map';
import { publicationHandlers } from '@/entities/Publication';
import { supportTicketHandlers } from '@/entities/SupportTicket';
import { authHandlers } from '@/entities/User';

export const handlers = [
	...publicationHandlers,
	...authHandlers,
	...externalResourceHandlers,
	...mapHandlers,
	...aboutRecordHandlers,
	...supportTicketHandlers,
	...geeHandlers,
];
