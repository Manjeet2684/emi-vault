import { useEffect, useRef } from 'react'
import type { EmiPlan, ProductDetail, ProductVariant } from '../types/product'
import { formatInr, formatInterest } from '../lib/format'

type ConfirmPlanModalProps = {
  product: ProductDetail
  variant: ProductVariant
  plan: EmiPlan
  onClose: () => void
}

export function ConfirmPlanModal({
  product,
  variant,
  plan,
  onClose,
}: ConfirmPlanModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="confirm-title" className="text-lg font-semibold text-slate-900">
            Confirm your EMI plan
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close confirmation"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm font-medium text-slate-800 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Close
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-700">
          This is a UI-only confirmation. No payment will be charged.
        </p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-700">Product</dt>
            <dd className="font-medium text-slate-900">{product.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-700">Variant</dt>
            <dd className="text-right font-medium text-slate-900">{variant.variantLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-700">Price</dt>
            <dd className="font-medium text-slate-900">{formatInr(variant.price)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-700">EMI</dt>
            <dd className="text-right font-medium text-slate-900">
            {formatInr(plan.monthlyAmount)} x {plan.tenureMonths} months
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-700">Interest</dt>
            <dd className="font-medium text-slate-900">{formatInterest(plan.interestRate)}</dd>
          </div>
          {plan.cashbackAmount !== null && plan.cashbackAmount > 0 && (
            <div className="flex justify-between gap-4">
              <dt className="text-slate-700">Cashback</dt>
              <dd className="font-medium text-emerald-800">
                {formatInr(plan.cashbackAmount)}
              </dd>
            </div>
          )}
        </dl>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-indigo-700 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Done
        </button>
      </div>
    </div>
  )
}
