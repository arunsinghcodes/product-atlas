import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryProductsResponse } from '../products/interfaces/product.interface';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAll(): Promise<string[]> {
    return this.categoriesService.getAllCategories();
  }

  @Get(':category')
  async getCategoryProducts(
    @Param('category') category: string,
  ): Promise<CategoryProductsResponse> {
    return this.categoriesService.getCategoryDetails(category);
  }
}
