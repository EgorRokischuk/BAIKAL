import { setupWorker } from 'msw/browser';
import { handlers } from './hadlers';

export const worker = setupWorker(...handlers);
