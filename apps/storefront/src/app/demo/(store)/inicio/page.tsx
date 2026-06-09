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
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e3685b?w=1600&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.07] grayscale"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <div className="flex justify-center">
            <GimmaLogo href={null} size="lg" />
          </div>
          <p className="mt-8 text-xs font-medium tracking-[0.35em] text-neutral-400 uppercase">
            Gris · Negro · Blanco
          </p>
          <p className="mt-4 text-lg text-neutral-400">
            Moda minimal. Pedí por WhatsApp.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/demo/tienda"
              className="rounded-full bg-black px-8 py-3 text-sm font-medium tracking-wide text-white uppercase transition hover:bg-neutral-800"
            >
              Ver colección
            </Link>
            <Link
              href="/demo/carrito"
              className="rounded-full border border-neutral-300 bg-white px-8 py-3 text-sm font-medium tracking-wide text-black uppercase transition hover:border-black"
            >
              Mi carrito
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-xs font-medium tracking-[0.3em] text-neutral-400 uppercase">
          Categorías
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {DEMO_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/demo/tienda?categoria=${cat.id}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-200 shadow-sm ring-1 ring-neutral-200/80 transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image}
                alt={cat.label}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-neutral-100/40 transition group-hover:bg-neutral-100/25" />
              <span className="absolute bottom-6 left-6 text-xl font-medium text-black">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-black">Destacados</h2>
              <p className="mt-1 text-sm text-neutral-400">
                Lo más pedido esta semana
              </p>
            </div>
            <Link
              href="/demo/tienda"
              className="text-sm font-medium text-black underline"
            >
              Ver todo
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6">
            {featured.map((p) => (
              <DemoProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold text-black">
              Pedí sin complicaciones
            </h2>
            <p className="mt-4 text-neutral-400">
              Elegí tus prendas, armá el carrito y enviá el pedido por WhatsApp.
              Te confirmamos stock y forma de pago al instante.
            </p>
            <ol className="mt-8 space-y-4 text-sm text-neutral-400">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-black text-xs text-white">
                  1
                </span>
                Explorá el catálogo
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-black text-xs text-white">
                  2
                </span>
                Agregá talles y colores al carrito
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs text-black">
                  3
                </span>
                Enviá el pedido por WhatsApp
              </li>
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {rest.map((p) => (
              <DemoProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-100 px-4 py-12 text-center sm:px-6">
        <p className="text-sm text-neutral-400">Envío gratis en compras desde</p>
        <p className="mt-1 text-2xl font-semibold text-black">
          {formatDemoPrice(80000)}
        </p>
      </section>
    </>
  )
}
