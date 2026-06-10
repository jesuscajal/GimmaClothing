import Link from "next/link"
import { ArrowRightMini } from "@medusajs/icons"
import { gimmaPath } from "@lib/gimma/paths"

type Props = {
  basePath: string
}

export default function StoreBasicsBanner({ basePath }: Props) {
  return (
    <section className="mx-4 mt-10 mb-8 sm:mx-6">
      <div className="relative overflow-hidden rounded-3xl bg-[#D9CCBA]">
        <div className="grid items-center gap-6 p-6 sm:grid-cols-2 sm:p-10">
          <div>
            <p className="flex items-center gap-2 text-xs text-[#6E5A42]">
              <span aria-hidden>♥</span>
              <span className="h-px w-8 bg-[#6E5A42]/40" />
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#3D3228] sm:text-4xl">
              Básicos
              <br />
              que amás
            </h2>
            <Link
              href={gimmaPath(basePath, "tienda")}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-neutral-800"
            >
              Comprar ahora
              <ArrowRightMini className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative flex justify-center sm:justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"
              alt="Básicos Gimma"
              className="h-40 w-auto rounded-2xl object-cover shadow-lg sm:h-52"
            />
            <button
              type="button"
              aria-label="Agregar a favoritos"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm shadow"
            >
              ♡
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
