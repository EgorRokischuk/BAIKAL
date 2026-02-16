export interface SupportTicketPayload {
  subject: string;
  description: string;
  email: string;
  file?: File;
}
