import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnquiryModal } from '../components/enquiry/EnquiryModal';
import { Product } from '../types/product';
import { api } from '../services/api';

const mockProduct: Product = {
  id: 42,
  title: 'Mechanical Gaming Keyboard',
  price: 129.99,
  description: 'RGB mechanical switches with ultra-low latency.',
  category: 'electronics',
  image: 'https://example.com/keyboard.png',
  rating: { rate: 4.9, count: 320 },
};

describe('EnquiryModal Component (AC-5)', () => {
  it('validates required fields and shows thank you message upon submission', async () => {
    vi.spyOn(api, 'submitEnquiry').mockResolvedValue({
      success: true,
      referenceId: 'ENQ-TEST-1234',
      message: 'Thank you for your enquiry!',
      productTitle: mockProduct.title,
      submittedAt: new Date().toISOString(),
    });

    const handleClose = vi.fn();

    render(
      <EnquiryModal
        product={mockProduct}
        isOpen={true}
        onClose={handleClose}
      />,
    );

    // Form should show product title
    expect(screen.getByText('Mechanical Gaming Keyboard')).toBeInTheDocument();

    // Fill in inputs
    const nameInput = screen.getByPlaceholderText(/sarah jenkins/i);
    const emailInput = screen.getByPlaceholderText(/sarah@example\.com/i);
    const messageInput = screen.getByPlaceholderText(/bulk ordering/i);

    fireEvent.change(nameInput, { target: { value: 'Arun Assessor' } });
    fireEvent.change(emailInput, { target: { value: 'arun@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Interested in placing an order for 50 units.' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /submit enquiry/i });
    fireEvent.click(submitBtn);

    // Verify Thank You confirmation screen
    await waitFor(() => {
      expect(screen.getByText(/thank you, arun assessor!/i)).toBeInTheDocument();
      expect(screen.getByText('ENQ-TEST-1234')).toBeInTheDocument();
    });
  });
});

