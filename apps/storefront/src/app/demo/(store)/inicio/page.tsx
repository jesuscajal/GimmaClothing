import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "@lib/demo/data"
import { demoToGimmaProducts } from "@lib/demo/to-gimma-product"
import {
  buildHomeSlides,
  enrichCategoriesWithImages,
  pickBasicsImages,
  pickFeaturedProducts,
} from "@lib/gimma/home-data"
import StoreHome from "@modules/demo/components/store-home"

export default function DemoHomePage() {
  const products = demoToGimmaProducts(DEMO_PRODUCTS)

  const categories = enrichCategoriesWithImages(
    DEMO_CATEGORIES.map((cat) => ({
      id: cat.id,
      handle: cat.id,
      label: cat.label,
      image: cat.image,
    })),
    products
  )

  return (
    <StoreHome
      basePath="/demo"
      categories={categories}
      slides={buildHomeSlides(products)}
      featured={pickFeaturedProducts(products, 4)}
      basicsImages={pickBasicsImages(products)}
    />
  )
}
