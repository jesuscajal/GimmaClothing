export type DemoProduct = {
  id: string
  handle: string
  title: string
  description: string
  category: "mujer" | "hombre" | "nuevo"
  price: number
  compareAt?: number
  image: string
  images: string[]
  sizes: string[]
  colors: { name: string; hex: string }[]
  badge?: string
}

export const DEMO_WHATSAPP =
  process.env.NEXT_PUBLIC_DEMO_WHATSAPP || "5493705244120"

export const DEMO_CATEGORIES = [
  { id: "mujer", label: "Mujer", image: "https://images.unsplash.com/photo-1483985988355-763728e3685b?w=600&q=80" },
  { id: "hombre", label: "Hombre", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80" },
  { id: "nuevo", label: "Nuevo", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80" },
] as const

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: "1",
    handle: "remera-oversize-negra",
    title: "Remera Oversize Negra",
    description:
      "Algodón premium 240g. Corte relajado unisex. Ideal para looks urbanos.",
    category: "hombre",
    price: 24990,
    compareAt: 29990,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Negro", hex: "#111111" },
      { name: "Blanco", hex: "#F5F5F5" },
    ],
    badge: "Sale",
  },
  {
    id: "2",
    handle: "jean-wide-leg",
    title: "Jean Wide Leg",
    description: "Denim medio con lavado stone. Tiro alto y pierna amplia.",
    category: "mujer",
    price: 45990,
    image: "https://images.unsplash.com/photo-1541099644245-41727a1d3c3e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1541099644245-41727a1d3c3e?w=800&q=80",
      "https://images.unsplash.com/photo-1475178626620-a4d074967a7c?w=800&q=80",
    ],
    sizes: ["36", "38", "40", "42"],
    colors: [{ name: "Azul", hex: "#3B5998" }],
    badge: "Nuevo",
  },
  {
    id: "3",
    handle: "vestido-linen-beige",
    title: "Vestido Linen Beige",
    description: "Tela fresca de lino. Perfecto para temporada cálida.",
    category: "mujer",
    price: 38990,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b2?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b2?w=800&q=80",
    ],
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Beige", hex: "#D4C4B0" },
      { name: "Verde oliva", hex: "#6B705C" },
    ],
  },
  {
    id: "4",
    handle: "hoodie-logo-gimma",
    title: "Hoodie Logo Gimma",
    description: "Felpa frisa interior. Logo bordado en pecho.",
    category: "nuevo",
    price: 32990,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Gris", hex: "#9CA3AF" },
      { name: "Negro", hex: "#111111" },
    ],
    badge: "Nuevo",
  },
  {
    id: "5",
    handle: "campera-denim",
    title: "Campera Denim",
    description: "Clásica campera de jean con forro liviano.",
    category: "hombre",
    price: 52990,
    image: "https://images.unsplash.com/photo-1576991852464-1bf803aa2794?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1576991852464-1bf803aa2794?w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Denim", hex: "#4B6EAF" }],
  },
  {
    id: "6",
    handle: "short-cargo-arena",
    title: "Short Cargo Arena",
    description: "Bolsillos laterales funcionales. Tela resistente.",
    category: "hombre",
    price: 19990,
    compareAt: 24990,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
    ],
    sizes: ["S", "M", "L"],
    colors: [{ name: "Arena", hex: "#C4A77D" }],
    badge: "Sale",
  },
]

export function getDemoProduct(handle: string) {
  return DEMO_PRODUCTS.find((p) => p.handle === handle)
}

export function formatDemoPrice(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount)
}
