/** Quita comillas del Excel/WhatsApp en nombres de productos y categorías. */
export function normalizeGimmaText(value: string): string {
  let result = value.trim()
  while (/^["'""''«»].*["'""''«»]$/.test(result) && result.length > 1) {
    result = result.slice(1, -1).trim()
  }
  return result
}
