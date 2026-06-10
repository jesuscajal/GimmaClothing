import Link from "next/link"
import { ArrowRightMini } from "@medusajs/icons"
import { gimmaPath } from "@lib/gimma/paths"

type Props = {
  basePath: string
  images: string[]
}

export default function StoreBasicsBanner({ basePath, images }: Props) {
  const visible = images.slice(0, 3)
  const main = visible[0]

  if (!main) return null

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

          <div className="relative flex items-end justify-center gap-3 sm:justify-end">
            {visible.map((src, index) => (
              <div
                key={src}
                className="relative overflow-hidden rounded-2xl shadow-lg"
                style={{
                  width: index === 0 ? "55%" : "22%",
                  marginBottom: index === 1 ? "1rem" : index === 2 ? "2rem" : 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="Producto Gimma"
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
