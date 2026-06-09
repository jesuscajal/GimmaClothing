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

/** Quita comillas que vienen del Excel/WhatsApp en nombres de marca. */
export function normalizeCategoryText(value: string): string {
  return value.replace(/^["']+|["']+$/g, "").trim()
}

export function mapMedusaCategories(
  categories: HttpTypes.StoreProductCategory[]
): GimmaCategory[] {
  return categories
    .filter((c) => c.id && c.handle && !c.parent_category)
    .map((c) => {
      const handle = normalizeCategoryText(c.handle!)
      const label = normalizeCategoryText(c.name ?? c.handle!)
      return {
        id: c.id!,
        handle,
        label,
        image: CATEGORY_IMAGES[handle] ?? DEFAULT_IMAGE,
      }
    })
}

/** Solo categorías que tienen al menos un producto visible en la tienda. */
export function categoriesWithProducts(
  categories: GimmaCategory[],
  productCategoryHandles: Iterable<string | undefined>
): GimmaCategory[] {
  const handles = new Set(
    [...productCategoryHandles].filter((h): h is string => Boolean(h))
  )
  return categories
    .filter((c) => handles.has(c.handle))
    .sort((a, b) => a.label.localeCompare(b.label, "es"))
}
