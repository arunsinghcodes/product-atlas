import React, { useState } from 'react';
import { Product } from '../../types/product';
import { api } from '../../services/api';
import { EnquirySubmissionResult } from '../../types/enquiry';
import { X, Send, CheckCircle2, AlertCircle, ShoppingBag, Mail, User, Phone, MessageSquare } from 'lucide-react';

interface EnquiryModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<EnquirySubmissionResult | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail.trim() || !emailRegex.test(customerEmail.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await api.submitEnquiry({
        productId: product.id,
        productTitle: product.title,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim() || undefined,
        message: message.trim() || undefined,
      });

      setSubmissionResult(result);
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setMessage('');
    setSubmissionResult(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 id="enquiry-modal-title" className="text-base font-bold text-slate-900">
                {submissionResult ? 'Enquiry Submitted' : 'Product Enquiry'}
              </h2>
              <p className="text-xs text-slate-500">
                {submissionResult ? 'Confirmation & Reference' : 'Direct enquiry to our sales team'}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submissionResult ? (
            /* Thank You Message (AC-5: AND the customer will see a "Thank you" message) */
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Thank You, {customerName}!
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  We have received your enquiry for{' '}
                  <span className="font-semibold text-slate-900">"{product.title}"</span>. An email notification has been dispatched to our sales desk.
                </p>
              </div>

              {/* Reference Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-w-sm mx-auto text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Reference Code:</span>
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {submissionResult.referenceId}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Customer Email:</span>
                  <span className="text-slate-800 font-medium">{customerEmail}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Sales SLA:</span>
                  <span className="text-emerald-700 font-semibold">Response within 24 hours</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-3 px-6 bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-colors shadow-md"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            /* Enquiry Form (AC-5: GIVEN I click Enquire button AND complete subsequent form) */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Summary Preview */}
              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-12 h-12 object-contain bg-white p-1 rounded-lg border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {product.title}
                  </p>
                  <p className="text-xs font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Your Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden transition-all"
                />
              </div>

              {/* Customer Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden transition-all"
                />
              </div>

              {/* Customer Phone (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone Number (Optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden transition-all"
                />
              </div>

              {/* Message (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>Inquiry Note / Custom Quantity (Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us what you need (e.g., bulk ordering, custom specifications, delivery timeline)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

