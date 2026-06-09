"use client"

import { useState } from "react"
import { GimmaProduct } from "@lib/gimma/types"
import { resolveVariantId } from "@lib/gimma/variants"
import { useDemoCart } from "@modules/demo/demo-cart-context"
import { gimmaPath } from "@lib/gimma/paths"
import clsx from "clsx"

type Props = {
  product: GimmaProduct
  basePath: string
}

export default function GimmaProductActions({ product, basePath }: Props) {
  const { addItem } = useDemoCart()
  const [size, setSize] = useState(product.sizes[0])
  const [color, setColor] = useState(product.colors[0].name)
  const [added, setAdded] = useState(false)

  const variantId = resolveVariantId(product.variants, size, color)

  const handleAdd = () => {
    addItem({
      handle: product.handle,
      title: product.title,
      price: product.price,
      size,
      color,
      image: product.image,
      variantId,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-medium tracking-[0.15em] text-neutral-500 uppercase">
          Talle
        </p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={clsx(
                "min-w-[3rem] rounded-lg border px-4 py-2 text-sm transition",
                size === s
                  ? "border-beige-400 bg-beige-100 font-medium text-black"
                  : "border-beige-200 bg-white text-black hover:border-beige-400"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium tracking-[0.15em] text-neutral-500 uppercase">
          Color
        </p>
        <div className="flex flex-wrap gap-3">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColor(c.name)}
              title={c.name}
              className={clsx(
                "h-9 w-9 rounded-full border-2 transition",
                color === c.name
                  ? "border-beige-700 ring-2 ring-beige-300 ring-offset-2"
                  : "border-beige-200"
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <p className="mt-1 text-xs text-neutral-500">{color}</p>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!product.inStock}
        className="w-full rounded-lg bg-beige-800 py-4 text-sm font-medium text-white transition hover:bg-beige-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {added
          ? "Agregado al carrito"
          : !product.inStock
            ? "Sin stock"
            : "Agregar al carrito"}
      </button>

      <a
        href={gimmaPath(basePath, "carrito")}
        className="w-full rounded-lg border border-beige-200 bg-beige-50 py-3 text-center text-sm text-neutral-600 transition hover:border-beige-400 hover:text-black"
      >
        Ver carrito
      </a>
    </div>
  )
}
