import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'Product Atlas API',
      description: 'Product Discovery Platform (ANSR AI-Native Challenge)',
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        featured: '/api/products/featured?limit=5',
        products: '/api/products',
        categories: '/api/categories',
        search: '/api/products/search?q={term}',
        enquiries: '/api/enquiries (POST)',
      },
    };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', uptime: process.uptime() };
  }
}
