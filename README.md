# EMI Store — Mutual Fund Backed EMI Catalog (1Fi SDE-1 Assignment)

Product catalog app where each product has multiple variants, and each variant has multiple EMI plans backed by mutual funds. All catalog data is loaded from PostgreSQL through the REST API — nothing is hardcoded in the UI.

Monorepo: `backend/` (NestJS + TypeORM + PostgreSQL) and `frontend/` (React + Vite + TypeScript + Tailwind CSS).

## Live demo

- **Frontend (Vercel):** https://emi-vault-pink.vercel.app
- **Backend API (Render):** https://emi-vault.onrender.com
- **Products endpoint:** https://emi-vault.onrender.com/api/products

---

## 1. Tech stack

**Frontend**

- React 19.2.8
- Vite 8.2.2
- TypeScript 6.0.2
- Tailwind CSS 4.3.3
- React Router DOM 7.18.3
- Axios 1.20.0

**Backend**

- Node.js 20+
- NestJS 12 (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`)
- `@nestjs/config` 12
- `@nestjs/typeorm` 12
- TypeORM 1.1.1
- `class-validator` + `class-transformer`
- `pg` 8.23 (PostgreSQL driver)

**Database & hosting**

- PostgreSQL (local, or hosted via `DATABASE_URL` — Neon / Render / Supabase)
- Frontend: Vercel
- Backend: Render

This repo does **not** use Prisma, Lucide Icons, or a `schema.prisma` file.

---

## 2. Setup and run

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- PostgreSQL (local) **or** a hosted Postgres URL
- Git

### Clone

```bash
git clone https://github.com/Manjeet2684/emi-vault.git
cd emi-vault
```

### Backend

```bash
cd backend
cp .env.example .env
```

On Windows PowerShell: `copy .env.example .env`

Edit `backend/.env` for local Postgres:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=emi_vault
FRONTEND_ORIGIN=http://localhost:5173,http://localhost:5174
```

Or use a hosted database instead of the `DB_*` fields:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

Create the database if it does not exist:

```sql
CREATE DATABASE emi_vault;
```

```bash
npm install
npm run seed
npm run start:dev
```

`npm run seed` creates/syncs tables with TypeORM and inserts catalog data. The API listens on `http://localhost:3000`.

There is no Prisma migrate/push step.

### Frontend

```bash
cd frontend
cp .env.example .env
```

`frontend/.env`:

```
VITE_API_URL=http://localhost:3000
```

```bash
npm install
npm run dev
```

Vite serves the UI at `http://localhost:5173` (or `5174` if 5173 is busy).

---

## 3. Database schema

TypeORM entities map to three PostgreSQL tables. Relationship: **Product 1 — N ProductVariant 1 — N EMIPlan**.

```
products 1 ──< product_variants 1 ──< emi_plans
```

### `products`

| Column | Type | Notes |
|---|---|---|
| `id` | integer, PK, serial | |
| `slug` | varchar(150) | unique + indexed, used in URLs |
| `name` | varchar(150) | |
| `brand` | varchar(120) | |
| `description` | text | required |
| `createdAt` | timestamptz | set automatically |

There is no `startingPrice` or `updatedAt` column on `products`. Starting price is derived in the list API from the first variant's `price`.

### `product_variants`

| Column | Type | Notes |
|---|---|---|
| `id` | integer, PK, serial | |
| `productId` | integer, FK → `products.id` | indexed, `ON DELETE CASCADE` |
| `variantLabel` | varchar(160) | e.g. `256GB Natural Titanium` |
| `color` | varchar(80) | |
| `storage` | varchar(80) | |
| `mrp` | numeric(12,2) | |
| `price` | numeric(12,2) | selling price |
| `imageUrl` | text | path such as `/images/iphone-natural-titanium.png` |
| `availableStock` | integer | default `0` |

There is no `colorHex` column. The image field in the database and detail API is `imageUrl`, not `image`.

### `emi_plans`

| Column | Type | Notes |
|---|---|---|
| `id` | integer, PK, serial | |
| `variantId` | integer, FK → `product_variants.id` | indexed, `ON DELETE CASCADE` |
| `monthlyAmount` | numeric(12,2) | |
| `tenureMonths` | integer | seed uses 3 / 6 / 12 / 24 / 36 |
| `interestRate` | numeric(5,2) | `0` means zero-interest; seed also uses 8.5 / 12 / 14 |
| `cashbackAmount` | numeric(12,2), nullable | |
| `planLabel` | varchar(160), nullable | |

There is no `monthlyPayment`, `isRecommended`, or `updatedAt` column.

---

## 4. API endpoints and example responses

Base URL locally: `http://localhost:3000`  
Live: `https://emi-vault.onrender.com`

Errors return JSON:

```json
{
  "statusCode": 404,
  "message": "Product not found",
  "timestamp": "2026-09-03T16:26:51.982Z",
  "path": "/api/products/does-not-exist"
}
```

### `GET /api/products`

Lists all products. Starting price and image come from the first variant.

```bash
curl https://emi-vault.onrender.com/api/products
```

```json
[
  {
    "id": 1,
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "startingPrice": 144900,
    "image": "/images/iphone-natural-titanium.png",
    "variantCount": 4
  },
  {
    "id": 2,
    "slug": "samsung-galaxy-s24-ultra",
    "name": "Samsung Galaxy S24 Ultra",
    "brand": "Samsung",
    "startingPrice": 124999,
    "image": "/images/samsung-s24-titanium-gray.png",
    "variantCount": 4
  },
  {
    "id": 3,
    "slug": "oneplus-13",
    "name": "OnePlus 13",
    "brand": "OnePlus",
    "startingPrice": 66999,
    "image": "/images/oneplus-13-midnight-ocean.png",
    "variantCount": 4
  }
]
```

### `GET /api/products/:slug`

Full product: description, every variant, and every EMI plan nested under each variant.

```bash
curl https://emi-vault.onrender.com/api/products/iphone-17-pro
```

```json
{
  "id": 1,
  "slug": "iphone-17-pro",
  "name": "iPhone 17 Pro",
  "brand": "Apple",
  "description": "Titanium design with the A19 Pro chip, ProMotion display, and an advanced triple-camera system built for low-light photography.",
  "createdAt": "2026-09-03T20:43:22.715Z",
  "variants": [
    {
      "id": 1,
      "variantLabel": "256GB Natural Titanium",
      "color": "Natural Titanium",
      "storage": "256GB",
      "mrp": 149900,
      "price": 144900,
      "imageUrl": "/images/iphone-natural-titanium.png",
      "availableStock": 42,
      "emiPlans": [
        {
          "id": 1,
          "monthlyAmount": 48300,
          "tenureMonths": 3,
          "interestRate": 0,
          "cashbackAmount": null,
          "planLabel": "3-month zero interest"
        },
        {
          "id": 2,
          "monthlyAmount": 24150,
          "tenureMonths": 6,
          "interestRate": 0,
          "cashbackAmount": 2174,
          "planLabel": "6-month zero interest + cashback"
        }
      ]
    }
  ]
}
```

The live response includes all 4 variants and 7 EMI plans per variant (truncated above).

### `GET /api/products/:slug/variants/:variantId`

Optional helper: one variant plus its EMI plans.

```bash
curl https://emi-vault.onrender.com/api/products/iphone-17-pro/variants/1
```

```json
{
  "id": 1,
  "variantLabel": "256GB Natural Titanium",
  "color": "Natural Titanium",
  "storage": "256GB",
  "mrp": 149900,
  "price": 144900,
  "imageUrl": "/images/iphone-natural-titanium.png",
  "availableStock": 42,
  "emiPlans": [
    {
      "id": 1,
      "monthlyAmount": 48300,
      "tenureMonths": 3,
      "interestRate": 0,
      "cashbackAmount": null,
      "planLabel": "3-month zero interest"
    }
  ]
}
```

---

## 5. Folder structure

```
emi-vault/
├── README.md
├── backend/
│   ├── .env.example
│   └── src/
│       ├── main.ts
│       ├── seed.ts
│       ├── entities/          # TypeORM: Product, ProductVariant, EMIPlan
│       └── products/          # controller, service, DTOs
└── frontend/
    ├── .env.example
    ├── vercel.json
    ├── public/images/         # chassis photos served as /images/...
    └── src/
        ├── api/
        ├── components/
        └── pages/
```

## Scripts

| Location | Command | Purpose |
|---|---|---|
| `backend/` | `npm run start:dev` | API on port 3000 |
| `backend/` | `npm run seed` | Create tables and insert catalog data |
| `backend/` | `npm run build` | Compile to `dist/` |
| `backend/` | `npm run start:prod` | `node dist/main.js` |
| `frontend/` | `npm run dev` | Vite on port 5173 |
| `frontend/` | `npm run build` | Production build to `frontend/dist/` |

## Deployment notes

- Render start command: `npm run start:prod` (root directory `backend`). Uses `process.env.PORT` and `DATABASE_URL`.
- Vercel root directory: `frontend`. Set `VITE_API_URL=https://emi-vault.onrender.com` at build time.
- After a hosted deploy, seed once with `npm run seed:prod` on Render (or `npm run seed` locally against `DATABASE_URL`).
- Product images live in `frontend/public/images/` and are served by Vercel at `/images/...`.
