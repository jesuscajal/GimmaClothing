"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRightMini } from "@medusajs/icons"
import { gimmaPath } from "@lib/gimma/paths"
import clsx from "clsx"

type Slide = {
  id: string
  eyebrow: string
  title: string[]
  titleColors: string[]
  image: string
}

const SLIDES: Slide[] = [
  {
    id: "otono",
    eyebrow: "Nueva colección",
    title: ["OTOÑO", "INVIERNO"],
    titleColors: ["text-[#6B4F3A]", "text-[#C4A882]"],
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e3685b?w=1200&q=80",
  },
  {
    id: "basics",
    eyebrow: "Esenciales",
    title: ["BÁSICOS", "QUE AMÁS"],
    titleColors: ["text-[#3D3228]", "text-[#8B7355]"],
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
  },
  {
    id: "nuevo",
    eyebrow: "Recién llegado",
    title: ["LO", "NUEVO"],
    titleColors: ["text-[#5C4A3A]", "text-[#A89578]"],
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=80",
  },
]

type Props = {
  basePath: string
}

export default function StoreHomeHero({ basePath }: Props) {
  const [active, setActive] = useState(0)
  const slide = SLIDES[active]

  return (
    <section className="relative mx-4 mt-4 overflow-hidden rounded-3xl sm:mx-6">
      <div className="relative aspect-[4/5] max-h-[520px] w-full sm:aspect-[16/10] sm:max-h-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slide.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/90">
              <span aria-hidden>♥</span>
              {slide.eyebrow}
            </p>
            <h1 className="mt-4 max-w-xs font-serif text-5xl font-semibold leading-[0.95] sm:text-6xl">
              {slide.title.map((word, i) => (
                <span
                  key={word}
                  className={clsx("block", slide.titleColors[i])}
                >
                  {word}
                </span>
              ))}
            </h1>
          </div>

          <div className="flex items-end justify-between">
            <Link
              href={gimmaPath(basePath, "tienda")}
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-neutral-800"
            >
              Ver colección
              <ArrowRightMini className="h-4 w-4" />
            </Link>

            <div className="flex gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={clsx(
                    "h-2 w-2 rounded-full transition",
                    i === active ? "bg-white" : "bg-white/40"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
