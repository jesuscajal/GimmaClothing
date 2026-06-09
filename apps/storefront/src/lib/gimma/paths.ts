export function gimmaPath(basePath: string, segment: string) {
  const base = basePath.replace(/\/$/, "")
  const path = segment.replace(/^\//, "")
  return `${base}/${path}`
}
