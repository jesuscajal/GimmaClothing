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
import { retrieveCart, addToCart, updateLineItem, deleteLineItem } from "@lib/data/cart"

const DEFAULT_STORAGE_KEY = "gimma-demo-cart"

type DemoCartContextValue = {
  items: DemoCartLine[]
  count: number
  addItem: (item: Omit<DemoCartLine, "quantity"> & { quantity?: number }) => Promise<void> | void
  removeItem: (handle: string, size: string, color: string) => Promise<void> | void
  updateQuantity: (
    handle: string,
    size: string,
    color: string,
    quantity: number
  ) => Promise<void> | void
  clearCart: () => Promise<void> | void
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

function parseVariantOptions(variant: any) {
  let size = "U"
  let color = "Único"

  if (variant) {
    if (variant.options && Array.isArray(variant.options)) {
      const sizeOpt = variant.options.find(
        (o: any) =>
          o.option?.title?.toLowerCase() === "size" ||
          o.option_id === "opt_size" ||
          o.option?.name?.toLowerCase() === "size"
      )
      if (sizeOpt?.value) size = sizeOpt.value

      const colorOpt = variant.options.find(
        (o: any) =>
          o.option?.title?.toLowerCase() === "color" ||
          o.option_id === "opt_color" ||
          o.option?.name?.toLowerCase() === "color"
      )
      if (colorOpt?.value) color = colorOpt.value
    }

    if (variant.title && (size === "U" || color === "Único")) {
      const parts = variant.title.split("/").map((p: string) => p.trim())
      if (parts.length === 2) {
        size = parts[0]
        color = parts[1]
      } else if (parts.length === 1 && parts[0] !== "") {
        size = parts[0]
      }
    }
  }

  return { size, color }
}

function mapMedusaItemToDemoLine(item: any): DemoCartLine {
  const { size, color } = parseVariantOptions(item.variant)

  return {
    handle: item.product_handle ?? item.product?.handle ?? "",
    title: item.product_title ?? item.product?.title ?? item.title ?? "",
    price: item.unit_price ?? ((item.total ?? 0) / item.quantity),
    size,
    color,
    quantity: item.quantity,
    image: item.thumbnail ?? item.product?.thumbnail,
    variantId: item.variant_id,
  }
}

export function DemoCartProvider({
  children,
  storageKey = DEFAULT_STORAGE_KEY,
  basePath = "/demo",
  countryCode = "ar",
}: {
  children: React.ReactNode
  storageKey?: string
  basePath?: string
  countryCode?: string
}) {
  const [items, setItems] = useState<DemoCartLine[]>([])

  const isDemo = basePath === "/demo"

  const syncCart = useCallback(async () => {
    if (isDemo) return
    try {
      const medusaCart = await retrieveCart()
      if (medusaCart && medusaCart.items) {
        const mapped = medusaCart.items.map(mapMedusaItemToDemoLine)
        setItems(mapped)
      } else {
        setItems([])
      }
    } catch (err) {
      console.error("Error fetching Medusa cart in provider:", err)
    }
  }, [isDemo])

  useEffect(() => {
    if (isDemo) {
      setItems(loadCart(storageKey))
    } else {
      syncCart()
    }
  }, [storageKey, isDemo, syncCart])

  useEffect(() => {
    if (isDemo) {
      localStorage.setItem(storageKey, JSON.stringify(items))
    }
  }, [items, storageKey, isDemo])

  const addItem = useCallback(
    async (item: Omit<DemoCartLine, "quantity"> & { quantity?: number }) => {
      const qty = item.quantity ?? 1
      if (isDemo) {
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
      } else {
        if (!item.variantId) {
          console.error("Missing variantId in addItem production")
          return
        }
        try {
          await addToCart({
            variantId: item.variantId,
            quantity: qty,
            countryCode,
          })
          await syncCart()
        } catch (err) {
          console.error("Error adding to Medusa cart:", err)
        }
      }
    },
    [isDemo, countryCode, syncCart]
  )

  const removeItem = useCallback(
    async (handle: string, size: string, color: string) => {
      if (isDemo) {
        setItems((prev) =>
          prev.filter(
            (i) =>
              !(i.handle === handle && i.size === size && i.color === color)
          )
        )
      } else {
        try {
          const medusaCart = await retrieveCart()
          if (!medusaCart || !medusaCart.items) return

          const itemToDelete = medusaCart.items.find((i: any) => {
            const mapped = mapMedusaItemToDemoLine(i)
            return (
              mapped.handle === handle &&
              mapped.size === size &&
              mapped.color === color
            )
          })

          if (itemToDelete?.id) {
            await deleteLineItem(itemToDelete.id)
            await syncCart()
          }
        } catch (err) {
          console.error("Error removing from Medusa cart:", err)
        }
      }
    },
    [isDemo, syncCart]
  )

  const updateQuantity = useCallback(
    async (handle: string, size: string, color: string, quantity: number) => {
      if (quantity < 1) {
        await removeItem(handle, size, color)
        return
      }

      if (isDemo) {
        setItems((prev) =>
          prev.map((i) =>
            i.handle === handle && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          )
        )
      } else {
        try {
          const medusaCart = await retrieveCart()
          if (!medusaCart || !medusaCart.items) return

          const itemToUpdate = medusaCart.items.find((i: any) => {
            const mapped = mapMedusaItemToDemoLine(i)
            return (
              mapped.handle === handle &&
              mapped.size === size &&
              mapped.color === color
            )
          })

          if (itemToUpdate?.id) {
            await updateLineItem({
              lineId: itemToUpdate.id,
              quantity,
            })
            await syncCart()
          }
        } catch (err) {
          console.error("Error updating Medusa cart item quantity:", err)
        }
      }
    },
    [isDemo, removeItem, syncCart]
  )

  const clearCart = useCallback(async () => {
    if (isDemo) {
      setItems([])
    } else {
      try {
        const medusaCart = await retrieveCart()
        if (medusaCart && medusaCart.items) {
          for (const item of medusaCart.items) {
            if (item.id) {
              await deleteLineItem(item.id)
            }
          }
          await syncCart()
        }
      } catch (err) {
        console.error("Error clearing Medusa cart:", err)
      }
    }
  }, [isDemo, syncCart])

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
