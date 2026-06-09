import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductByHandle } from "@lib/data/product-by-handle"
import { listProducts } from "@lib/data/products"
import { formatGimmaPrice } from "@lib/gimma/format-price"
import { mapMedusaProducts, mapMedusaToGimmaProduct } from "@lib/gimma/map-product"
import { gimmaPath } from "@lib/gimma/paths"
import DemoProductActions from "@modules/demo/components/product-actions"
import DemoProductCard from "@modules/demo/components/product-card"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export default async function GimmaProductPage({ params }: Props) {
  const { countryCode, handle } = await params
  const basePath = `/${countryCode}`

  const raw = await getProductByHandle(handle, countryCode)
  if (!raw) notFound()

  const product = mapMedusaToGimmaProduct(raw)
  if (!product) notFound()

  const { response } = await listProducts({
    countryCode,
    queryParams: {
      limit: 100,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*categories,*images",
    },
  })
  const all = mapMedusaProducts(response.products)
  const related = all
    .filter(
      (p) => p.category === product.category && p.handle !== handle
    )
    .slice(0, 3)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-8 text-sm text-neutral-400">
        <Link href={gimmaPath(basePath, "inicio")} className="hover:text-black">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link href={gimmaPath(basePath, "tienda")} className="hover:text-black">
          Tienda
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black">{product.title}</span>
      </nav>

      <div className="grid gap-10 overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-200/80 lg:grid-cols-2 lg:gap-16 lg:p-10">
        <div className="flex flex-col gap-3">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden rounded-xl bg-neutral-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.badge && (
            <span className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
              {product.badge}
            </span>
          )}
          <h1 className="mt-2 text-3xl font-semibold text-black">
            {product.title}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-black">
              {formatGimmaPrice(product.price, product.currency)}
            </span>
            {product.compareAt && (
              <span className="text-neutral-400 line-through">
                {formatGimmaPrice(product.compareAt, product.currency)}
              </span>
            )}
          </div>
          <p className="mt-6 text-neutral-400 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-10 border-t border-neutral-200 pt-10">
            <DemoProductActions product={product} basePath={basePath} />
          </div>

          <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-100 p-4 text-sm text-neutral-400">
            Al finalizar, enviá tu pedido por{" "}
            <strong className="text-black">WhatsApp</strong> y te confirmamos
            disponibilidad.
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-neutral-200 pt-16">
          <h2 className="text-lg font-semibold text-black">
            También te puede gustar
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
            {related.map((p) => (
              <DemoProductCard key={p.id} product={p} basePath={basePath} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
