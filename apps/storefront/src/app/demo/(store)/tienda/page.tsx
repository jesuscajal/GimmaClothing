import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "@lib/demo/data"
import { countByCategory, sortProducts } from "@lib/demo/sort-products"
import DemoProductCard from "@modules/demo/components/product-card"
import StoreCategoryNav from "@modules/demo/components/store-category-nav"
import StorePageLayout from "@modules/demo/components/store-page-layout"
import StoreToolbar from "@modules/demo/components/store-toolbar"

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
    <StorePageLayout
      productCount={DEMO_PRODUCTS.length}
      filters={
        <StoreCategoryNav
          basePath="/demo"
          categories={filterCategories}
          totalCount={DEMO_PRODUCTS.length}
          active={categoria}
        />
      }
      toolbar={
        <StoreToolbar productCount={sorted.length} basePath="/demo" />
      }
    >
      {sorted.length === 0 ? (
        <p className="text-center text-neutral-500">
          No hay productos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {sorted.map((p) => (
            <DemoProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </StorePageLayout>
  )
}
