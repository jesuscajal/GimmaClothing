import { DemoProduct } from "./data"
import { GimmaProduct } from "@lib/gimma/types"

export function demoToGimmaProduct(product: DemoProduct): GimmaProduct {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    category: product.category,
    price: product.price,
    compareAt: product.compareAt,
    currency: "ars",
    image: product.image,
    images: product.images,
    sizes: product.sizes,
    colors: product.colors,
    variants: product.sizes.map((size, index) => ({
      id: `${product.id}-v${index}`,
      size,
      color: product.colors[0]?.name,
    })),
    badge: product.badge,
    inStock: true,
  }
}

export function demoToGimmaProducts(products: DemoProduct[]): GimmaProduct[] {
  return products.map(demoToGimmaProduct)
}
