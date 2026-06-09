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
import StoreHero from "@modules/demo/components/store-hero"
import StoreToolbar from "@modules/demo/components/store-toolbar"
import GimmaStoreFilters from "@modules/gimma/components/gimma-store-filters"

/** Catálogo dinámico: evita servir productos obsoletos tras importar en admin. */
export const revalidate = 60

const CATALOG_REVALIDATE = 60

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ categoria?: string; orden?: string }>
}

export default async function GimmaStorePage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const { categoria, orden } = await searchParams
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
  const filtered = categoria
    ? products.filter((p) => p.category === categoria)
    : products
  const sorted = sortProducts(filtered, orden)

  const filterCategories = countByCategory(
    products,
    categories.map((c) => ({ id: c.handle, label: c.label }))
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <StoreHero productCount={products.length} />

      <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:gap-12">
        <aside className="lg:w-56 lg:shrink-0">
          <Suspense
            fallback={<p className="text-sm text-neutral-400">Cargando…</p>}
          >
            <GimmaStoreFilters
              basePath={basePath}
              categories={filterCategories}
              totalCount={products.length}
              active={categoria}
            />
          </Suspense>
        </aside>

        <div className="min-w-0 flex-1">
          <Suspense fallback={null}>
            <StoreToolbar productCount={sorted.length} basePath={basePath} />
          </Suspense>

          {sorted.length === 0 ? (
            <p className="text-neutral-500">
              No hay productos en esta categoría.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:gap-8">
              {sorted.map((p) => (
                <DemoProductCard key={p.id} product={p} basePath={basePath} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
