import type { DataSourceOptions } from 'typeorm';
import { EMIPlan } from '../entities/emi-plan.entity.js';
import { Product } from '../entities/product.entity.js';
import { ProductVariant } from '../entities/product-variant.entity.js';

const entities = [Product, ProductVariant, EMIPlan];

function sslOptions(env: NodeJS.ProcessEnv) {
  if (env.DB_SSL === 'false') return false;
  if (env.DB_SSL === 'true' || Boolean(env.DATABASE_URL)) {
    return { rejectUnauthorized: false };
  }
  return false;
}

export function getPostgresOptions(
  env: NodeJS.ProcessEnv,
  synchronize: boolean,
): DataSourceOptions {
  const ssl = sslOptions(env);
  const url = env.DATABASE_URL;

  if (url) {
    return {
      type: 'postgres',
      url,
      entities,
      synchronize,
      ssl,
    };
  }

  return {
    type: 'postgres',
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? 5432),
    username: env.DB_USER ?? 'postgres',
    password: env.DB_PASSWORD ?? 'postgres',
    database: env.DB_NAME ?? 'emi_vault',
    entities,
    synchronize,
    ssl,
  };
}
