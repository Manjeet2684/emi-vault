export function formatInr(amount: number, fractionDigits = 0): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(amount)
}

export function formatInterest(rate: number): string {
  if (rate === 0) return '0% interest'
  return `${rate}% interest`
}

export function unique(values: string[]): string[] {
  return [...new Set(values)]
}
