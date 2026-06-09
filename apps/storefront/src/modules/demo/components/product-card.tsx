import Link from "next/link"
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
  return (
    <Link
      href={gimmaPath(basePath, `producto/${product.handle}`)}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/80 transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {product.badge && (
          <span
            className={clsx(
              "absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase",
              product.badge === "Sale"
                ? "bg-white/95 text-black ring-1 ring-black/10 backdrop-blur-sm"
                : "bg-black/90 text-white backdrop-blur-sm"
            )}
          >
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 px-4 py-3">
        <h3 className="text-sm font-medium text-black">{product.title}</h3>
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
      </div>
    </Link>
  )
}
