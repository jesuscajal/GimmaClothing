"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import GimmaLogo from "@modules/demo/components/gimma-logo"
import { useDemoAdmin } from "@modules/demo/admin/demo-admin-context"
import clsx from "clsx"

const NAV = [
  { href: "/demo/admin", label: "Panel" },
  { href: "/demo/admin/pedidos", label: "Pedidos" },
  { href: "/demo/admin/productos", label: "Productos" },
  { href: "/demo/admin/inventario", label: "Inventario" },
  { href: "/demo/admin/clientes", label: "Clientes" },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { resetDemo } = useDemoAdmin()

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950 text-neutral-300">
      <div className="border-b border-neutral-800 px-5 py-5">
        <Link href="/demo/admin" className="flex items-center gap-3">
          <GimmaLogo href={null} size="sm" />
          <div>
            <p className="text-sm font-medium text-white">Gimma Clothing</p>
            <p className="text-[10px] tracking-wide text-neutral-500 uppercase">
              Administración
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {NAV.map((item) => {
          const active =
            item.href === "/demo/admin"
              ? pathname === item.href
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "block rounded-md px-3 py-2 text-sm transition",
                active
                  ? "bg-neutral-800 font-medium text-white"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-neutral-800 p-4">
        <Link
          href="/demo"
          className="text-xs text-neutral-500 hover:text-neutral-300"
        >
          ← Volver al índice demo
        </Link>
        <Link
          href="/demo/inicio"
          className="mt-2 block text-xs text-neutral-500 hover:text-neutral-300"
        >
          Ver tienda (cliente)
        </Link>
        <button
          type="button"
          onClick={() => {
            if (confirm("¿Restaurar pedidos e inventario al estado inicial?")) {
              resetDemo()
            }
          }}
          className="mt-4 text-xs text-neutral-500 underline hover:text-neutral-300"
        >
          Restaurar demo
        </button>
      </div>
    </aside>
  )
}
