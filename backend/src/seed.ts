import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { getPostgresOptions } from './database/postgres.options.js';
import { EMIPlan } from './entities/emi-plan.entity.js';
import { Product } from './entities/product.entity.js';
import { ProductVariant } from './entities/product-variant.entity.js';

config();

type SeedEmiPlan = {
  monthlyAmount: string;
  tenureMonths: number;
  interestRate: string;
  cashbackAmount?: string | null;
  planLabel?: string | null;
};

type SeedVariant = {
  variantLabel: string;
  color: string;
  storage: string;
  mrp: string;
  price: string;
  imageUrl: string;
  availableStock: number;
  emiPlans: SeedEmiPlan[];
};

type SeedProduct = {
  slug: string;
  name: string;
  brand: string;
  description: string;
  variants: SeedVariant[];
};

const seedProducts: SeedProduct[] = [
  {
    slug: 'iphone-17-pro',
    name: 'iPhone 17 Pro',
    brand: 'Apple',
    description:
      'Titanium design with the A19 Pro chip, ProMotion display, and an advanced triple-camera system built for low-light photography.',
    variants: [
      {
        variantLabel: '256GB Natural Titanium',
        color: 'Natural Titanium',
        storage: '256GB',
        mrp: '149900.00',
        price: '144900.00',
        imageUrl:
          'https://images.unsplash.com/photo-1695048133142-1c204c0c0a0e?w=800&auto=format&fit=crop',
        availableStock: 42,
        emiPlans: [
          {
            monthlyAmount: '48300.00',
            tenureMonths: 3,
            interestRate: '0.00',
            planLabel: '3-month zero interest',
          },
          {
            monthlyAmount: '24150.00',
            tenureMonths: 6,
            interestRate: '0.00',
            cashbackAmount: '2500.00',
            planLabel: '6-month zero interest + cashback',
          },
          {
            monthlyAmount: '12890.00',
            tenureMonths: 12,
            interestRate: '8.50',
            planLabel: '12-month standard EMI',
          },
          {
            monthlyAmount: '12075.00',
            tenureMonths: 12,
            interestRate: '0.00',
            cashbackAmount: '1500.00',
            planLabel: '12-month zero interest promo',
          },
          {
            monthlyAmount: '6890.00',
            tenureMonths: 24,
            interestRate: '12.00',
            planLabel: '24-month balanced EMI',
          },
          {
            monthlyAmount: '5120.00',
            tenureMonths: 36,
            interestRate: '14.00',
            planLabel: '36-month extended EMI',
          },
          {
            monthlyAmount: '4025.00',
            tenureMonths: 36,
            interestRate: '0.00',
            cashbackAmount: '3000.00',
            planLabel: '36-month mutual fund backed plan',
          },
        ],
      },
      {
        variantLabel: '512GB Blue Titanium',
        color: 'Blue Titanium',
        storage: '512GB',
        mrp: '169900.00',
        price: '164900.00',
        imageUrl:
          'https://images.unsplash.com/photo-1720360207555-c4c5c4c4c4c4?w=800&auto=format&fit=crop',
        availableStock: 28,
        emiPlans: [
          {
            monthlyAmount: '54967.00',
            tenureMonths: 3,
            interestRate: '0.00',
            planLabel: '3-month zero interest',
          },
          {
            monthlyAmount: '27484.00',
            tenureMonths: 6,
            interestRate: '0.00',
            cashbackAmount: '3000.00',
            planLabel: '6-month zero interest + cashback',
          },
          {
            monthlyAmount: '14670.00',
            tenureMonths: 12,
            interestRate: '8.50',
            planLabel: '12-month standard EMI',
          },
          {
            monthlyAmount: '13742.00',
            tenureMonths: 12,
            interestRate: '0.00',
            cashbackAmount: '2000.00',
            planLabel: '12-month zero interest promo',
          },
          {
            monthlyAmount: '7850.00',
            tenureMonths: 24,
            interestRate: '12.00',
            planLabel: '24-month balanced EMI',
          },
          {
            monthlyAmount: '5830.00',
            tenureMonths: 36,
            interestRate: '14.00',
            planLabel: '36-month extended EMI',
          },
          {
            monthlyAmount: '4581.00',
            tenureMonths: 36,
            interestRate: '0.00',
            cashbackAmount: '3500.00',
            planLabel: '36-month mutual fund backed plan',
          },
        ],
      },
    ],
  },
  {
    slug: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    description:
      'Flagship Galaxy experience with an S Pen, 200MP camera, and Galaxy AI features for productivity on the go.',
    variants: [
      {
        variantLabel: '256GB Titanium Gray',
        color: 'Titanium Gray',
        storage: '256GB',
        mrp: '129999.00',
        price: '124999.00',
        imageUrl:
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop',
        availableStock: 55,
        emiPlans: [
          {
            monthlyAmount: '41667.00',
            tenureMonths: 3,
            interestRate: '0.00',
            planLabel: '3-month zero interest',
          },
          {
            monthlyAmount: '20833.00',
            tenureMonths: 6,
            interestRate: '0.00',
            cashbackAmount: '2000.00',
            planLabel: '6-month zero interest + cashback',
          },
          {
            monthlyAmount: '11120.00',
            tenureMonths: 12,
            interestRate: '9.00',
            planLabel: '12-month standard EMI',
          },
          {
            monthlyAmount: '10417.00',
            tenureMonths: 12,
            interestRate: '0.00',
            cashbackAmount: '1200.00',
            planLabel: '12-month zero interest promo',
          },
          {
            monthlyAmount: '5950.00',
            tenureMonths: 24,
            interestRate: '12.50',
            planLabel: '24-month balanced EMI',
          },
          {
            monthlyAmount: '4410.00',
            tenureMonths: 36,
            interestRate: '14.50',
            planLabel: '36-month extended EMI',
          },
        ],
      },
      {
        variantLabel: '512GB Titanium Black',
        color: 'Titanium Black',
        storage: '512GB',
        mrp: '144999.00',
        price: '139999.00',
        imageUrl:
          'https://images.unsplash.com/photo-1610945265064-0e34e55182fa?w=800&auto=format&fit=crop',
        availableStock: 33,
        emiPlans: [
          {
            monthlyAmount: '46666.00',
            tenureMonths: 3,
            interestRate: '0.00',
            planLabel: '3-month zero interest',
          },
          {
            monthlyAmount: '23333.00',
            tenureMonths: 6,
            interestRate: '0.00',
            cashbackAmount: '2500.00',
            planLabel: '6-month zero interest + cashback',
          },
          {
            monthlyAmount: '12450.00',
            tenureMonths: 12,
            interestRate: '9.00',
            planLabel: '12-month standard EMI',
          },
          {
            monthlyAmount: '11667.00',
            tenureMonths: 12,
            interestRate: '0.00',
            cashbackAmount: '1800.00',
            planLabel: '12-month zero interest promo',
          },
          {
            monthlyAmount: '6660.00',
            tenureMonths: 24,
            interestRate: '12.50',
            planLabel: '24-month balanced EMI',
          },
          {
            monthlyAmount: '4940.00',
            tenureMonths: 36,
            interestRate: '14.50',
            planLabel: '36-month extended EMI',
          },
          {
            monthlyAmount: '3889.00',
            tenureMonths: 36,
            interestRate: '0.00',
            cashbackAmount: '2800.00',
            planLabel: '36-month mutual fund backed plan',
          },
        ],
      },
    ],
  },
  {
    slug: 'oneplus-13',
    name: 'OnePlus 13',
    brand: 'OnePlus',
    description:
      'Performance-first flagship with Snapdragon 8 Elite, 120Hz AMOLED display, and Hasselblad-tuned cameras.',
    variants: [
      {
        variantLabel: '256GB Midnight Ocean',
        color: 'Midnight Ocean',
        storage: '256GB',
        mrp: '69999.00',
        price: '66999.00',
        imageUrl:
          'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop',
        availableStock: 64,
        emiPlans: [
          {
            monthlyAmount: '22333.00',
            tenureMonths: 3,
            interestRate: '0.00',
            planLabel: '3-month zero interest',
          },
          {
            monthlyAmount: '11167.00',
            tenureMonths: 6,
            interestRate: '0.00',
            cashbackAmount: '1000.00',
            planLabel: '6-month zero interest + cashback',
          },
          {
            monthlyAmount: '5970.00',
            tenureMonths: 12,
            interestRate: '8.00',
            planLabel: '12-month standard EMI',
          },
          {
            monthlyAmount: '5583.00',
            tenureMonths: 12,
            interestRate: '0.00',
            cashbackAmount: '800.00',
            planLabel: '12-month zero interest promo',
          },
          {
            monthlyAmount: '3190.00',
            tenureMonths: 24,
            interestRate: '11.50',
            planLabel: '24-month balanced EMI',
          },
          {
            monthlyAmount: '2365.00',
            tenureMonths: 36,
            interestRate: '13.50',
            planLabel: '36-month extended EMI',
          },
        ],
      },
      {
        variantLabel: '512GB Arctic Dawn',
        color: 'Arctic Dawn',
        storage: '512GB',
        mrp: '79999.00',
        price: '76999.00',
        imageUrl:
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop',
        availableStock: 47,
        emiPlans: [
          {
            monthlyAmount: '25666.00',
            tenureMonths: 3,
            interestRate: '0.00',
            planLabel: '3-month zero interest',
          },
          {
            monthlyAmount: '12833.00',
            tenureMonths: 6,
            interestRate: '0.00',
            cashbackAmount: '1200.00',
            planLabel: '6-month zero interest + cashback',
          },
          {
            monthlyAmount: '6860.00',
            tenureMonths: 12,
            interestRate: '8.00',
            planLabel: '12-month standard EMI',
          },
          {
            monthlyAmount: '6417.00',
            tenureMonths: 12,
            interestRate: '0.00',
            cashbackAmount: '1000.00',
            planLabel: '12-month zero interest promo',
          },
          {
            monthlyAmount: '3665.00',
            tenureMonths: 24,
            interestRate: '11.50',
            planLabel: '24-month balanced EMI',
          },
          {
            monthlyAmount: '2715.00',
            tenureMonths: 36,
            interestRate: '13.50',
            planLabel: '36-month extended EMI',
          },
          {
            monthlyAmount: '2139.00',
            tenureMonths: 36,
            interestRate: '0.00',
            cashbackAmount: '1500.00',
            planLabel: '36-month mutual fund backed plan',
          },
        ],
      },
    ],
  },
];

