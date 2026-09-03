import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProductBySlug } from '../api/products'
import { ConfirmPlanModal } from '../components/ConfirmPlanModal'
import { EmiPlanCard } from '../components/EmiPlanCard'
import { ProductDetailSkeleton } from '../components/Skeletons'
import { StatusPanel } from '../components/StatusPanel'
import { VariantSelector } from '../components/VariantSelector'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getApiErrorKind, type ApiErrorKind } from '../lib/errors'
import { formatInr, unique } from '../lib/format'
import type { ProductDetail, ProductVariant } from '../types/product'

function titleForState(
  slug: string | undefined,
  loading: boolean,
  errorKind: ApiErrorKind | null,
  productName?: string,
): string {
  if (!slug) return 'Product not found · EMI Store'
  if (loading) return 'Loading product · EMI Store'
  if (errorKind === 'not-found') return 'Product not found · EMI Store'
  if (errorKind === 'network') return 'Could not load product · EMI Store'
  if (productName) return `${productName} · EMI Store`
  return 'EMI Store'
}

export function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errorKind, setErrorKind] = useState<ApiErrorKind | null>(null)

  useDocumentTitle(titleForState(slug, loading, errorKind, product?.name))

  async function loadProduct(productSlug: string) {
    setLoading(true)
    setErrorKind(null)

    try {
      const data = await fetchProductBySlug(productSlug)
      setProduct(data)
      const first = data.variants[0] ?? null
      setSelectedVariant(first)
      setSelectedStorage(first?.storage ?? null)
      setSelectedColor(first?.color ?? null)
      setSelectedPlanId(null)
    } catch (error) {
      setProduct(null)
      setSelectedVariant(null)
      setSelectedStorage(null)
      setSelectedColor(null)
      setErrorKind(getApiErrorKind(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!slug) return

    let cancelled = false
    const productSlug = slug

    async function loadInitialProduct() {
      try {
        const data = await fetchProductBySlug(productSlug)
        if (cancelled) return
        setProduct(data)
        const first = data.variants[0] ?? null
        setSelectedVariant(first)
        setSelectedStorage(first?.storage ?? null)
        setSelectedColor(first?.color ?? null)
        setSelectedPlanId(null)
        setErrorKind(null)
      } catch (error) {
        if (cancelled) return
        setProduct(null)
        setSelectedVariant(null)
        setSelectedStorage(null)
        setSelectedColor(null)
        setErrorKind(getApiErrorKind(error))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadInitialProduct()
    return () => {
      cancelled = true
    }
  }, [slug])

  const storages = useMemo(
    () => unique(product?.variants.map((variant) => variant.storage) ?? []),
    [product],
  )
  const colors = useMemo(
    () => unique(product?.variants.map((variant) => variant.color) ?? []),
    [product],
  )

  const selectedPlan = selectedVariant?.emiPlans.find((plan) => plan.id === selectedPlanId) ?? null
  const pageLoading = Boolean(slug) && loading
  const notFound = !slug || errorKind === 'not-found'
  const networkError = errorKind === 'network'

  function selectByStorage(storage: string) {
    if (!product) return
    const color = selectedColor ?? selectedVariant?.color
    const next =
      product.variants.find((item) => item.storage === storage && item.color === color) ??
      product.variants.find((item) => item.storage === storage)
    if (!next) return
    setSelectedStorage(storage)
    setSelectedColor(next.color)
    setSelectedVariant(next)
    setSelectedPlanId(null)
  }

  function selectByColor(color: string) {
    if (!product) return
    const storage = selectedStorage ?? selectedVariant?.storage
    const next =
      product.variants.find((item) => item.storage === storage && item.color === color) ??
      product.variants.find((item) => item.color === color)
    if (!next) return
    setSelectedColor(color)
    setSelectedStorage(next.storage)
    setSelectedVariant(next)
    setSelectedPlanId(null)
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col px-4 pb-28 pt-6 sm:px-6 lg:h-svh lg:overflow-hidden lg:px-8">
      <Link
        to="/"
        className="shrink-0 text-sm font-medium text-indigo-800 underline-offset-2 hover:underline"
      >
        Back to products
      </Link>

      {pageLoading && <ProductDetailSkeleton />}

      {!pageLoading && notFound && (
        <StatusPanel
          title="Product not found"
          message="We could not find a product at this address. It may have been removed, or the link may be incorrect."
          showHomeLink
        />
      )}

      {!pageLoading && networkError && (
        <StatusPanel
          title="Could not load this product"
          message="The store is unavailable right now. Check your connection and try again."
          onRetry={slug ? () => void loadProduct(slug) : undefined}
        />
      )}

      {!pageLoading && !errorKind && product && selectedVariant && (
        <div className="mt-6 grid min-h-0 flex-1 grid-cols-1 gap-8 lg:grid-cols-2 lg:overflow-hidden">
          <section className="relative isolate z-0 overflow-hidden bg-slate-50 lg:overflow-y-auto">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-neutral-100">
              <img
                src={selectedVariant.imageUrl}
                alt={`${product.name}, ${selectedVariant.variantLabel}`}
                width={800}
                height={600}
                className="aspect-square w-full object-contain object-center"
              />
            </div>
            <p className="mt-4 text-sm font-medium uppercase tracking-wide text-slate-700">
              {product.brand}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">{product.name}</h1>
            <p className="mt-2 text-slate-700">{product.description}</p>
            <p className="mt-3 text-sm text-slate-700">{selectedVariant.variantLabel}</p>
            <div className="mt-6">
              <VariantSelector
                storages={storages}
                colors={colors}
                selectedStorage={selectedStorage ?? selectedVariant.storage}
                selectedColor={selectedColor ?? selectedVariant.color}
                onStorageChange={selectByStorage}
                onColorChange={selectByColor}
              />
            </div>
          </section>

          <section className="relative isolate z-0 flex min-h-0 flex-col overflow-hidden bg-slate-50">
            <div className="shrink-0 bg-slate-50 pb-4">
              <p className="text-sm text-slate-700">
                <span className="mr-2 line-through">{formatInr(selectedVariant.mrp)}</span>
                MRP
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {formatInr(selectedVariant.price)}
              </p>
              <h2 className="mt-8 text-lg font-semibold text-slate-900">
                EMI plans backed by mutual funds
              </h2>
            </div>
            <div
              role="radiogroup"
              aria-label="EMI plans"
              className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-slate-50 pr-1"
            >
              {selectedVariant.emiPlans.map((plan) => (
                <EmiPlanCard
                  key={plan.id}
                  plan={plan}
                  selected={plan.id === selectedPlanId}
                  onSelect={() => setSelectedPlanId(plan.id)}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {!pageLoading && !errorKind && product && selectedVariant && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <p className="hidden text-sm text-slate-700 sm:block">
              {selectedPlan
                ? `${formatInr(selectedPlan.monthlyAmount)} x ${selectedPlan.tenureMonths} months`
                : 'Select an EMI plan to continue'}
            </p>
            <button
              type="button"
              disabled={!selectedPlan}
              aria-label={
                selectedPlan
                  ? 'Proceed with selected EMI plan'
                  : 'Proceed, select an EMI plan first'
              }
              onClick={() => setConfirmOpen(true)}
              className="ml-auto w-full rounded-xl bg-indigo-700 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-800 sm:w-auto"
            >
              Proceed
            </button>
          </div>
        </div>
      )}

      {confirmOpen && product && selectedVariant && selectedPlan && (
        <ConfirmPlanModal
          product={product}
          variant={selectedVariant}
          plan={selectedPlan}
          onClose={() => setConfirmOpen(false)}
        />
      )}
    </main>
  )
}
