export default function toMonetaryValue(centValue: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(centValue / 100)
}
