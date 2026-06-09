"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Adjustments } from "@medusajs/icons"
import CollectionBanner from "@modules/demo/components/collection-banner"
import clsx from "clsx"

export type StoreFilterItem = {
  id: string
  label: string
  count: number
}

type Props = {
  active?: string
  categories: StoreFilterItem[]
  totalCount: number
  collectionHref?: string
}

export default function DemoStoreFilters({
  active,
  categories,
  totalCount,
  collectionHref = "/demo/tienda",
}: Props) {
  const searchParams = useSearchParams()

  const linkFor = (cat?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) {
      params.set("categoria", cat)
    } else {
      params.delete("categoria")
    }
    const q = params.toString()
    return `/demo/tienda${q ? `?${q}` : ""}`
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-2">
          <Adjustments className="h-3.5 w-3.5 text-neutral-400" />
          <p className="text-xs font-medium tracking-[0.15em] text-neutral-500 uppercase">
            Filtrar
          </p>
        </div>
        <ul className="mt-5 space-y-1">
          <li>
            <Link
              href={linkFor()}
              className={clsx(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition",
                !active
                  ? "bg-beige-100 font-medium text-black"
                  : "text-neutral-500 hover:bg-beige-50 hover:text-black"
              )}
            >
              <span>Todos</span>
              <span className="text-xs text-neutral-400">{totalCount}</span>
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={linkFor(cat.id)}
                className={clsx(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition",
                  active === cat.id
                    ? "bg-beige-100 font-medium text-black"
                    : "text-neutral-500 hover:bg-beige-50 hover:text-black"
                )}
              >
                <span>{cat.label}</span>
                <span className="text-xs text-neutral-400">{cat.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <CollectionBanner href={collectionHref} />
    </div>
  )
}
