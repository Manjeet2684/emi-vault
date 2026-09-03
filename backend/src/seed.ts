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

function money(value: number): string {
  return value.toFixed(2);
}

function emiPlansFor(price: number): SeedEmiPlan[] {
  const cashback = (share: number) => money(Math.round(price * share));
  const interestEmi = (annualRate: number, months: number) => {
    const monthlyRate = annualRate / 100 / 12;
    const amount =
      (price * monthlyRate * (1 + monthlyRate) ** months) /
      ((1 + monthlyRate) ** months - 1);
    return money(amount);
  };

  return [
    {
      monthlyAmount: money(price / 3),
      tenureMonths: 3,
      interestRate: '0.00',
      planLabel: '3-month zero interest',
    },
    {
      monthlyAmount: money(price / 6),
      tenureMonths: 6,
      interestRate: '0.00',
      cashbackAmount: cashback(0.015),
      planLabel: '6-month zero interest + cashback',
    },
    {
      monthlyAmount: interestEmi(8.5, 12),
      tenureMonths: 12,
      interestRate: '8.50',
      planLabel: '12-month standard EMI',
    },
    {
      monthlyAmount: money(price / 12),
      tenureMonths: 12,
      interestRate: '0.00',
      cashbackAmount: cashback(0.01),
      planLabel: '12-month zero interest promo',
    },
    {
      monthlyAmount: interestEmi(12, 24),
      tenureMonths: 24,
      interestRate: '12.00',
      planLabel: '24-month balanced EMI',
    },
    {
      monthlyAmount: interestEmi(14, 36),
      tenureMonths: 36,
      interestRate: '14.00',
      planLabel: '36-month extended EMI',
    },
    {
      monthlyAmount: money(price / 36),
      tenureMonths: 36,
      interestRate: '0.00',
      cashbackAmount: cashback(0.02),
      planLabel: '36-month mutual fund backed plan',
    },
  ];
}

function variant(
  storage: string,
  color: string,
  mrp: number,
  price: number,
  imageUrl: string,
  stock: number,
): SeedVariant {
  return {
    variantLabel: `${storage} ${color}`,
    color,
    storage,
    mrp: money(mrp),
    price: money(price),
    imageUrl,
    availableStock: stock,
    emiPlans: emiPlansFor(price),
  };
}

const IPHONE_NATURAL = '/images/iphone-natural-titanium.png';
const IPHONE_BLUE = '/images/iphone-blue-titanium.png';
const SAMSUNG_GRAY = '/images/samsung-s24-titanium-gray.png';
const SAMSUNG_BLACK = '/images/samsung-s24-titanium-black.png';
const ONEPLUS_MIDNIGHT = '/images/oneplus-13-midnight-ocean.png';
const ONEPLUS_ARCTIC = '/images/oneplus-13-arctic-dawn.png';

const seedProducts: SeedProduct[] = [
  {
    slug: 'iphone-17-pro',
    name: 'iPhone 17 Pro',
    brand: 'Apple',
    description:
      'Titanium design with the A19 Pro chip, ProMotion display, and an advanced triple-camera system built for low-light photography.',
    variants: [
      variant('256GB', 'Natural Titanium', 149900, 144900, IPHONE_NATURAL, 42),
      variant('256GB', 'Blue Titanium', 149900, 144900, IPHONE_BLUE, 38),
      variant('512GB', 'Natural Titanium', 169900, 164900, IPHONE_NATURAL, 31),
      variant('512GB', 'Blue Titanium', 169900, 164900, IPHONE_BLUE, 28),
    ],
  },
  {
    slug: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    description:
      'Flagship Galaxy experience with an S Pen, 200MP camera, and Galaxy AI features for productivity on the go.',
    variants: [
      variant('256GB', 'Titanium Gray', 129999, 124999, SAMSUNG_GRAY, 55),
      variant('256GB', 'Titanium Black', 129999, 124999, SAMSUNG_BLACK, 49),
      variant('512GB', 'Titanium Gray', 144999, 139999, SAMSUNG_GRAY, 36),
      variant('512GB', 'Titanium Black', 144999, 139999, SAMSUNG_BLACK, 33),
    ],
  },
  {
    slug: 'oneplus-13',
    name: 'OnePlus 13',
    brand: 'OnePlus',
    description:
      'Performance-first flagship with Snapdragon 8 Elite, 120Hz AMOLED display, and Hasselblad-tuned cameras.',
    variants: [
      variant('256GB', 'Midnight Ocean', 69999, 66999, ONEPLUS_MIDNIGHT, 64),
      variant('256GB', 'Arctic Dawn', 69999, 66999, ONEPLUS_ARCTIC, 58),
      variant('512GB', 'Midnight Ocean', 79999, 76999, ONEPLUS_MIDNIGHT, 51),
      variant('512GB', 'Arctic Dawn', 79999, 76999, ONEPLUS_ARCTIC, 47),
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
      const row = variantRepo.create({
        productId: product.id,
        variantLabel: variantData.variantLabel,
        color: variantData.color,
        storage: variantData.storage,
        mrp: variantData.mrp,
        price: variantData.price,
        imageUrl: variantData.imageUrl,
        availableStock: variantData.availableStock,
      });
      await variantRepo.save(row);

      for (const planData of variantData.emiPlans) {
        const emiPlan = emiPlanRepo.create({
          variantId: row.id,
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
    GROUP BY p.slug, p.name, pv."variantLabel", pv.storage, pv.color
    ORDER BY p.slug, pv.storage, pv.color
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
