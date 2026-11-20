import { Test, TestingModule } from '@nestjs/testing';
import { EnquiriesService } from '../src/enquiries/enquiries.service';
import { EMAIL_PROVIDER } from '../src/enquiries/adapters/email-provider.interface';
import { ConsoleEmailAdapter } from '../src/enquiries/adapters/console-email.adapter';

describe('EnquiriesService (AC-5)', () => {
  let service: EnquiriesService;
  let emailAdapter: ConsoleEmailAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnquiriesService,
        ConsoleEmailAdapter,
        {
          provide: EMAIL_PROVIDER,
          useExisting: ConsoleEmailAdapter,
        },
      ],
    }).compile();

    service = module.get<EnquiriesService>(EnquiriesService);
    emailAdapter = module.get<ConsoleEmailAdapter>(ConsoleEmailAdapter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an enquiry, dispatch email, and return reference ID with confirmation message', async () => {
    const sendSpy = jest.spyOn(emailAdapter, 'sendEnquiryNotification');

    const result = await service.createEnquiry({
      productId: 1,
      productTitle: 'Fjallraven - Foldsack No. 1 Backpack',
      customerName: 'Jane Doe',
      customerEmail: 'jane.doe@example.com',
      customerPhone: '+1-555-0199',
      message: 'I would like to purchase in bulk for my company team.',
    });

    expect(result.success).toBe(true);
    expect(result.referenceId).toMatch(/^ENQ-/);
    expect(result.message).toContain('Thank you');
    expect(sendSpy).toHaveBeenCalledTimes(1);

    const enquiries = await service.getAllEnquiries();
    expect(enquiries).toHaveLength(1);
    expect(enquiries[0].customerEmail).toBe('jane.doe@example.com');
  });
});

