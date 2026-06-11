"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type SearchContextType = {
  searchQuery: string
  setSearchQuery: (q: string) => void
  isFocused: boolean
  setIsFocused: (f: boolean) => void
}

const StoreSearchContext = createContext<SearchContextType | undefined>(undefined)

export function StoreSearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  return (
    <StoreSearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        isFocused,
        setIsFocused,
      }}
    >
      {children}
    </StoreSearchContext.Provider>
  )
}

export function useStoreSearch() {
  const context = useContext(StoreSearchContext)
  if (!context) {
    throw new Error("useStoreSearch must be used within a StoreSearchProvider")
  }
  return context
}
