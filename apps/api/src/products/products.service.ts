import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PRODUCT_PROVIDER, IProductProvider } from './adapters/product-provider.interface';
import { Product, CategoryProductsResponse } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_PROVIDER)
    private readonly productProvider: IProductProvider,
  ) {}

  async getAllProducts(search?: string, category?: string, limit?: number): Promise<Product[]> {
    let products: Product[];

    if (category) {
      products = await this.productProvider.findByCategory(category);
    } else {
      products = await this.productProvider.findAll();
    }

    if (search && search.trim().length > 0) {
      const q = search.trim().toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    if (limit && limit > 0) {
      products = products.slice(0, limit);
    }

    return products;
  }

  async getFeaturedProducts(limit = 5): Promise<Product[]> {
    const products = await this.productProvider.findAll();
    // Sort descending by rating.rate, secondary sort by rating.count
    const sorted = [...products].sort((a, b) => {
      if (b.rating.rate !== a.rating.rate) {
        return b.rating.rate - a.rating.rate;
      }
      return b.rating.count - a.rating.count;
    });

    return sorted.slice(0, limit);
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productProvider.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }
    const q = query.trim().toLowerCase();
    const products = await this.productProvider.findAll();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }

  async getCategories(): Promise<string[]> {
    return this.productProvider.getCategories();
  }

  async getCategoryProducts(categoryName: string): Promise<CategoryProductsResponse> {
    const products = await this.productProvider.findByCategory(categoryName);
    if (!products || products.length === 0) {
      // Check if category exists
      const categories = await this.productProvider.getCategories();
      const matched = categories.find(
        (c) => c.toLowerCase() === categoryName.toLowerCase(),
      );
      if (!matched) {
        throw new NotFoundException(`Category '${categoryName}' not found`);
      }
    }

    // Top rated items in this category: items with rating >= 4.0, or top 2 highest rated if none >= 4.0
    const sorted = [...products].sort((a, b) => b.rating.rate - a.rating.rate);
    const topRatedThreshold = 4.0;
    let topRated = sorted.filter((p) => p.rating.rate >= topRatedThreshold);

    if (topRated.length === 0 && sorted.length > 0) {
      // If none meet threshold, pick the top 2
      topRated = sorted.slice(0, Math.min(2, sorted.length));
    }

    const topRatedIds = new Set(topRated.map((p) => p.id));
    const additional = sorted.filter((p) => !topRatedIds.has(p.id));

    return {
      category: categoryName,
      total: products.length,
      topRated,
      additional,
    };
  }
}

