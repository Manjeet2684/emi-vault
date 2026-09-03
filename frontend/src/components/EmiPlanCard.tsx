import type { EmiPlan } from '../types/product'
import { formatInr, formatInterest } from '../lib/format'

type EmiPlanCardProps = {
  plan: EmiPlan
  selected: boolean
  onSelect: () => void
}

export function EmiPlanCard({ plan, selected, onSelect }: EmiPlanCardProps) {
  const hasCashback = plan.cashbackAmount !== null && plan.cashbackAmount > 0

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${formatInr(plan.monthlyAmount)} x ${plan.tenureMonths} months, ${formatInterest(plan.interestRate)}${
        hasCashback ? `, additional cashback of ${formatInr(plan.cashbackAmount ?? 0)}` : ''
      }`}
      onClick={onSelect}
      className={`w-full rounded-xl border bg-white p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        selected
          ? 'border-indigo-700 ring-2 ring-indigo-200'
          : 'border-slate-200 hover:border-indigo-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-slate-900">
            {formatInr(plan.monthlyAmount)} x {plan.tenureMonths} months
          </p>
          {hasCashback && (
            <p className="mt-1 text-sm font-medium text-emerald-700">
              Additional cashback of {formatInr(plan.cashbackAmount ?? 0)}
            </p>
          )}
        </div>
        <p className="shrink-0 pt-0.5 text-right text-sm font-medium text-slate-700">
          {formatInterest(plan.interestRate)}
        </p>
        <span
          className={`mt-1 h-4 w-4 shrink-0 rounded-full border ${
            selected ? 'border-indigo-700 bg-indigo-700' : 'border-slate-400 bg-white'
          }`}
          aria-hidden="true"
        />
      </div>
    </button>
  )
}