async function seed() {
  const dataSource = new DataSource(getPostgresOptions(process.env, true));

  await dataSource.initialize();
  console.log('Connected to PostgreSQL');

  await dataSource.query(
    'TRUNCATE TABLE emi_plans, product_variants, products RESTART IDENTITY CASCADE',
  );
  console.log('Cleared existing seed data');

  const productRepo = dataSource.getRepository(Product);
  const variantRepo = dataSource.getRepository(ProductVariant);
  const emiPlanRepo = dataSource.getRepository(EMIPlan);

  for (const productData of seedProducts) {
    const product = productRepo.create({
      slug: productData.slug,
      name: productData.name,
      brand: productData.brand,
      description: productData.description,
    });
    await productRepo.save(product);

    for (const variantData of productData.variants) {
      const variant = variantRepo.create({
        productId: product.id,
        variantLabel: variantData.variantLabel,
        color: variantData.color,
        storage: variantData.storage,
        mrp: variantData.mrp,
        price: variantData.price,
        imageUrl: variantData.imageUrl,
        availableStock: variantData.availableStock,
      });
      await variantRepo.save(variant);

      for (const planData of variantData.emiPlans) {
        const emiPlan = emiPlanRepo.create({
          variantId: variant.id,
          monthlyAmount: planData.monthlyAmount,
          tenureMonths: planData.tenureMonths,
          interestRate: planData.interestRate,
          cashbackAmount: planData.cashbackAmount ?? null,
          planLabel: planData.planLabel ?? null,
        });
        await emiPlanRepo.save(emiPlan);
      }
    }
  }

  const summary = await dataSource.query<{
    products: string;
    variants: string;
    emi_plans: string;
  }>(`
    SELECT
      (SELECT COUNT(*)::text FROM products) AS products,
      (SELECT COUNT(*)::text FROM product_variants) AS variants,
      (SELECT COUNT(*)::text FROM emi_plans) AS emi_plans
  `);

  console.log('\nSeed summary:');
  console.table(summary);

  const sample = await dataSource.query(`
    SELECT
      p.slug,
      p.name,
      pv."variantLabel",
      COUNT(ep.id)::int AS emi_plan_count
    FROM products p
    JOIN product_variants pv ON pv."productId" = p.id
    LEFT JOIN emi_plans ep ON ep."variantId" = pv.id
    GROUP BY p.slug, p.name, pv."variantLabel"
    ORDER BY p.slug, pv."variantLabel"
  `);

  console.log('\nProducts with variant and EMI plan counts:');
  console.table(sample);

  await dataSource.destroy();
  console.log('\nSeed completed successfully');
}

seed().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
