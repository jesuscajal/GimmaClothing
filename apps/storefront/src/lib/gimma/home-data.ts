import { GimmaCategory, GimmaProduct } from "./types"

export type HomeSlide = {
  id: string
  eyebrow: string
  title: string[]
  titleColors: string[]
  image: string
  /** Si está definido, "Ver colección" filtra la tienda por esta categoría. */
  collectionCategory?: string
}

const SLIDE_COPY = [
  {
    eyebrow: "Nueva colección",
    title: ["OTOÑO", "INVIERNO"],
    titleColors: ["text-[#6B4F3A]", "text-[#C4A882]"],
    collectionCategory: "buzos-abrigos",
  },
  {
    eyebrow: "Esenciales",
    title: ["BÁSICOS", "QUE AMÁS"],
    titleColors: ["text-[#3D3228]", "text-[#8B7355]"],
  },
  {
    eyebrow: "Recién llegado",
    title: ["LO", "NUEVO"],
    titleColors: ["text-[#5C4A3A]", "text-[#A89578]"],
  },
] as const

function isCatalogImage(url: string) {
  return (
    Boolean(url) &&
    !url.includes("logo-gimma") &&
    !url.includes("unsplash.com")
  )
}

export function pickProductImage(products: GimmaProduct[]): string | undefined {
  const match = products.find((p) => isCatalogImage(p.image))
  return match?.image
}

/** Categorías con foto del primer producto real de cada marca. */
export function enrichCategoriesWithImages(
  categories: GimmaCategory[],
  products: GimmaProduct[]
): GimmaCategory[] {
  return categories.map((cat) => {
    const product = products.find((p) => p.category === cat.handle)
    const image = product && isCatalogImage(product.image) ? product.image : cat.image
    return { ...cat, image }
  })
}

function pickAutumnWinterProduct(products: GimmaProduct[]) {
  return (
    products.find(
      (p) =>
        isCatalogImage(p.image) &&
        (p.category === "buzos-abrigos" || /buzo/i.test(p.title))
    ) ?? products.find((p) => isCatalogImage(p.image))
  )
}

/** Slides del hero con fotos reales del catálogo. */
export function buildHomeSlides(products: GimmaProduct[]): HomeSlide[] {
  const withPhoto = products.filter((p) => isCatalogImage(p.image))

  if (!withPhoto.length) return []

  return SLIDE_COPY.map((copy, index) => {
    const product =
      index === 0
        ? pickAutumnWinterProduct(withPhoto) ?? withPhoto[0]
        : withPhoto[index % withPhoto.length]

    return {
      id: product.id,
      ...copy,
      image: product.image,
    }
  })
}

/** Productos destacados: con badge primero, luego el resto. */
export function pickFeaturedProducts(
  products: GimmaProduct[],
  limit = 8
): GimmaProduct[] {
  const badged = products.filter((p) => p.badge)
  const rest = products.filter((p) => !p.badge)
  return [...badged, ...rest].slice(0, limit)
}

/** Imágenes para el banner de básicos (hasta 3 productos). */
export function pickBasicsImages(products: GimmaProduct[]): string[] {
  const basics = products.filter(
    (p) =>
      isCatalogImage(p.image) &&
      /remera|musculosa|buzo|top|body|manga|basico|básico/i.test(p.title)
  )

  const pool = basics.length ? basics : products.filter((p) => isCatalogImage(p.image))
  return pool.slice(0, 3).map((p) => p.image)
}
