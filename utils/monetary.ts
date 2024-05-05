export function toEuro(centValue: number): string {
  const centValueWithoutDecimal = Math.floor(centValue)

  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(centValueWithoutDecimal / 100)
}

export function toCents(euroValue: number, centValue?: number): number {
  return euroValue * 100 + (centValue ?? 0)
}
