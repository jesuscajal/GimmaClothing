/**
 * Tipos compartidos entre demo (mock) y producción (Medusa).
 * Las pantallas de diseño usan DemoProduct; producción mapea StoreProduct → GimmaProduct.
 */
export type GimmaCategory = {
  id: string
  handle: string
  label: string
  image?: string
}

export type GimmaVariant = {
  id: string
  size: string
  color?: string
}

export type GimmaProduct = {
  id: string
  handle: string
  title: string
  description: string
  category?: string
  price: number
  compareAt?: number
  currency: string
  image: string
  images: string[]
  sizes: string[]
  colors: { name: string; hex: string }[]
  variants: GimmaVariant[]
  badge?: string
  inStock: boolean
}

export type GimmaCartLine = {
  productId: string
  handle: string
  title: string
  size: string
  color: string
  quantity: number
  unitPrice: number
  image: string
}
