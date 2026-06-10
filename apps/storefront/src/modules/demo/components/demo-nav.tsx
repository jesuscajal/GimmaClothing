"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BarsThree, ShoppingBag, XMark } from "@medusajs/icons"
import { useDemoCart } from "@modules/demo/demo-cart-context"
import GimmaBrandTitle from "@modules/demo/components/gimma-brand-title"
import { gimmaPath } from "@lib/gimma/paths"
import clsx from "clsx"

type Props = {
  basePath?: string
}

function CartButton({
  className,
  basePath,
}: {
  className?: string
  basePath: string
}) {
  const { count } = useDemoCart()

  return (
    <Link
      href={gimmaPath(basePath, "carrito")}
      aria-label={`Carrito${count > 0 ? `, ${count} productos` : ""}`}
      className={clsx(
        "relative inline-flex h-10 w-10 items-center justify-center text-black transition hover:opacity-60",
        className
      )}
    >
      <ShoppingBag className="h-[22px] w-[22px]" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold leading-none text-white">
          {count}
        </span>
      )}
    </Link>
  )
}

export default function DemoNav({ basePath = "/demo" }: Props) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: gimmaPath(basePath, "inicio"), label: "Inicio" },
    { href: gimmaPath(basePath, "tienda"), label: "Tienda" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-neutral-300/90 backdrop-blur-sm">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-3 items-center px-4 sm:px-6">
        <button
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuOpen((o) => !o)}
          className="inline-flex h-10 w-10 items-center justify-center justify-self-start text-black"
        >
          {menuOpen ? (
            <XMark className="h-5 w-5" />
          ) : (
            <BarsThree className="h-5 w-5" />
          )}
        </button>

        <Link
          href={gimmaPath(basePath, "inicio")}
          className="justify-self-center"
        >
          <GimmaBrandTitle size="sm" />
        </Link>

        <CartButton basePath={basePath} className="justify-self-end" />
      </div>

      {menuOpen && (
        <nav className="border-t border-neutral-400/30 bg-neutral-300 px-4 py-4">
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={clsx(
                    "block text-sm uppercase tracking-wide",
                    pathname === link.href
                      ? "font-semibold text-black"
                      : "text-neutral-700"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
