type Sortable = {
  title: string
  price: number
}

export function sortProducts<T extends Sortable>(
  products: T[],
  orden?: string
): T[] {
  const list = [...products]

  switch (orden) {
    case "precio-asc":
      return list.sort((a, b) => a.price - b.price)
    case "precio-desc":
      return list.sort((a, b) => b.price - a.price)
    case "nombre":
      return list.sort((a, b) =>
        a.title.localeCompare(b.title, "es", { sensitivity: "base" })
      )
    default:
      return list
  }
}

export function countByCategory<T extends { category?: string }>(
  products: T[],
  categories: ReadonlyArray<{ id: string; label: string }>
) {
  const counts = new Map<string, number>()
  for (const p of products) {
    if (p.category) {
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
    }
  }
  return categories.map((cat) => ({
    id: cat.id,
    label: cat.label,
    count: counts.get(cat.id) ?? 0,
  }))
}
