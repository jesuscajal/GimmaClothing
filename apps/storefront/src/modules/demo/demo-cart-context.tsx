"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { DemoCartLine } from "@lib/demo/whatsapp"

const DEFAULT_STORAGE_KEY = "gimma-demo-cart"

type DemoCartContextValue = {
  items: DemoCartLine[]
  count: number
  addItem: (item: Omit<DemoCartLine, "quantity"> & { quantity?: number }) => void
  removeItem: (handle: string, size: string, color: string) => void
  updateQuantity: (
    handle: string,
    size: string,
    color: string,
    quantity: number
  ) => void
  clearCart: () => void
}

const DemoCartContext = createContext<DemoCartContextValue | null>(null)

function loadCart(storageKey: string): DemoCartLine[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as DemoCartLine[]) : []
  } catch {
    return []
  }
}

export function DemoCartProvider({
  children,
  storageKey = DEFAULT_STORAGE_KEY,
}: {
  children: React.ReactNode
  storageKey?: string
}) {
  const [items, setItems] = useState<DemoCartLine[]>([])

  useEffect(() => {
    setItems(loadCart(storageKey))
  }, [storageKey])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items))
  }, [items, storageKey])

  const addItem = useCallback(
    (item: Omit<DemoCartLine, "quantity"> & { quantity?: number }) => {
      const qty = item.quantity ?? 1
      setItems((prev) => {
        const idx = prev.findIndex(
          (i) =>
            i.handle === item.handle &&
            i.size === item.size &&
            i.color === item.color
        )
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = { ...next[idx], quantity: next[idx].quantity + qty }
          return next
        }
        return [...prev, { ...item, quantity: qty }]
      })
    },
    []
  )

  const removeItem = useCallback(
    (handle: string, size: string, color: string) => {
      setItems((prev) =>
        prev.filter(
          (i) =>
            !(i.handle === handle && i.size === size && i.color === color)
        )
      )
    },
    []
  )

  const updateQuantity = useCallback(
    (handle: string, size: string, color: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(handle, size, color)
        return
      }
      setItems((prev) =>
        prev.map((i) =>
          i.handle === handle && i.size === size && i.color === color
            ? { ...i, quantity }
            : i
        )
      )
    },
    [removeItem]
  )

  const clearCart = useCallback(() => setItems([]), [])

  const count = useMemo(
    () => items.reduce((n, i) => n + i.quantity, 0),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      count,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, count, addItem, removeItem, updateQuantity, clearCart]
  )

  return (
    <DemoCartContext.Provider value={value}>{children}</DemoCartContext.Provider>
  )
}

export function useDemoCart() {
  const ctx = useContext(DemoCartContext)
  if (!ctx) {
    throw new Error("useDemoCart debe usarse dentro de DemoCartProvider")
  }
  return ctx
}
