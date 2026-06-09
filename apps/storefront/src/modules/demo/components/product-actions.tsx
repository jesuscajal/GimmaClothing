"use client"

import { useState } from "react"
import { DemoProduct } from "@lib/demo/data"
import { GimmaProduct } from "@lib/gimma/types"
import { useDemoCart } from "@modules/demo/demo-cart-context"
import { gimmaPath } from "@lib/gimma/paths"
import clsx from "clsx"

type Product = DemoProduct | GimmaProduct

export default function DemoProductActions({
  product,
  basePath = "/demo",
}: {
  product: Product
  basePath?: string
}) {
  const { addItem } = useDemoCart()
  const [size, setSize] = useState(product.sizes[0])
  const [color, setColor] = useState(product.colors[0].name)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem({
      handle: product.handle,
      title: product.title,
      price: product.price,
      size,
      color,
      image: product.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-medium tracking-wide text-neutral-400 uppercase">
          Talle
        </p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={clsx(
                "min-w-[3rem] rounded-full border px-4 py-2 text-sm transition",
                size === s
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 bg-white text-black hover:border-black"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium tracking-wide text-neutral-400 uppercase">
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
                  ? "border-black ring-2 ring-black ring-offset-2"
                  : "border-neutral-300"
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <p className="mt-1 text-xs text-neutral-400">{color}</p>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={"inStock" in product && !product.inStock}
        className="w-full rounded-full bg-black py-4 text-sm font-medium tracking-wide text-white uppercase transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {added
          ? "Agregado al carrito"
          : "inStock" in product && !product.inStock
            ? "Sin stock"
            : "Agregar al carrito"}
      </button>

      <a
        href={gimmaPath(basePath, "carrito")}
        className="w-full rounded-full border border-neutral-300 bg-white py-3 text-center text-sm text-neutral-400 transition hover:border-black hover:text-black"
      >
        Ver carrito
      </a>
    </div>
  )
}
