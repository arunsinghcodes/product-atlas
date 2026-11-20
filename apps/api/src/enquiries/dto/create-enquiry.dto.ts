import { IsNotEmpty, IsEmail, IsNumber, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateEnquiryDto {
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsNumber({}, { message: 'Product ID must be a number' })
  productId: number;

  @IsNotEmpty({ message: 'Product title is required' })
  @IsString()
  productTitle: string;

  @IsNotEmpty({ message: 'Your name is required' })
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  customerName: string;

  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  customerEmail: string;

  @IsOptional()
  @IsString()
  @MaxLength(25, { message: 'Phone number cannot exceed 25 characters' })
  customerPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Message cannot exceed 1000 characters' })
  message?: string;
}

