import { HttpTypes } from "@medusajs/types"
import { GimmaCategory } from "./types"

const CATEGORY_IMAGES: Record<string, string> = {
  shirts:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
  sweatshirts:
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
  pants:
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
  merch:
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80"

export function mapMedusaCategories(
  categories: HttpTypes.StoreProductCategory[]
): GimmaCategory[] {
  return categories
    .filter((c) => c.id && c.handle && !c.parent_category)
    .map((c) => ({
      id: c.id!,
      handle: c.handle!,
      label: c.name ?? c.handle!,
      image: CATEGORY_IMAGES[c.handle!] ?? DEFAULT_IMAGE,
    }))
}
