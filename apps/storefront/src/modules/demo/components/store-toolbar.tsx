"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronUpDown } from "@medusajs/icons"
import { useStoreSearch } from "./store-search-context"

const SORT_OPTIONS = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
  { value: "nombre", label: "Nombre A-Z" },
] as const

type Props = {
  productCount: number
  basePath: string
}

export default function StoreToolbar({ productCount, basePath }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get("orden") ?? "recientes"

  const { searchQuery, isFocused } = useStoreSearch()
  const searchActive = isFocused || searchQuery.trim().length > 0

  if (searchActive) return null


  const onSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "recientes") {
      params.delete("orden")
    } else {
      params.set("orden", value)
    }
    const q = params.toString()
    router.push(`${basePath}/tienda${q ? `?${q}` : ""}`)
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
      <p className="text-sm text-neutral-600">
        <span className="font-semibold text-[#A89578]">{productCount}</span>{" "}
        producto{productCount !== 1 ? "s" : ""}
      </p>
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Ordenar productos"
          className="appearance-none rounded-full border border-neutral-200 bg-white py-2 pr-9 pl-3 text-xs font-medium text-black outline-none transition focus:border-neutral-400"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronUpDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      </div>
    </div>
  )
}
