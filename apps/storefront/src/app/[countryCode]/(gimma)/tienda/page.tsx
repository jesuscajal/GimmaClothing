import { Suspense } from "react"
import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { countByCategory, sortProducts } from "@lib/demo/sort-products"
import {
  categoriesWithProducts,
  mapMedusaCategories,
} from "@lib/gimma/map-category"
import { mapMedusaProducts } from "@lib/gimma/map-product"
import DemoProductCard from "@modules/demo/components/product-card"
import StorePageLayout from "@modules/demo/components/store-page-layout"
import StoreToolbar from "@modules/demo/components/store-toolbar"
import GimmaStoreFilters from "@modules/gimma/components/gimma-store-filters"

export const revalidate = 60

const CATALOG_REVALIDATE = 60

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ categoria?: string; orden?: string; search?: string }>
}

export default async function GimmaStorePage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const { categoria, orden, search } = await searchParams
  const basePath = `/${countryCode}`

  const [{ response }, rawCategories] = await Promise.all([
    listProducts({
      countryCode,
      revalidate: CATALOG_REVALIDATE,
      queryParams: {
        limit: 200,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*categories,*images",
      },
    }),
    listCategories(undefined, { revalidate: CATALOG_REVALIDATE }),
  ])

  const products = mapMedusaProducts(response.products)
  const categories = categoriesWithProducts(
    mapMedusaCategories(rawCategories),
    products.map((p) => p.category)
  )
  
  // Filtrar por categoría
  let filtered = categoria
    ? products.filter((p) => p.category === categoria)
    : products

  // Filtrar por buscador
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(searchLower)
    )
  }

  const sorted = sortProducts(filtered, orden)

  const filterCategories = countByCategory(
    products,
    categories.map((c) => ({ id: c.handle, label: c.label }))
  )

  return (
    <StorePageLayout
      productCount={products.length}
      filters={
        <GimmaStoreFilters
          basePath={basePath}
          categories={filterCategories}
          totalCount={products.length}
          active={categoria}
        />
      }
      toolbar={
        <StoreToolbar productCount={sorted.length} basePath={basePath} />
      }
    >
      {sorted.length === 0 ? (
        <p className="text-center text-neutral-500">
          No hay productos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {sorted.map((p) => (
            <DemoProductCard key={p.id} product={p} basePath={basePath} />
          ))}
        </div>
      )}
    </StorePageLayout>
  )
}
