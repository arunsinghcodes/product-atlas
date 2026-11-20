import { Enquiry } from '../interfaces/enquiry.interface';

export const EMAIL_PROVIDER = 'EMAIL_PROVIDER';

export interface EmailDispatchResult {
  messageId: string;
  previewUrl?: string;
  recipient: string;
}

export interface IEmailProvider {
  sendEnquiryNotification(enquiry: Enquiry): Promise<EmailDispatchResult>;
}
