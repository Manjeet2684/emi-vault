import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity.js';
import { ProductVariant } from '../entities/product-variant.entity.js';

const toNumberOrNull = (v: string | null | undefined): number | null => {
  if (v === null || v === undefined) return null;
  return Number(v);
};

const toNumber = (v: string | undefined): number => {
  if (v === undefined) return 0;
  return Number(v);
};

type EmiPlanDto = {
  id: number;
  monthlyAmount: number;
  tenureMonths: number;
  interestRate: number;
  cashbackAmount: number | null;
  planLabel: string | null;
};

type VariantDto = {
  id: number;
  variantLabel: string;
  color: string;
  storage: string;
  mrp: number;
  price: number;
  imageUrl: string;
  availableStock: number;
  emiPlans: EmiPlanDto[];
};

type ProductListItemDto = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  startingPrice: number;
  image: string | null;
  variantCount: number;
};

type ProductDetailDto = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  description: string;
  createdAt: Date;
  variants: VariantDto[];
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  async listProducts(): Promise<ProductListItemDto[]> {
    const products = await this.productRepo.find({
      relations: { variants: true } as any,
      order: { id: 'ASC' as const },
    });

    return products.map((p) => {
      const variants = [...(p.variants ?? [])].sort((a, b) => a.id - b.id);
      const first = variants[0];

      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        startingPrice: first ? toNumber(first.price) : 0,
        image: first ? first.imageUrl : null,
        variantCount: variants.length,
      };
    });
  }

  async getProductBySlug(slug: string): Promise<ProductDetailDto> {
    const product = await this.productRepo.findOne({
      where: { slug },
      relations: { variants: { emiPlans: true } } as any,
    });

    if (!product) throw new NotFoundException('Product not found');

    const variants = [...(product.variants ?? [])]
      .sort((a, b) => a.id - b.id)
      .map((v) => ({
        id: v.id,
        variantLabel: v.variantLabel,
        color: v.color,
        storage: v.storage,
        mrp: toNumber(v.mrp),
        price: toNumber(v.price),
        imageUrl: v.imageUrl,
        availableStock: v.availableStock,
        emiPlans: [...(v.emiPlans ?? [])]
          .sort((a, b) => a.tenureMonths - b.tenureMonths)
          .map((plan) => ({
            id: plan.id,
            monthlyAmount: toNumber(plan.monthlyAmount),
            tenureMonths: plan.tenureMonths,
            interestRate: toNumber(plan.interestRate),
            cashbackAmount: toNumberOrNull(plan.cashbackAmount),
            planLabel: plan.planLabel,
          })),
      }));

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      description: product.description,
      createdAt: product.createdAt,
      variants,
    };
  }

  async getVariantForProductSlug(
    slug: string,
    variantId: number,
  ): Promise<VariantDto> {
    const variant = await this.variantRepo
      .createQueryBuilder('variant')
      .innerJoinAndSelect('variant.product', 'product')
      .leftJoinAndSelect('variant.emiPlans', 'emiPlans')
      .where('product.slug = :slug', { slug })
      .andWhere('variant.id = :variantId', { variantId })
      .getOne();

    if (!variant) throw new NotFoundException('Variant not found');

    return {
      id: variant.id,
      variantLabel: variant.variantLabel,
      color: variant.color,
      storage: variant.storage,
      mrp: toNumber(variant.mrp),
      price: toNumber(variant.price),
      imageUrl: variant.imageUrl,
      availableStock: variant.availableStock,
      emiPlans: [...(variant.emiPlans ?? [])]
        .sort((a, b) => a.tenureMonths - b.tenureMonths)
        .map((plan) => ({
          id: plan.id,
          monthlyAmount: toNumber(plan.monthlyAmount),
          tenureMonths: plan.tenureMonths,
          interestRate: toNumber(plan.interestRate),
          cashbackAmount: toNumberOrNull(plan.cashbackAmount),
          planLabel: plan.planLabel,
        })),
    };
  }
}

