import { Injectable, Logger } from '@nestjs/common';
import { IProductProvider } from './product-provider.interface';
import { Product } from '../interfaces/product.interface';
import { SEED_PRODUCTS } from '../data/seed-products';

@Injectable()
export class MockProductAdapter implements IProductProvider {
  private readonly logger = new Logger(MockProductAdapter.name);
  private readonly products: Product[] = [...SEED_PRODUCTS];

  constructor() {
    this.logger.log(`Initialized MockProductAdapter with ${this.products.length} products.`);
  }

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async findById(id: number): Promise<Product | null> {
    const product = this.products.find((p) => p.id === id);
    return product ? { ...product } : null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    const normalized = category.toLowerCase();
    return this.products.filter(
      (p) => p.category.toLowerCase() === normalized,
    );
  }

  async getCategories(): Promise<string[]> {
    const categories = Array.from(
      new Set(this.products.map((p) => p.category)),
    );
    return categories;
  }
}

