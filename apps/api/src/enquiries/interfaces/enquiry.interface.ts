export interface Enquiry {
  id: string;
  productId: number;
  productTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  message?: string;
  createdAt: string;
}

export interface EnquirySubmissionResult {
  success: boolean;
  referenceId: string;
  message: string;
  productTitle: string;
  submittedAt: string;
}

