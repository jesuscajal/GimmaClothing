"use client"

import { useStoreSearch } from "@modules/demo/components/store-search-context"
import DemoProductCard from "@modules/demo/components/product-card"

type Props = {
  products: any[]
  basePath: string
}

export default function StoreCatalogList({ products, basePath }: Props) {
  const { searchQuery, isFocused } = useStoreSearch()

  const searchActive = isFocused || searchQuery.trim().length > 0

  if (searchActive) {
    const cleanString = (str: string) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

    const searchClean = cleanString(searchQuery)
    const searchTerms = searchClean.split(/\s+/).filter(Boolean)

    const filtered = searchTerms.length > 0
      ? products.filter((p) => {
          const titleClean = cleanString(p.title || "")
          const descClean = cleanString(p.description || "")
          const catClean = cleanString(p.category || "")

          // Check if every search term matches at least one of title, description, or category
          return searchTerms.every(
            (term) =>
              titleClean.includes(term) ||
              descClean.includes(term) ||
              catClean.includes(term)
          )
        })
      : []

    if (searchTerms.length === 0) {
      return (
        <div className="py-20 text-center animate-fade-in">
          <p className="text-lg text-neutral-500 font-serif">Comenzá a escribir para buscar prendas...</p>
        </div>
      )
    }

    if (filtered.length === 0) {
      return (
        <div className="py-20 text-center animate-fade-in">
          <p className="text-lg text-neutral-500 font-serif">No encontramos productos que coincidan con tu búsqueda.</p>
        </div>
      )
    }

    return (
      <div className="animate-fade-in">
        <p className="mb-6 text-sm text-neutral-500">
          Resultados de búsqueda para "<span className="font-semibold text-black">{searchQuery}</span>" ({filtered.length})
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {filtered.map((p) => (
            <DemoProductCard key={p.id} product={p} basePath={basePath} />
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <p className="text-center text-neutral-500">
        No hay productos en esta categoría.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
      {products.map((p) => (
        <DemoProductCard key={p.id} product={p} basePath={basePath} />
      ))}
    </div>
  )
}
