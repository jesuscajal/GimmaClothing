"use client"

import Link from "next/link"
import {
  formatAdminDate,
  formatAdminPrice,
  STATUS_LABELS,
  STATUS_STYLES,
} from "@lib/demo/admin-data"
import { useDemoAdmin } from "@modules/demo/admin/demo-admin-context"

export default function AdminDashboard() {
  const { orders, pendingCount, lowStockProducts } = useDemoAdmin()
  const recent = orders.slice(0, 4)

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Resumen de Gimma Clothing · demo interactivo
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Pedidos pendientes",
            value: String(pendingCount),
            highlight: pendingCount > 0,
          },
          {
            label: "Total pedidos",
            value: String(orders.length),
          },
          {
            label: "Productos con stock bajo",
            value: String(lowStockProducts.length),
            highlight: lowStockProducts.length > 0,
          },
          {
            label: "Confirmados hoy",
            value: String(
              orders.filter((o) => o.status === "confirmado").length
            ),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-neutral-200 bg-white p-5"
          >
            <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
              {stat.label}
            </p>
            <p
              className={`mt-2 text-2xl font-semibold ${stat.highlight ? "text-amber-600" : "text-neutral-900"}`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <h2 className="font-medium text-neutral-900">Pedidos recientes</h2>
            <Link
              href="/demo/admin/pedidos"
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              Ver todos
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-left text-neutral-500">
                  <th className="px-5 py-3 font-medium">Pedido</th>
                  <th className="px-5 py-3 font-medium">Cliente</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-neutral-50 hover:bg-neutral-50"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/demo/admin/pedidos/${order.id}`}
                        className="font-medium text-neutral-900 hover:underline"
                      >
                        {order.displayId}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-neutral-700">
                      {order.customer}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-black">
                      {formatAdminPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-5 py-4">
            <h2 className="font-medium text-neutral-900">Stock bajo</h2>
            <p className="text-xs text-neutral-500">Se actualiza al confirmar pedidos</p>
          </div>
          <ul className="divide-y divide-neutral-100">
            {lowStockProducts.length === 0 ? (
              <li className="px-5 py-4 text-sm text-neutral-500">
                Sin alertas de stock bajo
              </li>
            ) : (
              lowStockProducts.map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {p.title}
                    </p>
                    <p className="text-xs text-amber-600">{p.stock} en stock</p>
                  </div>
                </li>
              ))
            )}
          </ul>
          <div className="border-t border-neutral-100 px-5 py-3">
            <Link
              href="/demo/admin/inventario"
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              Gestionar inventario →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
