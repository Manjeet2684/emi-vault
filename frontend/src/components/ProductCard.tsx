import { Link } from 'react-router-dom'
import type { ProductListItem } from '../types/product'
import { formatInr } from '../lib/format'

type ProductCardProps = {
  product: ProductListItem
}

export function ProductCard({ product }: ProductCardProps) {
  const variantLabel =
    product.variantCount === 1
      ? '1 variant'
      : `${product.variantCount} variants`

  return (
    <Link
      to={`/products/${product.slug}`}
      aria-label={`${product.name}, ${variantLabel}, starting at ${formatInr(product.startingPrice)}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        {product.image ? (
          <img
            src={product.image}
            alt=""
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No image available
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 text-left">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-700">
          {product.brand}
        </p>
        <h2 className="text-lg font-semibold text-slate-900">{product.name}</h2>
        <p className="text-sm text-slate-700">{variantLabel}</p>
        <p className="mt-auto pt-2 text-base font-semibold text-slate-900">
          Starting at {formatInr(product.startingPrice)}
        </p>
      </div>
    </Link>
  )
}
