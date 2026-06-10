import { HomeSlide } from "@lib/gimma/home-data"
import { DemoProduct } from "@lib/demo/data"
import { GimmaProduct } from "@lib/gimma/types"
import StoreBasicsBanner from "@modules/demo/components/store-basics-banner"
import StoreCategoryCircles, {
  StoreCategoryItem,
} from "@modules/demo/components/store-category-circles"
import StoreFeaturedProducts from "@modules/demo/components/store-featured-products"
import StoreHomeHero from "@modules/demo/components/store-home-hero"
import StoreTrustBar from "@modules/demo/components/store-trust-bar"

type Product = DemoProduct | GimmaProduct

type Props = {
  basePath: string
  categories: StoreCategoryItem[]
  slides: HomeSlide[]
  featured: Product[]
  basicsImages: string[]
}

export default function StoreHome({
  basePath,
  categories,
  slides,
  featured,
  basicsImages,
}: Props) {
  return (
    <div className="bg-neutral-300">
      <StoreHomeHero basePath={basePath} slides={slides} />
      <StoreTrustBar />
      <StoreCategoryCircles categories={categories} basePath={basePath} />
      <StoreFeaturedProducts products={featured} basePath={basePath} />
      <StoreBasicsBanner basePath={basePath} images={basicsImages} />
    </div>
  )
}
