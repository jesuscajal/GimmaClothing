import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import { GimmaProduct } from "./types"

const COLOR_HEX: Record<string, string> = {
  black: "#111111",
  negro: "#111111",
  white: "#f5f5f5",
  blanco: "#f5f5f5",
  gray: "#9ca3af",
  gris: "#9ca3af",
  blue: "#3b82f6",
  azul: "#3b82f6",
  red: "#ef4444",
  rojo: "#ef4444",
}

function optionValues(
  product: HttpTypes.StoreProduct,
  title: string
): string[] {
  const option = product.options?.find(
    (o) => o.title?.toLowerCase() === title.toLowerCase()
  )
  return option?.values?.map((v) => v.value).filter(Boolean) as string[] ?? []
}

function mapColors(product: HttpTypes.StoreProduct) {
  const names = optionValues(product, "color")
  if (!names.length) {
    return [{ name: "Único", hex: "#111111" }]
  }
  return names.map((name) => ({
    name,
    hex: COLOR_HEX[name.toLowerCase()] ?? "#737373",
  }))
}

function mapSizes(product: HttpTypes.StoreProduct) {
  const sizes = optionValues(product, "size")
  return sizes.length ? sizes : ["Único"]
}

function hasStock(product: HttpTypes.StoreProduct) {
  return (
    product.variants?.some(
      (v) => (v.inventory_quantity ?? 0) > 0 || v.manage_inventory === false
    ) ?? false
  )
}

export function mapMedusaToGimmaProduct(
  product: HttpTypes.StoreProduct
): GimmaProduct | null {
  if (!product.id || !product.handle) return null

  const priceInfo = getProductPrice({ product })
  const cheapest = priceInfo.cheapestPrice
  if (!cheapest) return null

  const images =
    product.images?.map((img) => img.url).filter(Boolean) as string[] ?? []
  const thumbnail = product.thumbnail ?? images[0] ?? "/images/logo-gimma.png"

  const original = cheapest.original_price_number
  const calculated = cheapest.calculated_price_number
  const compareAt =
    original > calculated ? original : undefined

  return {
    id: product.id,
    handle: product.handle,
    title: product.title ?? product.handle,
    description: product.description ?? "",
    category: product.categories?.[0]?.handle ?? undefined,
    price: calculated,
    compareAt,
    currency: cheapest.currency_code ?? "ars",
    image: thumbnail,
    images: images.length ? images : [thumbnail],
    sizes: mapSizes(product),
    colors: mapColors(product),
    badge: product.metadata?.badge as string | undefined,
    inStock: hasStock(product),
  }
}

export function mapMedusaProducts(
  products: HttpTypes.StoreProduct[]
): GimmaProduct[] {
  return products
    .map(mapMedusaToGimmaProduct)
    .filter((p): p is GimmaProduct => p !== null)
}
