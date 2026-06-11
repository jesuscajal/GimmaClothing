"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Adjustments, ChevronRight } from "@medusajs/icons"
import { StoreFilterItem } from "@modules/demo/components/store-filters"
import { STORE_PRODUCTS_ANCHOR } from "@modules/demo/components/store-products-scroll"
import { useStoreSearch } from "@modules/demo/components/store-search-context"
import clsx from "clsx"

type Props = {
  basePath: string
  categories: StoreFilterItem[]
  totalCount: number
  active?: string
}

function CategoryIcon({ id }: { id: string }) {
  const className = "h-5 w-5 text-neutral-700"

  if (id === "todos") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    )
  }

  if (id === "accesorios") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 8h12l-1 12H7L6 8z" />
        <path d="M9 8V6a3 3 0 016 0v2" />
      </svg>
    )
  }

  if (id === "vestidos") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 4h8l2 4-2 14H8L6 8l2-4z" />
      </svg>
    )
  }

  if (id === "buzos-abrigos") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 6l-2 3v11h12V9l-2-3" />
        <path d="M12 6V3" />
      </svg>
    )
  }

  if (id === "tops-remeras") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 5h8l3 4v10H5V9l3-4z" />
      </svg>
    )
  }

  if (id === "shorts-polleras" || id === "pantalones-calzas") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 4h8v5l-1 11h-2l-1-7-1 7h-2L8 9V4z" />
      </svg>
    )
  }

  if (id === "bodies-enterizos") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="6" rx="3" ry="2" />
        <path d="M8 8v12h8V8" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  )
}

export default function StoreCategoryNav({
  basePath,
  categories,
  totalCount,
  active,
}: Props) {
  const searchParams = useSearchParams()
  const { searchQuery, isFocused } = useStoreSearch()
  const searchActive = isFocused || searchQuery.trim().length > 0

  if (searchActive) return null

  const linkFor = (cat?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) {
      params.set("categoria", cat)
    } else {
      params.delete("categoria")
    }
    const q = params.toString()
    return `${basePath}/tienda${q ? `?${q}` : ""}#${STORE_PRODUCTS_ANCHOR}`
  }

  const sorted = [...categories].sort((a, b) =>
    a.label.localeCompare(b.label, "es")
  )

  return (
    <nav className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <Adjustments className="h-4 w-4 text-neutral-600" />
        <span className="text-xs font-semibold tracking-[0.2em] text-neutral-700 uppercase">
          Filtrar
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <Link
          href={linkFor()}
          className={clsx(
            "flex items-center gap-4 border-b border-neutral-100 px-5 py-4 transition",
            !active ? "bg-[#E8DFD3]" : "hover:bg-neutral-50"
          )}
        >
          <CategoryIcon id="todos" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-black">Todos</p>
            <p className="text-xs text-neutral-500">Ver todos los productos</p>
          </div>
          <span className="rounded-full bg-neutral-200/80 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
            {totalCount}
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
        </Link>

        {sorted.map((cat) => (
          <Link
            key={cat.id}
            href={linkFor(cat.id)}
            className={clsx(
              "flex items-center gap-4 border-b border-neutral-100 px-5 py-4 transition last:border-b-0",
              active === cat.id ? "bg-[#E8DFD3]" : "hover:bg-neutral-50"
            )}
          >
            <CategoryIcon id={cat.id} />
            <p className="min-w-0 flex-1 font-medium text-black">{cat.label}</p>
            <span className="rounded-full bg-neutral-200/80 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
              {cat.count}
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
          </Link>
        ))}
      </div>
    </nav>
  )
}
