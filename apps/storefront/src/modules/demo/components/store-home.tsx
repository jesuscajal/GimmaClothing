import StoreBasicsBanner from "@modules/demo/components/store-basics-banner"
import StoreCategoryCircles, {
  StoreCategoryItem,
} from "@modules/demo/components/store-category-circles"
import StoreHomeHero from "@modules/demo/components/store-home-hero"
import StoreTrustBar from "@modules/demo/components/store-trust-bar"

type Props = {
  basePath: string
  categories: StoreCategoryItem[]
}

export default function StoreHome({ basePath, categories }: Props) {
  return (
    <>
      <StoreHomeHero basePath={basePath} />
      <StoreTrustBar />
      <StoreCategoryCircles categories={categories} basePath={basePath} />
      <StoreBasicsBanner basePath={basePath} />
    </>
  )
}
