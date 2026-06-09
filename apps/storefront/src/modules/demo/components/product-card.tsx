import Link from "next/link"
import { ArrowRightMini, Heart } from "@medusajs/icons"
import { DemoProduct } from "@lib/demo/data"
import { GimmaProduct } from "@lib/gimma/types"
import { formatDemoPrice } from "@lib/demo/data"
import { formatGimmaPrice } from "@lib/gimma/format-price"
import { gimmaPath } from "@lib/gimma/paths"
import clsx from "clsx"

type Product = DemoProduct | GimmaProduct

function formatPrice(product: Product) {
  if ("currency" in product) {
    return formatGimmaPrice(product.price, product.currency)
  }
  return formatDemoPrice(product.price)
}

function formatCompare(product: Product) {
  if (!product.compareAt) return null
  if ("currency" in product) {
    return formatGimmaPrice(product.compareAt, product.currency)
  }
  return formatDemoPrice(product.compareAt)
}

export default function DemoProductCard({
  product,
  basePath = "/demo",
}: {
  product: Product
  basePath?: string
}) {
  const productHref = gimmaPath(basePath, `producto/${product.handle}`)

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-beige-100">
        <Link href={productHref} className="block h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </Link>
        <button
          type="button"
          aria-label="Agregar a favoritos"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-neutral-400 shadow-sm transition hover:text-beige-700"
        >
          <Heart className="h-4 w-4" />
        </button>
        {product.badge && (
          <span
            className={clsx(
              "absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase",
              product.badge === "Sale"
                ? "bg-white/95 text-black ring-1 ring-black/10 backdrop-blur-sm"
                : "bg-beige-800/90 text-white backdrop-blur-sm"
            )}
          >
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-1 pt-4">
        <h3 className="font-serif text-lg leading-tight text-black">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-black">
            {formatPrice(product)}
          </span>
          {product.compareAt && (
            <span className="text-xs text-neutral-400 line-through">
              {formatCompare(product)}
            </span>
          )}
        </div>
        <Link
          href={productHref}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-beige-100 py-2.5 text-sm font-medium text-beige-800 transition hover:bg-beige-200"
        >
          Ver producto
          <ArrowRightMini className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
