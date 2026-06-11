"use client"

import StoreSearch from "./store-search"
import { useStoreSearch } from "./store-search-context"

type Props = {
  title?: string
  productCount: number
}

export default function StorePageIntro({
  title = "Tienda",
  productCount,
}: Props) {
  const { searchQuery, isFocused } = useStoreSearch()
  const searchActive = isFocused || searchQuery.trim().length > 0

  return (
    <header className="relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-5xl font-semibold tracking-tight text-black sm:text-6xl">
          {title}
        </h1>
        {title === "Tienda" && <StoreSearch />}
      </div>

      {!searchActive && (
        <>
          <div className="mt-4 flex items-center gap-3 animate-fade-in">
            <span className="h-px flex-1 max-w-[120px] bg-neutral-400/50" />
            <span className="text-xs text-black" aria-hidden>
              ♥
            </span>
            <span className="h-px flex-1 bg-neutral-400/30" />
          </div>

          <p className="mt-4 text-sm text-neutral-600 animate-fade-in">
            <span className="font-semibold text-[#A89578]">{productCount}</span>{" "}
            productos disponibles
          </p>

          <div className="relative mt-6 overflow-hidden rounded-3xl animate-fade-in">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/store-banner.png"
              alt="Gimma Clothing"
              className="aspect-[16/10] w-full object-cover sm:aspect-[21/9]"
            />
          </div>
        </>
      )}
    </header>
  )
}

