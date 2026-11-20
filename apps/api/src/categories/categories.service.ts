import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CategoryProductsResponse } from '../products/interfaces/product.interface';

@Injectable()
export class CategoriesService {
  constructor(private readonly productsService: ProductsService) {}

  async getAllCategories(): Promise<string[]> {
    return this.productsService.getCategories();
  }

  async getCategoryDetails(categoryName: string): Promise<CategoryProductsResponse> {
    return this.productsService.getCategoryProducts(categoryName);
  }
}
