"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronUpDown } from "@medusajs/icons"

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
    <div className="mb-6 flex items-center justify-between gap-4">
      <p className="text-sm text-neutral-500">
        {productCount} producto{productCount !== 1 ? "s" : ""}
      </p>
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Ordenar productos"
          className="appearance-none rounded-lg border border-beige-200 bg-white py-2 pr-9 pl-3 text-sm text-black outline-none transition focus:border-beige-400"
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
