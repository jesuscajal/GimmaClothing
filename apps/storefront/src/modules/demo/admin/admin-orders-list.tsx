"use client"

import Link from "next/link"
import {
  CHANNEL_LABELS,
  formatAdminDate,
  formatAdminPrice,
  STATUS_LABELS,
  STATUS_STYLES,
} from "@lib/demo/admin-data"
import { useDemoAdmin } from "@modules/demo/admin/demo-admin-context"

export default function AdminOrdersList() {
  const { orders } = useDemoAdmin()

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Pedidos</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {orders.length} pedidos · incluye WhatsApp y web
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50 text-left text-neutral-500">
              <th className="px-5 py-3 font-medium">Pedido</th>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Teléfono</th>
              <th className="px-5 py-3 font-medium">Canal</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-neutral-50 hover:bg-neutral-50"
              >
                <td className="px-5 py-4">
                  <Link
                    href={`/demo/admin/pedidos/${order.id}`}
                    className="font-medium text-neutral-900 hover:underline"
                  >
                    {order.displayId}
                  </Link>
                  <p className="text-xs text-neutral-400">
                    {formatAdminDate(order.createdAt)}
                  </p>
                </td>
                <td className="px-5 py-4 text-neutral-700">{order.customer}</td>
                <td className="px-5 py-4 text-neutral-500">{order.phone}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      order.channel === "whatsapp"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {CHANNEL_LABELS[order.channel]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-medium text-black">
                  {formatAdminPrice(order.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
