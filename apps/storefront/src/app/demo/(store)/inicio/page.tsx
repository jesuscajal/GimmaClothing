import Link from "next/link"
import {
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  formatDemoPrice,
} from "@lib/demo/data"
import DemoProductCard from "@modules/demo/components/product-card"
import GimmaLogo from "@modules/demo/components/gimma-logo"

export default function DemoHomePage() {
  const featured = DEMO_PRODUCTS.filter((p) => p.badge).slice(0, 4)
  const rest = DEMO_PRODUCTS.filter((p) => !featured.includes(p)).slice(0, 2)

  return (
    <>
      <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-beige-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.06]"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <div className="flex justify-center">
            <GimmaLogo href={null} size="lg" />
          </div>
          <h1 className="mt-8 font-serif text-4xl font-normal text-black sm:text-5xl">
            Gimma Clothing
          </h1>
          <p className="mt-4 text-sm text-neutral-500">
            Moda minimal. Pedí por WhatsApp.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/demo/tienda"
              className="rounded-lg bg-beige-800 px-8 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-beige-900"
            >
              Ver colección
            </Link>
            <Link
              href="/demo/carrito"
              className="rounded-lg border border-beige-300 bg-white px-8 py-3 text-sm font-medium tracking-wide text-black transition hover:border-beige-500"
            >
              Mi carrito
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center font-serif text-2xl text-black">
          Categorías
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {DEMO_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/demo/tienda?categoria=${cat.id}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-beige-100 transition duration-300 hover:-translate-y-0.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image}
                alt={cat.label}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-beige-800/20 transition group-hover:bg-beige-800/10" />
              <span className="absolute bottom-6 left-6 font-serif text-xl text-white">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-beige-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl text-black">Destacados</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Lo más pedido esta semana
              </p>
            </div>
            <Link
              href="/demo/tienda"
              className="text-sm font-medium text-beige-700 underline"
            >
              Ver todo
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            {featured.map((p) => (
              <DemoProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl text-black">
              Pedí sin complicaciones
            </h2>
            <p className="mt-4 text-neutral-500">
              Elegí tus prendas, armá el carrito y enviá el pedido por WhatsApp.
              Te confirmamos stock y forma de pago al instante.
            </p>
            <ol className="mt-8 space-y-4 text-sm text-neutral-500">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-beige-800 text-xs text-white">
                  1
                </span>
                Explorá el catálogo
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-beige-800 text-xs text-white">
                  2
                </span>
                Agregá talles y colores al carrito
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-beige-400 text-xs text-beige-800">
                  3
                </span>
                Enviá el pedido por WhatsApp
              </li>
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {rest.map((p) => (
              <DemoProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-beige-200 bg-beige-100 px-4 py-12 text-center sm:px-6">
        <p className="text-sm text-neutral-500">Envío gratis en compras desde</p>
        <p className="mt-1 font-serif text-3xl text-black">
          {formatDemoPrice(80000)}
        </p>
      </section>
    </>
  )
}
