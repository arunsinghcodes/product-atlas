import { Product, CategoryProductsResponse } from '../types/product';
import { CreateEnquiryInput, EnquirySubmissionResult } from '../types/enquiry';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error && errorData.error.message) {
          errorMessage = Array.isArray(errorData.error.message)
            ? errorData.error.message.join(', ')
            : errorData.error.message;
        } else if (errorData.message) {
          errorMessage = Array.isArray(errorData.message)
            ? errorData.message.join(', ')
            : errorData.message;
        }
      } catch {
        // Fallback to generic message
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getFeaturedProducts(limit = 5): Promise<Product[]> {
    return this.request<Product[]>(`/products/featured?limit=${limit}`);
  }

  async getAllProducts(params?: { category?: string; search?: string }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<Product[]>(`/products${qs}`);
  }

  async getProductById(id: number | string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.request<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
  }

  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/categories');
  }

  async getCategoryProducts(category: string): Promise<CategoryProductsResponse> {
    return this.request<CategoryProductsResponse>(`/categories/${encodeURIComponent(category)}`);
  }

  async submitEnquiry(input: CreateEnquiryInput): Promise<EnquirySubmissionResult> {
    return this.request<EnquirySubmissionResult>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }
}

export const api = new ApiService();
