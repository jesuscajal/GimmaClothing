"use client"

import { useDemoAdmin } from "@modules/demo/admin/demo-admin-context"

export default function AdminInventoryTable() {
  const { products, totalStock } = useDemoAdmin()

  const outOfStock = products.filter((p) => p.stock === 0).length
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 12).length

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold text-neutral-900">Inventario</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Stock en vivo · se descuenta al confirmar pedidos
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium text-neutral-500 uppercase">
            Unidades totales
          </p>
          <p className="mt-2 text-2xl font-semibold">{totalStock}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium text-neutral-500 uppercase">
            Sin stock
          </p>
          <p className="mt-2 text-2xl font-semibold text-red-600">{outOfStock}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium text-neutral-500 uppercase">
            Stock bajo
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-600">{lowStock}</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50 text-left text-neutral-500">
              <th className="px-5 py-3 font-medium">Producto</th>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Disponible</th>
              <th className="px-5 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-neutral-50">
                <td className="px-5 py-4 font-medium text-neutral-900">
                  {p.title}
                </td>
                <td className="px-5 py-4 font-mono text-xs text-neutral-500">
                  GIM-{p.id.toUpperCase()}
                </td>
                <td className="px-5 py-4 font-medium">{p.stock}</td>
                <td className="px-5 py-4">
                  {p.stock === 0 ? (
                    <span className="text-red-600">Agotado</span>
                  ) : p.stock < 12 ? (
                    <span className="text-amber-600">Bajo</span>
                  ) : (
                    <span className="text-emerald-600">OK</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
