import { Injectable, Logger } from '@nestjs/common';
import { IEmailProvider, EmailDispatchResult } from './email-provider.interface';
import { Enquiry } from '../interfaces/enquiry.interface';

@Injectable()
export class ConsoleEmailAdapter implements IEmailProvider {
  private readonly logger = new Logger(ConsoleEmailAdapter.name);

  async sendEnquiryNotification(enquiry: Enquiry): Promise<EmailDispatchResult> {
    const messageId = `console-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    this.logger.log('--------------------------------------------------');
    this.logger.log(`📧 [EMAIL NOTIFICATION DISPATCHED] ID: ${messageId}`);
    this.logger.log(`TO: sales@ansrcatalogue.com`);
    this.logger.log(`SUBJECT: New Customer Product Enquiry - ${enquiry.productTitle}`);
    this.logger.log(`CUSTOMER NAME: ${enquiry.customerName}`);
    this.logger.log(`CUSTOMER EMAIL: ${enquiry.customerEmail}`);
    this.logger.log(`PHONE: ${enquiry.customerPhone || 'Not provided'}`);
    this.logger.log(`PRODUCT ID: ${enquiry.productId} (${enquiry.productTitle})`);
    this.logger.log(`MESSAGE: ${enquiry.message || 'No additional message provided.'}`);
    this.logger.log(`TIMESTAMP: ${enquiry.createdAt}`);
    this.logger.log('--------------------------------------------------');

    return {
      messageId,
      recipient: 'sales@ansrcatalogue.com',
    };
  }
}
