import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { Product } from './interfaces/product.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('featured')
  async getFeatured(@Query('limit') limit?: string): Promise<Product[]> {
    const parsedLimit = limit ? parseInt(limit, 10) : 5;
    return this.productsService.getFeaturedProducts(parsedLimit);
  }

  @Get('search')
  async search(@Query('q') query: string): Promise<Product[]> {
    return this.productsService.searchProducts(query || '');
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.getProductById(id);
  }

  @Get()
  async getAll(@Query() query: ProductQueryDto): Promise<Product[]> {
    return this.productsService.getAllProducts(query.search, query.category, query.limit);
  }
}
