import { DEMO_CATEGORIES } from "@lib/demo/data"
import StoreHome from "@modules/demo/components/store-home"

export default function DemoHomePage() {
  const categories = DEMO_CATEGORIES.map((cat) => ({
    id: cat.id,
    handle: cat.id,
    label: cat.label,
    image: cat.image,
  }))

  return <StoreHome basePath="/demo" categories={categories} />
}
