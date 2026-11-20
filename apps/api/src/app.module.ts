import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { EnquiriesModule } from './enquiries/enquiries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    ProductsModule,
    CategoriesModule,
    EnquiriesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

