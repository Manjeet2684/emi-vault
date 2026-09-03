import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { ProductSlugDto } from './dto/product-slug.dto.js';
import { ProductVariantLookupDto } from './dto/product-variant-lookup.dto.js';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async listProducts() {
    return this.productsService.listProducts();
  }

  @Get(':slug')
  async getProduct(@Param() params: ProductSlugDto) {
    return this.productsService.getProductBySlug(params.slug);
  }

  @Get(':slug/variants/:variantId')
  async getVariant(@Param() params: ProductVariantLookupDto) {
    return this.productsService.getVariantForProductSlug(params.slug, params.variantId);
  }
}

