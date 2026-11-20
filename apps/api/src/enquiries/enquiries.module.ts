import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnquiriesController } from './enquiries.controller';
import { EnquiriesService } from './enquiries.service';
import { EMAIL_PROVIDER } from './adapters/email-provider.interface';
import { SmtpEmailAdapter } from './adapters/smtp-email.adapter';
import { ConsoleEmailAdapter } from './adapters/console-email.adapter';

@Module({
  imports: [ConfigModule],
  controllers: [EnquiriesController],
  providers: [
    SmtpEmailAdapter,
    ConsoleEmailAdapter,
    {
      provide: EMAIL_PROVIDER,
      useFactory: (
        configService: ConfigService,
        smtpAdapter: SmtpEmailAdapter,
        consoleAdapter: ConsoleEmailAdapter,
      ) => {
        const providerType = configService.get<string>('EMAIL_PROVIDER') || 'smtp';
        if (providerType.toLowerCase() === 'console') {
          return consoleAdapter;
        }
        return smtpAdapter;
      },
      inject: [ConfigService, SmtpEmailAdapter, ConsoleEmailAdapter],
    },
    EnquiriesService,
  ],
  exports: [EnquiriesService],
})
export class EnquiriesModule {}
