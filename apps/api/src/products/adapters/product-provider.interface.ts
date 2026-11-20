import { Product } from '../interfaces/product.interface';

export const PRODUCT_PROVIDER = 'PRODUCT_PROVIDER';

export interface IProductProvider {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  findByCategory(category: string): Promise<Product[]>;
  getCategories(): Promise<string[]>;
}
