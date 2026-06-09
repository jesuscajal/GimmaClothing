"use client"

import Link from "next/link"
import { useState } from "react"
import {
  formatAdminDate,
  formatAdminPrice,
  NEXT_ORDER_ACTION,
  STATUS_LABELS,
  STATUS_STYLES,
} from "@lib/demo/admin-data"
import { useDemoAdmin } from "@modules/demo/admin/demo-admin-context"

export default function AdminOrderDetail({ orderId }: { orderId: string }) {
  const { getOrder, advanceOrder, products } = useDemoAdmin()
  const order = getOrder(orderId)
  const [feedback, setFeedback] = useState<{
    type: "ok" | "error"
    text: string
  } | null>(null)

  if (!order) {
    return (
      <p className="text-neutral-500">
        Pedido no encontrado.{" "}
        <Link href="/demo/admin/pedidos" className="underline">
          Volver
        </Link>
      </p>
    )
  }

  const waLink = `https://wa.me/${order.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${order.customer}, te escribimos de Gimma Clothing sobre tu pedido ${order.displayId}.`)}`

  const handleAdvance = () => {
    const result = advanceOrder(orderId)
    setFeedback({
      type: result.ok ? "ok" : "error",
      text: result.message,
    })
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/demo/admin/pedidos"
        className="text-sm text-neutral-500 hover:text-neutral-900"
      >
        ← Volver a pedidos
      </Link>

      {feedback && (
        <div
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
            feedback.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Pedido {order.displayId}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {formatAdminDate(order.createdAt)} · Canal {order.channel}
            {order.stockDeducted && (
              <span className="ml-2 text-emerald-700">· Stock descontado</span>
            )}
          </p>
        </div>
        <span
          className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[order.status]}`}
        >
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="font-medium text-neutral-900">Ítems</h2>
            <ul className="mt-4 divide-y divide-neutral-100">
              {order.items.map((item, i) => {
                const product = products.find((p) => p.id === item.productId)
                return (
                  <li key={i} className="flex justify-between py-3 text-sm">
                    <div>
                      <p className="font-medium text-neutral-900">{item.title}</p>
                      <p className="text-neutral-500">
                        {item.variant} · x{item.qty}
                      </p>
                      {product && (
                        <p className="mt-1 text-xs text-neutral-400">
                          Stock actual: {product.stock} u.
                        </p>
                      )}
                    </div>
                    <p className="font-medium text-black">
                      {formatAdminPrice(item.price * item.qty)}
                    </p>
                  </li>
                )
              })}
            </ul>
            <div className="mt-4 flex justify-between border-t border-neutral-100 pt-4 text-lg font-semibold">
              <span>Total</span>
              <span className="text-black">{formatAdminPrice(order.total)}</span>
            </div>
          </section>

          {order.note && (
            <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
              <p className="font-medium">Nota del cliente</p>
              <p className="mt-1">{order.note}</p>
            </section>
          )}
        </div>

        <div className="space-y-4">
          <section className="rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="font-medium text-neutral-900">Cliente</h2>
            <p className="mt-3 text-sm font-medium">{order.customer}</p>
            <p className="text-sm text-neutral-500">{order.phone}</p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center rounded-md bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Responder por WhatsApp
            </a>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="font-medium text-neutral-900">Acciones</h2>
            {NEXT_ORDER_ACTION[order.status] && (
              <>
                <button
                  type="button"
                  onClick={handleAdvance}
                  className="mt-3 w-full rounded-md bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
                >
                  {NEXT_ORDER_ACTION[order.status]}
                </button>
                {order.status === "pendiente" && (
                  <p className="mt-2 text-xs text-neutral-500">
                    Al confirmar se valida el stock y se descuenta del
                    inventario (como en Medusa al preparar el envío).
                  </p>
                )}
              </>
            )}
            {order.status === "entregado" && (
              <p className="mt-3 text-sm text-emerald-700">
                Pedido completado.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
