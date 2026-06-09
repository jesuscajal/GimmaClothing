"use client"

import { formatAdminPrice } from "@lib/demo/admin-data"
import { useDemoAdmin } from "@modules/demo/admin/demo-admin-context"

export default function AdminProductsTable() {
  const { products } = useDemoAdmin()

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Productos</h1>
        <p className="mt-1 text-sm text-neutral-500">
          El stock se actualiza al confirmar pedidos
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50 text-left text-neutral-500">
              <th className="px-5 py-3 font-medium">Producto</th>
              <th className="px-5 py-3 font-medium">Categoría</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium text-right">Precio</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-neutral-50 hover:bg-neutral-50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-neutral-900">
                      {p.title}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-neutral-600">{p.category}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.status === "publicado"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={
                      p.stock === 0
                        ? "font-medium text-red-600"
                        : p.stock < 12
                          ? "font-medium text-amber-600"
                          : "text-neutral-700"
                    }
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-semibold text-black">
                  {formatAdminPrice(p.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
