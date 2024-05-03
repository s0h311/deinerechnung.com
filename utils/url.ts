export function buildUrl(procotol: 'http' | 'https', host: string, uri?: string): string {
  return `${procotol}://${host}/${uri ?? ''}`
}
