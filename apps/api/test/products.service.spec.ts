import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../src/products/products.service';
import { PRODUCT_PROVIDER } from '../src/products/adapters/product-provider.interface';
import { MockProductAdapter } from '../src/products/adapters/mock-product.adapter';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockAdapter: MockProductAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        MockProductAdapter,
        {
          provide: PRODUCT_PROVIDER,
          useExisting: MockProductAdapter,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    mockAdapter = module.get<MockProductAdapter>(MockProductAdapter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFeaturedProducts (AC-1)', () => {
    it('should return exactly 5 top rated products sorted descending by rating', async () => {
      const featured = await service.getFeaturedProducts(5);
      expect(featured).toHaveLength(5);
      // Ensure descending order
      for (let i = 0; i < featured.length - 1; i++) {
        expect(featured[i].rating.rate).toBeGreaterThanOrEqual(featured[i + 1].rating.rate);
      }
    });
  });

  describe('getCategoryProducts (AC-2)', () => {
    it('should separate category products into topRated and additional', async () => {
      const result = await service.getCategoryProducts("men's clothing");
      expect(result.category).toBe("men's clothing");
      expect(result.total).toBeGreaterThan(0);
      expect(result.topRated.length).toBeGreaterThan(0);
      expect(result.additional.length).toBeGreaterThan(0);

      // Verify no duplicate IDs between topRated and additional
      const topRatedIds = result.topRated.map((p) => p.id);
      for (const add of result.additional) {
        expect(topRatedIds).not.toContain(add.id);
      }
    });

    it('should throw NotFoundException for invalid category', async () => {
      await expect(service.getCategoryProducts('non-existent-category')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('searchProducts (AC-3)', () => {
    it('should filter products matching keyword in title or description', async () => {
      const results = await service.searchProducts('backpack');
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => {
        const matches =
          p.title.toLowerCase().includes('backpack') ||
          p.description.toLowerCase().includes('backpack');
        expect(matches).toBe(true);
      });
    });

    it('should return empty array for empty search query', async () => {
      const results = await service.searchProducts('');
      expect(results).toEqual([]);
    });
  });

  describe('getProductById (AC-4)', () => {
    it('should return product details for valid ID', async () => {
      const product = await service.getProductById(1);
      expect(product).toBeDefined();
      expect(product.id).toBe(1);
      expect(product.title).toBeDefined();
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      await expect(service.getProductById(99999)).rejects.toThrow(NotFoundException);
    });
  });
});
