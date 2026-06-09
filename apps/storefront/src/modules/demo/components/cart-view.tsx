"use client"

import Link from "next/link"
import { formatDemoPrice } from "@lib/demo/data"
import { formatGimmaPrice } from "@lib/gimma/format-price"
import { gimmaPath } from "@lib/gimma/paths"
import { buildWhatsAppOrderUrl } from "@lib/demo/whatsapp"
import { useDemoCart } from "@modules/demo/demo-cart-context"
import { getDemoProduct } from "@lib/demo/data"

type Props = {
  basePath?: string
  currency?: string
}

export default function DemoCartView({
  basePath = "/demo",
  currency,
}: Props) {
  const { items, updateQuantity, removeItem, clearCart } = useDemoCart()

  const formatPrice = (amount: number) =>
    currency ? formatGimmaPrice(amount, currency) : formatDemoPrice(amount)

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const whatsappUrl = buildWhatsAppOrderUrl(items)

  if (!items.length) {
    return (
      <div className="flex flex-col items-center rounded-lg bg-white py-20 text-center">
        <p className="text-lg text-neutral-400">Tu carrito está vacío</p>
        <Link
          href={gimmaPath(basePath, "tienda")}
          className="mt-6 bg-black px-8 py-3 text-sm font-medium text-white uppercase"
        >
          Ir a la tienda
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-200/80 lg:col-span-2">
        <ul className="divide-y divide-neutral-200">
          {items.map((item) => {
            const product = getDemoProduct(item.handle)
            const image = item.image ?? product?.image

            return (
              <li
                key={`${item.handle}-${item.size}-${item.color}`}
                className="flex gap-4 py-6"
              >
                <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200/80">
                  {image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={gimmaPath(basePath, `producto/${item.handle}`)}
                      className="font-medium text-black hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm text-neutral-400">
                      {item.color} · Talle {item.size}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-black">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center border border-neutral-300 bg-neutral-50">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.handle,
                            item.size,
                            item.color,
                            item.quantity - 1
                          )
                        }
                        className="px-3 py-1 text-neutral-400 hover:text-black"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-sm text-black">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.handle,
                            item.size,
                            item.color,
                            item.quantity + 1
                          )
                        }
                        className="px-3 py-1 text-neutral-400 hover:text-black"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.handle, item.size, item.color)
                      }
                      className="text-xs text-neutral-400 underline hover:text-black"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <p className="text-sm font-semibold text-black">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={clearCart}
          className="mt-4 text-sm text-neutral-400 underline hover:text-black"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-200/80">
        <h2 className="text-sm font-medium tracking-wide text-neutral-400 uppercase">
          Resumen
        </h2>
        <div className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-400">Subtotal</span>
            <span className="font-semibold text-black">
              {formatPrice(total)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Envío</span>
            <span className="text-neutral-400">A coordinar</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4">
          <span className="text-lg font-medium text-black">Total</span>
          <span className="text-lg font-semibold text-black">
            {formatPrice(total)}
          </span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-neutral-800"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Pedir por WhatsApp
        </a>

        <p className="mt-4 text-center text-xs text-neutral-400">
          Se abrirá WhatsApp con el detalle del pedido
        </p>

        <Link
          href={gimmaPath(basePath, "tienda")}
          className="mt-4 block text-center text-sm text-neutral-400 underline hover:text-black"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
