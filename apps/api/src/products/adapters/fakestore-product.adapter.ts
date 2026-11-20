import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IProductProvider } from './product-provider.interface';
import { Product } from '../interfaces/product.interface';
import { MockProductAdapter } from './mock-product.adapter';

interface CachedItem<T> {
  data: T;
  expiresAt: number;
}

@Injectable()
export class FakeStoreProductAdapter implements IProductProvider {
  private readonly logger = new Logger(FakeStoreProductAdapter.name);
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly cacheTtlMs: number;
  private readonly cache = new Map<string, CachedItem<any>>();

  constructor(
    private readonly configService: ConfigService,
    private readonly fallbackAdapter: MockProductAdapter,
  ) {
    this.baseUrl =
      this.configService.get<string>('FAKESTORE_API_BASE_URL') ||
      'https://fakestoreapi.com';
    this.timeoutMs = Number(
      this.configService.get<number>('FAKESTORE_TIMEOUT_MS') || 4000,
    );
    this.cacheTtlMs = Number(
      this.configService.get<number>('PRODUCT_CACHE_TTL_MS') || 300000,
    );
    this.logger.log(
      `FakeStoreProductAdapter configured with baseUrl: ${this.baseUrl}, timeout: ${this.timeoutMs}ms, cacheTTL: ${this.cacheTtlMs}ms`,
    );
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  private setInCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + this.cacheTtlMs,
    });
  }

  private async fetchWithTimeout(url: string): Promise<any> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  async findAll(): Promise<Product[]> {
    const cacheKey = 'all_products';
    const cached = this.getFromCache<Product[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      this.logger.debug(`Fetching products from ${this.baseUrl}/products`);
      const products = (await this.fetchWithTimeout(
        `${this.baseUrl}/products`,
      )) as Product[];
      this.setInCache(cacheKey, products);
      return products;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch from FakeStoreAPI (${(error as Error).message}). Falling back to MockProductAdapter.`,
      );
      return this.fallbackAdapter.findAll();
    }
  }

  async findById(id: number): Promise<Product | null> {
    const cacheKey = `product_${id}`;
    const cached = this.getFromCache<Product>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      this.logger.debug(`Fetching product ${id} from ${this.baseUrl}/products/${id}`);
      const product = (await this.fetchWithTimeout(
        `${this.baseUrl}/products/${id}`,
      )) as Product;
      if (product && product.id) {
        this.setInCache(cacheKey, product);
        return product;
      }
      return null;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch product ${id} from FakeStoreAPI (${(error as Error).message}). Falling back to MockProductAdapter.`,
      );
      return this.fallbackAdapter.findById(id);
    }
  }

  async findByCategory(category: string): Promise<Product[]> {
    const encodedCategory = encodeURIComponent(category);
    const cacheKey = `category_${category.toLowerCase()}`;
    const cached = this.getFromCache<Product[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      this.logger.debug(
        `Fetching category ${category} from ${this.baseUrl}/products/category/${encodedCategory}`,
      );
      const products = (await this.fetchWithTimeout(
        `${this.baseUrl}/products/category/${encodedCategory}`,
      )) as Product[];
      this.setInCache(cacheKey, products);
      return products;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch category ${category} from FakeStoreAPI (${(error as Error).message}). Falling back to MockProductAdapter.`,
      );
      return this.fallbackAdapter.findByCategory(category);
    }
  }

  async getCategories(): Promise<string[]> {
    const cacheKey = 'all_categories';
    const cached = this.getFromCache<string[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      this.logger.debug(`Fetching categories from ${this.baseUrl}/products/categories`);
      const categories = (await this.fetchWithTimeout(
        `${this.baseUrl}/products/categories`,
      )) as string[];
      this.setInCache(cacheKey, categories);
      return categories;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch categories from FakeStoreAPI (${(error as Error).message}). Falling back to MockProductAdapter.`,
      );
      return this.fallbackAdapter.getCategories();
    }
  }
}

