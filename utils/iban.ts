export function prettifyIban(iban: string): string {
  return iban
    .toUpperCase()
    .replace(/[^\dA-Z]/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

export default function uglifyIban(iban: string): string {
  return iban.replaceAll(' ', '')
}
