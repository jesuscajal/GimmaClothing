import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "@lib/demo/data"
import { countByCategory, sortProducts } from "@lib/demo/sort-products"
import StoreCatalogList from "@modules/demo/components/store-catalog-list"
import StoreCategoryNav from "@modules/demo/components/store-category-nav"
import StorePageLayout from "@modules/demo/components/store-page-layout"
import StoreToolbar from "@modules/demo/components/store-toolbar"

type Props = {
  searchParams: Promise<{ categoria?: string; orden?: string }>
}

export default async function DemoStorePage({ searchParams }: Props) {
  const { categoria, orden } = await searchParams
  
  // Filtrar por categoría
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
      <StoreCatalogList products={sorted} basePath="/demo" />
    </StorePageLayout>
  )
}
