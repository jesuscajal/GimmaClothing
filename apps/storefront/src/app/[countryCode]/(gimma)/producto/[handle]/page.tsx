import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductByHandle } from "@lib/data/product-by-handle"
import { listProducts } from "@lib/data/products"
import { formatGimmaPrice } from "@lib/gimma/format-price"
import { mapMedusaProducts, mapMedusaToGimmaProduct } from "@lib/gimma/map-product"
import { gimmaPath } from "@lib/gimma/paths"
import GimmaProductActions from "@modules/gimma/components/gimma-product-actions"
import DemoProductCard from "@modules/demo/components/product-card"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export const revalidate = 60

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
      <nav className="mb-8 text-sm text-neutral-500">
        <Link href={gimmaPath(basePath, "inicio")} className="hover:text-black">
          Inicio
        </Link>
        <span className="mx-2 text-beige-300">/</span>
        <Link href={gimmaPath(basePath, "tienda")} className="hover:text-black">
          Tienda
        </Link>
        <span className="mx-2 text-beige-300">/</span>
        <span className="text-black">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-3">
          <div className="aspect-[3/4] overflow-hidden rounded-xl bg-beige-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden rounded-lg bg-beige-100"
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
            <span className="text-xs font-medium tracking-[0.15em] text-neutral-500 uppercase">
              {product.badge}
            </span>
          )}
          <h1 className="mt-2 font-serif text-4xl font-normal text-black sm:text-5xl">
            {product.title}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="font-serif text-2xl font-semibold text-black">
              {formatGimmaPrice(product.price, product.currency)}
            </span>
            {product.compareAt && (
              <span className="text-neutral-400 line-through">
                {formatGimmaPrice(product.compareAt, product.currency)}
              </span>
            )}
          </div>
          <p className="mt-6 leading-relaxed text-neutral-500">
            {product.description}
          </p>

          <div className="mt-10 border-t border-beige-200 pt-10">
            <GimmaProductActions product={product} basePath={basePath} />
          </div>

          <div className="mt-8 rounded-xl border border-beige-200 bg-beige-50 p-4 text-sm text-neutral-500">
            <strong className="text-black">WhatsApp:</strong> el pedido más
            rápido — te confirmamos stock al instante.{" "}
            <strong className="text-black">Envío:</strong> desde el carrito podés
            completar dirección y envío a otras localidades.
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-beige-200 pt-16">
          <h2 className="font-serif text-2xl text-black">
            También te puede gustar
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8">
            {related.map((p) => (
              <DemoProductCard key={p.id} product={p} basePath={basePath} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
