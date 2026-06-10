import { normalizeKey } from "./catalog-import"

/**
 * Categorías de tienda online de ropa femenina (AR).
 * Basado en catálogo Gimma + estructura típica de Tiendanube/shop locales.
 */
export const GIMMA_GARMENT_CATEGORIES = [
  { handle: "vestidos", label: "Vestidos", description: "Vestidos cortos y largos" },
  {
    handle: "tops-remeras",
    label: "Tops y Remeras",
    description: "Tops, remeras, musculosas y mangas largas",
  },
  {
    handle: "buzos-abrigos",
    label: "Buzos y Abrigos",
    description: "Buzos, camperas, pilusos y ruanas",
  },
  {
    handle: "pantalones-calzas",
    label: "Pantalones y Calzas",
    description: "Palazos, calzas y pantalones",
  },
  {
    handle: "shorts-polleras",
    label: "Shorts y Polleras",
    description: "Shorts, polleras y minis",
  },
  {
    handle: "bodies-enterizos",
    label: "Bodies y Enterizos",
    description: "Bodies, catsuits y enterizos",
  },
  {
    handle: "accesorios",
    label: "Accesorios",
    description: "Carteras, bolsos y más",
  },
  { handle: "otros", label: "Otros", description: "Otros productos" },
] as const

export type GarmentCategoryHandle =
  (typeof GIMMA_GARMENT_CATEGORIES)[number]["handle"]

const BRAND_HANDLES = new Set(
  [
    "ninfa",
    "noix",
    "stormy",
    "milokita",
    "play-urban",
    "barullo",
    "byf-women",
    "shirts",
    "pants",
    "sweatshirts",
    "merch",
  ]
)

/** Clasifica un producto por nombre según tipo de prenda. */
export function classifyGarmentCategory(title: string): GarmentCategoryHandle {
  const t = normalizeKey(title)

  if (/cartera|mini bag|bolso|accesorio/.test(t)) return "accesorios"
  if (/catsuit|enterizo/.test(t)) return "bodies-enterizos"
  if (/\bbody\b/.test(t) || t.startsWith("body ")) return "bodies-enterizos"
  if (/vestido/.test(t)) return "vestidos"
  if (/buzo|campera|camperita|piluso|ruana|chomba|sweater|saco/.test(t)) {
    return "buzos-abrigos"
  }
  if (/palazo|calza|pantalon/.test(t)) return "pantalones-calzas"
  if (/short|pollera|\bmini\b/.test(t)) return "shorts-polleras"
  if (/remera|musculosa|top|manga larga|polera|bufand|pupera/.test(t)) {
    return "tops-remeras"
  }

  return "otros"
}

export function isLegacyBrandCategory(handle: string): boolean {
  return BRAND_HANDLES.has(normalizeKey(handle).replace(/\s+/g, "-"))
}
