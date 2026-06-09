import { Suspense } from "react"
import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { mapMedusaCategories } from "@lib/gimma/map-category"
import { mapMedusaProducts } from "@lib/gimma/map-product"
import DemoProductCard from "@modules/demo/components/product-card"
import GimmaStoreFilters from "@modules/gimma/components/gimma-store-filters"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ categoria?: string }>
}

export default async function GimmaStorePage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const { categoria } = await searchParams
  const basePath = `/${countryCode}`

  const [{ response }, rawCategories] = await Promise.all([
    listProducts({
      countryCode,
      queryParams: {
        limit: 100,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*categories,*images",
      },
    }),
    listCategories(),
  ])

  const categories = mapMedusaCategories(rawCategories)
  const products = mapMedusaProducts(response.products)
  const filtered = categoria
    ? products.filter((p) => p.category === categoria)
    : products

  const activeLabel =
    categories.find((c) => c.handle === categoria)?.label ?? "Todos"

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="border-b border-neutral-200 pb-8">
        <h1 className="text-3xl font-semibold text-black">Tienda</h1>
        <p className="mt-2 text-neutral-400">
          {filtered.length} productos · {activeLabel}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-200/80 lg:flex-row lg:p-8">
        <aside className="lg:w-48">
          <Suspense
            fallback={<p className="text-sm text-neutral-400">Cargando…</p>}
          >
            <GimmaStoreFilters
              basePath={basePath}
              categories={categories}
              active={categoria}
            />
          </Suspense>
        </aside>

        <div className="flex-1">
          {filtered.length === 0 ? (
            <p className="text-neutral-500">
              No hay productos en esta categoría.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6">
              {filtered.map((p) => (
                <DemoProductCard key={p.id} product={p} basePath={basePath} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
