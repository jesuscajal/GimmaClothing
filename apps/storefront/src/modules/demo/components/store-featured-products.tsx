import Link from "next/link"
import { DemoProduct } from "@lib/demo/data"
import { GimmaProduct } from "@lib/gimma/types"
import { gimmaPath } from "@lib/gimma/paths"
import DemoProductCard from "@modules/demo/components/product-card"

type Product = DemoProduct | GimmaProduct

type Props = {
  products: Product[]
  basePath: string
}

export default function StoreFeaturedProducts({
  products,
  basePath,
}: Props) {
  if (!products.length) return null

  return (
    <section className="mx-4 mt-10 sm:mx-6">
      <div className="flex items-end justify-between gap-4">
        <div className="text-center sm:text-left">
          <span className="text-xs text-[#8B7355]" aria-hidden>
            ♥
          </span>
          <h2 className="mt-1 font-serif text-3xl font-semibold text-black">
            Colección
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Productos de la tienda
          </p>
        </div>
        <Link
          href={gimmaPath(basePath, "tienda")}
          className="shrink-0 text-xs font-semibold uppercase tracking-wide text-neutral-700 underline"
        >
          Ver todo
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {products.map((product) => (
          <DemoProductCard
            key={product.id}
            product={product}
            basePath={basePath}
          />
        ))}
      </div>
    </section>
  )
}
