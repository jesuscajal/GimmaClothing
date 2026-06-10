import Link from "next/link"
import { gimmaPath } from "@lib/gimma/paths"

export type StoreCategoryItem = {
  id: string
  handle: string
  label: string
  image?: string
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80",
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
  "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
]

type Props = {
  categories: StoreCategoryItem[]
  basePath: string
}

export default function StoreCategoryCircles({
  categories,
  basePath,
}: Props) {
  if (!categories.length) return null

  const visible = categories.slice(0, 4)

  return (
    <section className="mx-4 mt-10 sm:mx-6">
      <div className="text-center">
        <span className="text-xs text-[#8B7355]" aria-hidden>
          ♥
        </span>
        <h2 className="mt-1 font-serif text-3xl font-semibold text-black">
          Categorías
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-4 gap-3 sm:gap-6">
        {visible.map((cat, index) => (
          <Link
            key={cat.id}
            href={`${gimmaPath(basePath, "tienda")}?categoria=${cat.handle}`}
            className="group flex flex-col items-center gap-3"
          >
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white shadow-md transition group-hover:scale-105 sm:h-28 sm:w-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                alt={cat.label}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-center text-[10px] font-semibold uppercase tracking-wide text-neutral-800 sm:text-xs">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
