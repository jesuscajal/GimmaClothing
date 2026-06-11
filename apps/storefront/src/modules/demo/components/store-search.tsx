"use client"

import { useStoreSearch } from "./store-search-context"

export default function StoreSearch() {
  const { searchQuery, setSearchQuery, setIsFocused } = useStoreSearch()

  return (
    <div className="relative w-full max-w-[280px]">
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onChange={(e) => setSearchQuery(e.target.value)}
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
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 p-1 rounded-full text-neutral-400 hover:bg-beige-100 hover:text-neutral-600 transition"
            aria-label="Limpiar búsqueda"
          >
            <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
