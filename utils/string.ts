export function capitalize(str: string): string {
  return `${str.charAt(0).toUpperCase()}${str.substring(1)}`
}

export function ln2Br(text: string): string {
  return text.replace(/\n/g, '<br />')
}
