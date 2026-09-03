import type { EmiPlan } from '../types/product'
import { formatInr, formatInterest } from '../lib/format'

type EmiPlanCardProps = {
  plan: EmiPlan
  selected: boolean
  onSelect: () => void
}

export function EmiPlanCard({ plan, selected, onSelect }: EmiPlanCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${formatInr(plan.monthlyAmount)} for ${plan.tenureMonths} months, ${formatInterest(plan.interestRate)}${
        plan.cashbackAmount ? `, ${formatInr(plan.cashbackAmount)} cashback` : ''
      }`}
      onClick={onSelect}
      className={`w-full rounded-xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        selected
          ? 'border-indigo-700 bg-indigo-50 ring-2 ring-indigo-200'
          : 'border-slate-200 bg-white hover:border-indigo-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-900">
            {formatInr(plan.monthlyAmount)} × {plan.tenureMonths} months
          </p>
          {plan.planLabel && (
            <p className="mt-1 text-sm text-slate-600">{plan.planLabel}</p>
          )}
        </div>
        <span
          className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border ${
            selected ? 'border-indigo-700 bg-indigo-700' : 'border-slate-400 bg-white'
          }`}
          aria-hidden="true"
        />
      </div>
      <p className="mt-2 text-sm text-slate-700">{formatInterest(plan.interestRate)}</p>
      {plan.cashbackAmount !== null && plan.cashbackAmount > 0 && (
        <p className="mt-1 text-sm font-medium text-emerald-800">
          {formatInr(plan.cashbackAmount)} cashback
        </p>
      )}
    </button>
  )
}
