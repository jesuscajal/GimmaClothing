import { Suspense } from "react"
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "@lib/demo/data"
import DemoProductCard from "@modules/demo/components/product-card"
import DemoStoreFilters from "@modules/demo/components/store-filters"

type Props = {
  searchParams: Promise<{ categoria?: string }>
}

export default async function DemoStorePage({ searchParams }: Props) {
  const { categoria } = await searchParams
  const filtered = categoria
    ? DEMO_PRODUCTS.filter((p) => p.category === categoria)
    : DEMO_PRODUCTS

  const activeLabel =
    DEMO_CATEGORIES.find((c) => c.id === categoria)?.label ?? "Todos"

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
          <Suspense fallback={<p className="text-sm text-neutral-400">Cargando…</p>}>
            <DemoStoreFilters active={categoria} />
          </Suspense>
        </aside>

        <div className="flex-1">
          {filtered.length === 0 ? (
            <p className="text-neutral-500">No hay productos en esta categoría.</p>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6">
              {filtered.map((p) => (
                <DemoProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
