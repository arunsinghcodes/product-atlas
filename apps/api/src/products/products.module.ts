import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PRODUCT_PROVIDER } from './adapters/product-provider.interface';
import { MockProductAdapter } from './adapters/mock-product.adapter';
import { FakeStoreProductAdapter } from './adapters/fakestore-product.adapter';

@Module({
  imports: [ConfigModule],
  controllers: [ProductsController],
  providers: [
    MockProductAdapter,
    {
      provide: PRODUCT_PROVIDER,
      useFactory: (configService: ConfigService, mockAdapter: MockProductAdapter) => {
        const source = configService.get<string>('PRODUCT_DATA_SOURCE') || 'fakestore';
        if (source.toLowerCase() === 'mock') {
          return mockAdapter;
        }
        return new FakeStoreProductAdapter(configService, mockAdapter);
      },
      inject: [ConfigService, MockProductAdapter],
    },
    ProductsService,
  ],
  exports: [ProductsService, PRODUCT_PROVIDER],
})
export class ProductsModule {}

