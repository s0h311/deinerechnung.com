export function toEuro(centValue: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(centValue / 100)
}

export function toCents(euroValue: number, centValue?: number): number {
  return euroValue * 100 + (centValue ?? 0)
}
