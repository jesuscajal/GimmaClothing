import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import {
  buildHomeSlides,
  enrichCategoriesWithImages,
  pickBasicsImages,
  pickFeaturedProducts,
} from "@lib/gimma/home-data"
import {
  categoriesWithProducts,
  mapMedusaCategories,
} from "@lib/gimma/map-category"
import { mapMedusaProducts } from "@lib/gimma/map-product"
import StoreHome from "@modules/demo/components/store-home"

export const revalidate = 60

const CATALOG_REVALIDATE = 60

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function GimmaHomePage({ params }: Props) {
  const { countryCode } = await params
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
  const categories = enrichCategoriesWithImages(
    categoriesWithProducts(
      mapMedusaCategories(rawCategories),
      products.map((p) => p.category)
    ),
    products
  )

  return (
    <StoreHome
      basePath={basePath}
      categories={categories}
      slides={buildHomeSlides(products)}
      featured={pickFeaturedProducts(products, 8)}
      basicsImages={pickBasicsImages(products)}
    />
  )
}
