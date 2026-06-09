export type DemoOrderStatus =
  | "pendiente"
  | "confirmado"
  | "enviado"
  | "entregado"
  | "cancelado"

export type DemoOrderChannel = "whatsapp" | "web"

export type DemoAdminOrder = {
  id: string
  displayId: string
  customer: string
  phone: string
  channel: DemoOrderChannel
  status: DemoOrderStatus
  items: {
    productId: string
    title: string
    variant: string
    qty: number
    price: number
  }[]
  total: number
  createdAt: string
  note?: string
  stockDeducted?: boolean
}

export type DemoAdminProduct = {
  id: string
  title: string
  category: string
  status: "publicado" | "borrador"
  stock: number
  price: number
  image: string
  variants: number
}

export const DEMO_ADMIN_STATS = {
  pedidosHoy: 7,
  ingresosMes: 892450,
  productosActivos: 24,
  pendientesWhatsApp: 3,
}

export const DEMO_ADMIN_ORDERS: DemoAdminOrder[] = [
  {
    id: "ord-001",
    displayId: "#1042",
    customer: "María González",
    phone: "+54 11 4521-8834",
    channel: "whatsapp",
    status: "pendiente",
    items: [
      { productId: "p1", title: "Remera Oversize Negra", variant: "M · Negro", qty: 1, price: 24990 },
      { productId: "p2", title: "Jean Wide Leg", variant: "38 · Azul", qty: 1, price: 45990 },
    ],
    total: 70980,
    createdAt: "2026-05-28T14:32:00",
    note: "Preguntó por envío a CABA",
  },
  {
    id: "ord-002",
    displayId: "#1041",
    customer: "Lucas Fernández",
    phone: "+54 11 3344-2211",
    channel: "whatsapp",
    status: "confirmado",
    items: [
      { productId: "p4", title: "Hoodie Logo Gimma", variant: "L · Gris", qty: 1, price: 32990 },
    ],
    total: 32990,
    createdAt: "2026-05-28T11:15:00",
  },
  {
    id: "ord-003",
    displayId: "#1040",
    customer: "Valentina Ruiz",
    phone: "+54 11 5566-7788",
    channel: "whatsapp",
    status: "enviado",
    items: [
      { productId: "p3", title: "Vestido Linen Beige", variant: "S · Beige", qty: 1, price: 38990 },
      { productId: "p6", title: "Short Cargo Arena", variant: "M · Arena", qty: 2, price: 19990 },
    ],
    stockDeducted: true,
    total: 78970,
    createdAt: "2026-05-27T18:40:00",
  },
  {
    id: "ord-004",
    displayId: "#1039",
    customer: "Diego Martínez",
    phone: "+54 11 2233-4455",
    channel: "web",
    status: "entregado",
    items: [
      { productId: "p5", title: "Campera Denim", variant: "XL · Denim", qty: 1, price: 52990 },
    ],
    stockDeducted: true,
    total: 52990,
    createdAt: "2026-05-26T09:20:00",
  },
  {
    id: "ord-005",
    displayId: "#1038",
    customer: "Camila Soto",
    phone: "+54 11 6677-8899",
    channel: "whatsapp",
    status: "pendiente",
    items: [
      { productId: "p1", title: "Remera Oversize Negra", variant: "S · Blanco", qty: 2, price: 24990 },
    ],
    total: 49980,
    createdAt: "2026-05-28T16:05:00",
    note: "Retiro en local",
  },
]

export const DEMO_ADMIN_PRODUCTS: DemoAdminProduct[] = [
  {
    id: "p1",
    title: "Remera Oversize Negra",
    category: "Hombre",
    status: "publicado",
    stock: 48,
    price: 24990,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80",
    variants: 8,
  },
  {
    id: "p2",
    title: "Jean Wide Leg",
    category: "Mujer",
    status: "publicado",
    stock: 22,
    price: 45990,
    image: "https://images.unsplash.com/photo-1541099644245-41727a1d3c3e?w=200&q=80",
    variants: 4,
  },
  {
    id: "p3",
    title: "Vestido Linen Beige",
    category: "Mujer",
    status: "publicado",
    stock: 15,
    price: 38990,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b2?w=200&q=80",
    variants: 6,
  },
  {
    id: "p4",
    title: "Hoodie Logo Gimma",
    category: "Nuevo",
    status: "publicado",
    stock: 31,
    price: 32990,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80",
    variants: 8,
  },
  {
    id: "p5",
    title: "Campera Denim",
    category: "Hombre",
    status: "publicado",
    stock: 9,
    price: 52990,
    image: "https://images.unsplash.com/photo-1576991852464-1bf803aa2794?w=200&q=80",
    variants: 4,
  },
  {
    id: "p6",
    title: "Short Cargo Arena",
    category: "Hombre",
    status: "borrador",
    stock: 0,
    price: 19990,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=200&q=80",
    variants: 3,
  },
]

export const DEMO_LOW_STOCK = DEMO_ADMIN_PRODUCTS.filter((p) => p.stock > 0 && p.stock < 12)

export function getDemoAdminOrder(id: string) {
  return DEMO_ADMIN_ORDERS.find((o) => o.id === id)
}

export function formatAdminPrice(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatAdminDate(iso: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}

export const STATUS_LABELS: Record<DemoOrderStatus, string> = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
}

export const NEXT_ORDER_ACTION: Partial<Record<DemoOrderStatus, string>> = {
  pendiente: "Confirmar pedido",
  confirmado: "Marcar como enviado",
  enviado: "Marcar como entregado",
}

export const STATUS_STYLES: Record<DemoOrderStatus, string> = {
  pendiente: "bg-amber-100 text-amber-800",
  confirmado: "bg-blue-100 text-blue-800",
  enviado: "bg-violet-100 text-violet-800",
  entregado: "bg-emerald-100 text-emerald-800",
  cancelado: "bg-neutral-100 text-neutral-600",
}
