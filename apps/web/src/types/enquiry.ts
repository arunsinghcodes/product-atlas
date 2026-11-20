export interface CreateEnquiryInput {
  productId: number;
  productTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  message?: string;
}

export interface EnquirySubmissionResult {
  success: boolean;
  referenceId: string;
  message: string;
  productTitle: string;
  submittedAt: string;
}

