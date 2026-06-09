import Link from "next/link"
import { notFound } from "next/navigation"
import {
  DEMO_PRODUCTS,
  formatDemoPrice,
  getDemoProduct,
} from "@lib/demo/data"
import DemoProductActions from "@modules/demo/components/product-actions"
import DemoProductCard from "@modules/demo/components/product-card"

type Props = {
  params: Promise<{ handle: string }>
}

export default async function DemoProductPage({ params }: Props) {
  const { handle } = await params
  const product = getDemoProduct(handle)

  if (!product) {
    notFound()
  }

  const related = DEMO_PRODUCTS.filter(
    (p) => p.category === product.category && p.handle !== handle
  ).slice(0, 3)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-8 text-sm text-neutral-500">
        <Link href="/demo/inicio" className="hover:text-black">
          Inicio
        </Link>
        <span className="mx-2 text-beige-300">/</span>
        <Link href="/demo/tienda" className="hover:text-black">
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
              {formatDemoPrice(product.price)}
            </span>
            {product.compareAt && (
              <span className="text-neutral-400 line-through">
                {formatDemoPrice(product.compareAt)}
              </span>
            )}
          </div>
          <p className="mt-6 leading-relaxed text-neutral-500">
            {product.description}
          </p>

          <div className="mt-10 border-t border-beige-200 pt-10">
            <DemoProductActions product={product} />
          </div>

          <div className="mt-8 rounded-xl border border-beige-200 bg-beige-50 p-4 text-sm text-neutral-500">
            Al finalizar, enviá tu pedido por{" "}
            <strong className="text-black">WhatsApp</strong> y te confirmamos
            disponibilidad.
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
              <DemoProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
