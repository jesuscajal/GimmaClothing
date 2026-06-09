"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { DEMO_CATEGORIES } from "@lib/demo/data"
import clsx from "clsx"

export default function DemoStoreFilters({ active }: { active?: string }) {
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
    <div>
      <p className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
        Filtrar
      </p>
      <ul className="mt-4 space-y-2">
        <li>
          <Link
            href={linkFor()}
            className={clsx(
              "text-sm",
              !active ? "font-medium text-black" : "text-neutral-400"
            )}
          >
            Todos
          </Link>
        </li>
        {DEMO_CATEGORIES.map((cat) => (
          <li key={cat.id}>
            <Link
              href={linkFor(cat.id)}
              className={clsx(
                "text-sm",
                active === cat.id
                  ? "font-medium text-black"
                  : "text-neutral-400 hover:text-black"
              )}
            >
              {cat.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
