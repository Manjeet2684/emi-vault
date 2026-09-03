import { Link } from 'react-router-dom'

type StatusPanelProps = {
  title: string
  message: string
  onRetry?: () => void
  showHomeLink?: boolean
}

export function StatusPanel({ title, message, onRetry, showHomeLink }: StatusPanelProps) {
  return (
    <div
      role="alert"
      className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-6"
    >
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-slate-700">{message}</p>
      {(onRetry || showHomeLink) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Retry
            </button>
          )}
          {showHomeLink && (
            <Link
              to="/"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Browse products
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
