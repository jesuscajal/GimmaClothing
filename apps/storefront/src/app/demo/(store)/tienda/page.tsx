import { Suspense } from "react"
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "@lib/demo/data"
import { countByCategory, sortProducts } from "@lib/demo/sort-products"
import DemoProductCard from "@modules/demo/components/product-card"
import StoreHero from "@modules/demo/components/store-hero"
import StoreToolbar from "@modules/demo/components/store-toolbar"
import DemoStoreFilters from "@modules/demo/components/store-filters"

type Props = {
  searchParams: Promise<{ categoria?: string; orden?: string }>
}

export default async function DemoStorePage({ searchParams }: Props) {
  const { categoria, orden } = await searchParams
  const filtered = categoria
    ? DEMO_PRODUCTS.filter((p) => p.category === categoria)
    : DEMO_PRODUCTS
  const sorted = sortProducts(filtered, orden)

  const filterCategories = countByCategory(DEMO_PRODUCTS, DEMO_CATEGORIES)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <StoreHero productCount={DEMO_PRODUCTS.length} />

      <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:gap-12">
        <aside className="lg:w-56 lg:shrink-0">
          <Suspense
            fallback={<p className="text-sm text-neutral-400">Cargando…</p>}
          >
            <DemoStoreFilters
              active={categoria}
              categories={filterCategories}
              totalCount={DEMO_PRODUCTS.length}
            />
          </Suspense>
        </aside>

        <div className="min-w-0 flex-1">
          <Suspense fallback={null}>
            <StoreToolbar
              productCount={sorted.length}
              basePath="/demo"
            />
          </Suspense>

          {sorted.length === 0 ? (
            <p className="text-neutral-500">
              No hay productos en esta categoría.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:gap-8">
              {sorted.map((p) => (
                <DemoProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
