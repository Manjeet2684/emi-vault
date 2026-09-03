import { useEffect, useState } from 'react'
import { fetchProducts } from '../api/products'
import { ProductCard } from '../components/ProductCard'
import { ProductListSkeleton } from '../components/Skeletons'
import { StatusPanel } from '../components/StatusPanel'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { ProductListItem } from '../types/product'

export function ProductListPage() {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useDocumentTitle('Shop phones · EMI Store')

  async function loadProducts() {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch {
      setError('The store is unavailable right now. Check your connection and try again.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function loadInitialProducts() {
      try {
        const data = await fetchProducts()
        if (cancelled) return
        setProducts(data)
        setError(null)
      } catch {
        if (cancelled) return
        setError('The store is unavailable right now. Check your connection and try again.')
        setProducts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadInitialProducts()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-700">
          EMI Store
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Shop phones</h1>
        <p className="mt-2 max-w-2xl text-slate-700">
          Browse products and compare EMI plans backed by mutual funds.
        </p>
      </header>

      {loading && <ProductListSkeleton />}

      {!loading && error && (
        <StatusPanel
          title="Could not load products"
          message={error}
          onRetry={() => void loadProducts()}
        />
      )}

      {!loading && !error && products.length === 0 && (
        <StatusPanel
          title="No products yet"
          message="There are no products in the catalog right now."
        />
      )}

      {!loading && !error && products.length > 0 && (
        <section
          aria-label="Product list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  )
}
