# EMI Store

Product catalog app where each product has multiple variants, and each variant has multiple EMI plans backed by mutual funds.

Monorepo layout:

- `backend/` — NestJS API + TypeORM + PostgreSQL
- `frontend/` — React (Vite) + TypeScript + Tailwind CSS

## Tech stack

**Backend**

- Node.js 20+
- NestJS 12.0.1 (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`)
- `@nestjs/config` 12.0.0
- `@nestjs/typeorm` 12.0.1
- TypeORM 1.1.1
- PostgreSQL driver `pg` 8.23.0
- `class-validator` 0.15.1 and `class-transformer` 0.5.1
- TypeScript 6.0.2

**Frontend**

- React 19.2.8
- Vite 8.2.2
- TypeScript 6.0.2
- Tailwind CSS 4.3.3 (`@tailwindcss/vite`)
- React Router DOM 7.18.3
- Axios 1.20.0

**Database**

- PostgreSQL 14+ (local instance)

## Setup & run

These steps assume a reviewer with a fresh clone and a local PostgreSQL server.

### 1. Prerequisites

- Node.js 20 or newer (`node -v`)
- npm 10 or newer (`npm -v`)
- PostgreSQL running on `localhost:5432` (or update env vars below)
- Git

### 2. Clone the repository

```bash
git clone <repo-url> emi-vault
cd emi-vault
```

### 3. Create the database

In `psql` (or any Postgres client):

```sql
CREATE DATABASE emi_vault;
```

### 4. Backend env vars

```bash
cd backend
copy .env.example .env
```

On macOS/Linux use `cp .env.example .env`.

Edit `backend/.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=emi_vault
```

Optional:

```
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
```

For a hosted database (Render Postgres, Neon, or Supabase), you can set `DATABASE_URL` instead of the individual `DB_*` fields:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

### 5. Install backend dependencies, create tables, and seed

The seed script uses TypeORM `synchronize: true` to create tables, then inserts catalog data. Run this **before** starting the API.

```bash
cd backend
npm install
npm run seed
```

Expected seed result: 3 products, 6 variants, 40 EMI plans.

Re-running `npm run seed` truncates existing catalog tables and inserts a fresh set.

### 6. Start the backend

```bash
cd backend
npm run start:dev
```

API base URL: `http://localhost:3000`

Quick check:

```bash
curl http://localhost:3000/api/products
```

### 7. Frontend env vars

```bash
cd frontend
copy .env.example .env
```

On macOS/Linux use `cp .env.example .env`.

`frontend/.env`:

```
VITE_API_URL=http://localhost:3000
```

### 8. Install frontend dependencies and start the UI

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

The listing page loads products from `GET /api/products`. Product detail pages use `/products/:slug` (for example `/products/iphone-17-pro`).

## Schema

Relationship: **Product 1 — N ProductVariant 1 — N EMIPlan**.

```
products
  1
  |
  N
product_variants
  1
  |
  N
emi_plans
```

### `products`

| Column | Type | Notes |
|---|---|---|
| `id` | integer, PK, serial | |
| `slug` | varchar(150) | unique + indexed (`IDX_PRODUCTS_SLUG`), used in URLs |
| `name` | varchar(150) | |
| `brand` | varchar(120) | |
| `description` | text | |
| `createdAt` | timestamptz | set automatically |

### `product_variants`

| Column | Type | Notes |
|---|---|---|
| `id` | integer, PK, serial | |
| `productId` | integer, FK → `products.id` | indexed (`IDX_PRODUCT_VARIANTS_PRODUCT_ID`), `ON DELETE CASCADE` |
| `variantLabel` | varchar(160) | e.g. `256GB Natural Titanium` |
| `color` | varchar(80) | |
| `storage` | varchar(80) | |
| `mrp` | numeric(12,2) | |
| `price` | numeric(12,2) | selling price |
| `imageUrl` | text | |
| `availableStock` | integer | default `0` |

### `emi_plans`

| Column | Type | Notes |
|---|---|---|
| `id` | integer, PK, serial | |
| `variantId` | integer, FK → `product_variants.id` | indexed (`IDX_EMI_PLANS_VARIANT_ID`), `ON DELETE CASCADE` |
| `monthlyAmount` | numeric(12,2) | |
| `tenureMonths` | integer | 3 / 6 / 12 / 24 / 36 |
| `interestRate` | numeric(5,2) | `0` means zero-interest |
| `cashbackAmount` | numeric(12,2), nullable | |
| `planLabel` | varchar(160), nullable | optional display text |

## API endpoints

Base URL in local development: `http://localhost:3000`

Errors return JSON:

```json
{
  "statusCode": 404,
  "message": "Product not found",
  "timestamp": "2026-09-03T16:26:51.982Z",
  "path": "/api/products/does-not-exist"
}
```

Typical statuses: `400` for invalid input, `404` for missing product/variant.

### `GET /api/products`

Lists all products with nested variant summary fields used by the grid: id, slug, name, brand, starting price (first variant price), image, variant count.

**Request**

```bash
curl http://localhost:3000/api/products
```

**Response**

```json
[
  {
    "id": 1,
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "startingPrice": 144900,
    "image": "https://images.unsplash.com/photo-1695048133142-1c204c0c0a0e?w=800&auto=format&fit=crop",
    "variantCount": 2
  },
  {
    "id": 2,
    "slug": "samsung-galaxy-s24-ultra",
    "name": "Samsung Galaxy S24 Ultra",
    "brand": "Samsung",
    "startingPrice": 124999,
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop",
    "variantCount": 2
  },
  {
    "id": 3,
    "slug": "oneplus-13",
    "name": "OnePlus 13",
    "brand": "OnePlus",
    "startingPrice": 66999,
    "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop",
    "variantCount": 2
  }
]
```

### `GET /api/products/:slug`

Full product detail: product fields, all variants, and all EMI plans per variant.

**Request**

```bash
curl http://localhost:3000/api/products/iphone-17-pro
```

**Response**

```json
{
  "id": 1,
  "slug": "iphone-17-pro",
  "name": "iPhone 17 Pro",
  "brand": "Apple",
  "description": "Titanium design with the A19 Pro chip, ProMotion display, and an advanced triple-camera system built for low-light photography.",
  "createdAt": "2026-09-03T16:15:33.723Z",
  "variants": [
    {
      "id": 1,
      "variantLabel": "256GB Natural Titanium",
      "color": "Natural Titanium",
      "storage": "256GB",
      "mrp": 149900,
      "price": 144900,
      "imageUrl": "https://images.unsplash.com/photo-1695048133142-1c204c0c0a0e?w=800&auto=format&fit=crop",
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
          "cashbackAmount": 2500,
          "planLabel": "6-month zero interest + cashback"
        }
      ]
    }
  ]
}
```

The live response includes every variant and every EMI plan (truncated above).

**Not found**

```bash
curl http://localhost:3000/api/products/does-not-exist
```

```json
{
  "statusCode": 404,
  "message": "Product not found",
  "timestamp": "2026-09-03T16:26:51.982Z",
  "path": "/api/products/does-not-exist"
}
```

**Bad slug**

```bash
curl http://localhost:3000/api/products/iphone_17
```

```json
{
  "statusCode": 400,
  "message": "slug must be a valid URL slug",
  "timestamp": "2026-09-03T16:25:40.438Z",
  "path": "/api/products/iphone_17"
}
```

### `GET /api/products/:slug/variants/:variantId`

Single variant plus its EMI plans.

**Request**

```bash
curl http://localhost:3000/api/products/iphone-17-pro/variants/1
```

**Response**

```json
{
  "id": 1,
  "variantLabel": "256GB Natural Titanium",
  "color": "Natural Titanium",
  "storage": "256GB",
  "mrp": 149900,
  "price": 144900,
  "imageUrl": "https://images.unsplash.com/photo-1695048133142-1c204c0c0a0e?w=800&auto=format&fit=crop",
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
      "cashbackAmount": 2500,
      "planLabel": "6-month zero interest + cashback"
    }
  ]
}
```

**Bad variant id**

```bash
curl http://localhost:3000/api/products/iphone-17-pro/variants/abc
```

```json
{
  "statusCode": 400,
  "message": "variantId must not be less than 1,variantId must be an integer number",
  "timestamp": "2026-09-03T16:25:40.210Z",
  "path": "/api/products/iphone-17-pro/variants/abc"
}
```

## Folder structure

```
emi-vault/
├── README.md
├── .gitignore
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── main.ts                 # CORS, validation pipe, exception filter
│       ├── app.module.ts           # Config + TypeORM + ProductsModule
│       ├── seed.ts                 # catalog seed (creates tables + data)
│       ├── common/filters/         # JSON HTTP exception filter
│       ├── entities/               # Product, ProductVariant, EMIPlan
│       └── products/               # module, controller, service, DTOs
└── frontend/
    ├── .env.example
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── App.tsx                 # routes: / and /products/:slug
        ├── api/                    # axios client + product API calls
        ├── components/             # ProductCard, EMI cards, modal, skeletons
        ├── hooks/                  # document.title helper
        ├── lib/                    # formatting + error helpers
        ├── pages/                  # listing + detail pages
        ├── types/                  # shared TypeScript types
        └── public/images/          # variant chassis photos (served as /images/...)
```

## Scripts

**Backend** (`backend/`)

| Command | Purpose |
|---|---|
| `npm run start:dev` | Watch mode API on port 3000 |
| `npm run seed` | Create/sync tables and insert catalog data |
| `npm run build` | Compile NestJS to `dist/` |
| `npm run start:prod` | Run compiled `dist/main.js` |
| `npm run seed:prod` | Seed using the compiled `dist/seed.js` |

**Root**

| Command | Purpose |
|---|---|
| `npm run build` | Production build of backend then frontend |
| `npm run build:backend` | `backend` production build |
| `npm run build:frontend` | `frontend` production build |

**Frontend** (`frontend/`)

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server on port 5173 |
| `npm run build` | Production build to `frontend/dist/` |
| `npm run preview` | Preview the production build |

## Deployment

The backend is prepared for **Render**. The frontend is prepared for **Vercel**. You must complete the dashboard steps below yourself.

### Production builds (local check)

```bash
cd backend
npm run build
npm run start:prod
```

```bash
cd frontend
npm run build
npm run preview
```

Or from the repo root (after installing deps in both folders):

```bash
npm run build
```

- Backend output: `backend/dist/` — start command `npm run start:prod` (`node dist/main.js`)
- Frontend output: `frontend/dist/` — Vite static files for Vercel
- Frontend API base URL is baked in at **build time** from `VITE_API_URL`

### Backend on Render — exact dashboard steps

1. Push this repo to GitHub (or GitLab / Bitbucket).
2. Open [https://dashboard.render.com](https://dashboard.render.com) and sign in.
3. Create a PostgreSQL database **or** use Neon/Supabase:
   - **Render Postgres:** New → Postgres. Copy the **Internal Database URL** (or External if the API is not on Render).
   - **Neon:** [https://console.neon.tech](https://console.neon.tech) → create a project → copy the connection string (`postgresql://...?sslmode=require`).
   - **Supabase:** Project Settings → Database → URI.
4. New → **Web Service** → connect the `emi-vault` repo.
5. Set:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
6. Environment variables (Environment tab):

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | leave unset — Render injects `PORT` automatically |
   | `DATABASE_URL` | the Postgres connection string from step 3 |
   | `FRONTEND_ORIGIN` | your Vercel URL, e.g. `https://emi-vault.vercel.app` (add it after the frontend is live; you can update later) |

7. Create Web Service and wait for the first deploy. Copy the service URL, e.g. `https://emi-store-api.onrender.com`.
8. Seed the hosted database **once** (Render Shell on the web service, or from your laptop):

   ```bash
   npm run seed:prod
   ```

   From your laptop, set `DATABASE_URL` to the hosted URL in `backend/.env` (do not commit it) and run:

   ```bash
   cd backend
   npm run seed
   ```

9. Confirm: `https://YOUR-RENDER-URL/api/products` returns JSON.

Render listens on `process.env.PORT` and binds `0.0.0.0`. Hosted `DATABASE_URL` enables SSL automatically.

### Frontend on Vercel — exact dashboard steps

1. Open [https://vercel.com](https://vercel.com) and sign in.
2. Add New → Project → import the `emi-vault` repo.
3. Set:
   - **Root Directory:** `frontend` (Edit, not the repo root)
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
4. Environment Variables (must be set **before** the production build):

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://YOUR-RENDER-URL` with **no trailing slash** |

   Example: `https://emi-store-api.onrender.com`

5. Deploy.
6. Copy the Vercel URL (e.g. `https://emi-vault.vercel.app`).
7. Go back to Render → Environment → set `FRONTEND_ORIGIN` to that Vercel URL → **Manual Deploy** → Deploy latest commit (so CORS allows the frontend).
8. If you change `VITE_API_URL` later, redeploy the Vercel project so the new value is baked into the JS bundle.

`frontend/vercel.json` rewrites SPA routes to `index.html` so `/products/:slug` works on refresh. Product photos in `frontend/public/images/` are copied into `dist/images/` at build time and served as static files.

### After both are live

1. Open the Vercel URL.
2. Confirm the product grid loads from the Render API.
3. Open a product, select a variant and EMI plan, click Proceed.
4. Confirm chassis photos load from `/images/...` (same origin as the Vercel app).

