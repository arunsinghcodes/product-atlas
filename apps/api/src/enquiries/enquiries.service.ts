import { Injectable, Inject, Logger } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { Enquiry, EnquirySubmissionResult } from './interfaces/enquiry.interface';
import { EMAIL_PROVIDER, IEmailProvider } from './adapters/email-provider.interface';

@Injectable()
export class EnquiriesService {
  private readonly logger = new Logger(EnquiriesService.name);
  private readonly enquiries: Enquiry[] = [];

  constructor(
    @Inject(EMAIL_PROVIDER)
    private readonly emailProvider: IEmailProvider,
  ) {}

  async createEnquiry(dto: CreateEnquiryDto): Promise<EnquirySubmissionResult> {
    const referenceId = `ENQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const enquiry: Enquiry = {
      id: referenceId,
      productId: dto.productId,
      productTitle: dto.productTitle,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      customerPhone: dto.customerPhone,
      message: dto.message,
      createdAt: new Date().toISOString(),
    };

    // Store in audit memory
    this.enquiries.push(enquiry);
    this.logger.log(`Enquiry created with ID ${referenceId} for product #${dto.productId}`);

    // Dispatch email to sales team
    await this.emailProvider.sendEnquiryNotification(enquiry);

    return {
      success: true,
      referenceId,
      productTitle: dto.productTitle,
      message: 'Thank you for your enquiry! Our sales team will get back to you shortly.',
      submittedAt: enquiry.createdAt,
    };
  }

  async getAllEnquiries(): Promise<Enquiry[]> {
    return [...this.enquiries];
  }
}

