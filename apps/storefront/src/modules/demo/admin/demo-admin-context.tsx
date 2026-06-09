"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  DEMO_ADMIN_ORDERS,
  DEMO_ADMIN_PRODUCTS,
  DemoAdminOrder,
  DemoAdminProduct,
  DemoOrderStatus,
} from "@lib/demo/admin-data"

const STORAGE_KEY = "gimma-demo-admin"

type AdminState = {
  orders: DemoAdminOrder[]
  products: DemoAdminProduct[]
}

type AdvanceResult = {
  ok: boolean
  message: string
}

type DemoAdminContextValue = AdminState & {
  getOrder: (id: string) => DemoAdminOrder | undefined
  advanceOrder: (id: string) => AdvanceResult
  resetDemo: () => void
  pendingCount: number
  lowStockProducts: DemoAdminProduct[]
  totalStock: number
}

const DemoAdminContext = createContext<DemoAdminContextValue | null>(null)

function loadState(): AdminState {
  if (typeof window === "undefined") {
    return { orders: DEMO_ADMIN_ORDERS, products: DEMO_ADMIN_PRODUCTS }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { orders: DEMO_ADMIN_ORDERS, products: DEMO_ADMIN_PRODUCTS }
    return JSON.parse(raw) as AdminState
  } catch {
    return { orders: DEMO_ADMIN_ORDERS, products: DEMO_ADMIN_PRODUCTS }
  }
}

function canDeductStock(
  order: DemoAdminOrder,
  products: DemoAdminProduct[]
): { ok: boolean; message?: string } {
  for (const item of order.items) {
    const product = products.find((p) => p.id === item.productId)
    if (!product) {
      return { ok: false, message: `Producto no encontrado: ${item.title}` }
    }
    if (product.stock < item.qty) {
      return {
        ok: false,
        message: `Stock insuficiente de "${product.title}" (hay ${product.stock}, se necesitan ${item.qty})`,
      }
    }
  }
  return { ok: true }
}

function deductStock(
  order: DemoAdminOrder,
  products: DemoAdminProduct[]
): DemoAdminProduct[] {
  return products.map((product) => {
    const item = order.items.find((i) => i.productId === product.id)
    if (!item) return product
    return { ...product, stock: Math.max(0, product.stock - item.qty) }
  })
}

const STATUS_FLOW: Partial<Record<DemoOrderStatus, DemoOrderStatus>> = {
  pendiente: "confirmado",
  confirmado: "enviado",
  enviado: "entregado",
}

export function DemoAdminProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminState>(() => {
    if (typeof window === "undefined") {
      return { orders: DEMO_ADMIN_ORDERS, products: DEMO_ADMIN_PRODUCTS }
    }
    return loadState()
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const getOrder = useCallback(
    (id: string) => state.orders.find((o) => o.id === id),
    [state.orders]
  )

  const advanceOrder = useCallback(
    (id: string): AdvanceResult => {
      const order = state.orders.find((o) => o.id === id)
      if (!order) return { ok: false, message: "Pedido no encontrado" }

      const nextStatus = STATUS_FLOW[order.status]
      if (!nextStatus) {
        return { ok: false, message: "Este pedido ya no admite más acciones" }
      }

      if (order.status === "pendiente" && !order.stockDeducted) {
        const check = canDeductStock(order, state.products)
        if (!check.ok) {
          return { ok: false, message: check.message ?? "Sin stock" }
        }

        const newProducts = deductStock(order, state.products)
        setState((prev) => ({
          products: newProducts,
          orders: prev.orders.map((o) =>
            o.id === id
              ? { ...o, status: nextStatus, stockDeducted: true }
              : o
          ),
        }))

        return {
          ok: true,
          message:
            "Pedido confirmado. El stock se descontó del inventario.",
        }
      }

      setState((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === id ? { ...o, status: nextStatus } : o
        ),
      }))

      const messages: Record<string, string> = {
        enviado: "Pedido marcado como enviado.",
        entregado: "Pedido entregado al cliente.",
      }

      return {
        ok: true,
        message: messages[nextStatus] ?? "Estado actualizado.",
      }
    },
    [state.orders, state.products]
  )

  const resetDemo = useCallback(() => {
    const fresh = { orders: DEMO_ADMIN_ORDERS, products: DEMO_ADMIN_PRODUCTS }
    setState(fresh)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
  }, [])

  const pendingCount = useMemo(
    () => state.orders.filter((o) => o.status === "pendiente").length,
    [state.orders]
  )

  const lowStockProducts = useMemo(
    () => state.products.filter((p) => p.stock > 0 && p.stock < 12),
    [state.products]
  )

  const totalStock = useMemo(
    () => state.products.reduce((s, p) => s + p.stock, 0),
    [state.products]
  )

  const value = useMemo(
    () => ({
      ...state,
      getOrder,
      advanceOrder,
      resetDemo,
      pendingCount,
      lowStockProducts,
      totalStock,
    }),
    [
      state,
      getOrder,
      advanceOrder,
      resetDemo,
      pendingCount,
      lowStockProducts,
      totalStock,
    ]
  )

  return (
    <DemoAdminContext.Provider value={value}>{children}</DemoAdminContext.Provider>
  )
}

export function useDemoAdmin() {
  const ctx = useContext(DemoAdminContext)
  if (!ctx) {
    throw new Error("useDemoAdmin debe usarse dentro de DemoAdminProvider")
  }
  return ctx
}
