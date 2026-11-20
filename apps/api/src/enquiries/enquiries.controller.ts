import { Controller, Post, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { Enquiry, EnquirySubmissionResult } from './interfaces/enquiry.interface';

@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createEnquiry(@Body() dto: CreateEnquiryDto): Promise<EnquirySubmissionResult> {
    return this.enquiriesService.createEnquiry(dto);
  }

  @Get()
  async getAllEnquiries(): Promise<Enquiry[]> {
    return this.enquiriesService.getAllEnquiries();
  }
}

