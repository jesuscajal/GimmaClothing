"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { STORE_PRODUCTS_ANCHOR } from "@modules/demo/components/store-products-scroll"

export default function StoreSearch() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const initialQuery = searchParams.get("search") || ""
  const [query, setQuery] = useState(initialQuery)

  // Sincronizar si cambia el parámetro desde afuera (ej: al limpiar filtros)
  useEffect(() => {
    setQuery(searchParams.get("search") || "")
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set("search", query.trim())
    } else {
      params.delete("search")
    }
    // Navegar a la URL con los parámetros actualizados
    router.push(`${pathname}?${params.toString()}#${STORE_PRODUCTS_ANCHOR}`)
  }

  const handleClear = () => {
    setQuery("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    router.push(`${pathname}?${params.toString()}#${STORE_PRODUCTS_ANCHOR}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-[280px]">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full rounded-full border border-beige-200 bg-beige-50/50 py-2 pl-10 pr-10 text-sm text-black placeholder-neutral-400 outline-none transition-all focus:border-beige-400 focus:bg-white focus:ring-1 focus:ring-beige-300"
        />
        <div className="absolute left-3.5 flex items-center pointer-events-none text-neutral-400">
          <svg
            className="h-4.5 w-4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full text-neutral-400 hover:bg-beige-100 hover:text-neutral-600 transition"
            aria-label="Limpiar búsqueda"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  )
}
