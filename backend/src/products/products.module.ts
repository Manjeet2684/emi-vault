import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EMIPlan } from '../entities/emi-plan.entity.js';
import { Product } from '../entities/product.entity.js';
import { ProductVariant } from '../entities/product-variant.entity.js';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductVariant, EMIPlan])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

