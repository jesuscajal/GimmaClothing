"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BarsThree, ShoppingBag, XMark } from "@medusajs/icons"
import { useDemoCart } from "@modules/demo/demo-cart-context"
import GimmaLogo from "@modules/demo/components/gimma-logo"
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
        <span className="absolute top-0.5 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold leading-none text-white">
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
    <header className="sticky top-0 z-50 border-b border-beige-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={gimmaPath(basePath, "inicio")}
          className="flex items-center gap-3"
        >
          <GimmaLogo href={null} size="sm" />
          <span className="hidden font-serif text-base tracking-wide text-black sm:inline">
            Gimma Clothing
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 sm:flex">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "relative pb-0.5 text-sm transition-colors",
                  isActive
                    ? "font-medium text-black"
                    : "text-neutral-500 hover:text-black"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 h-px w-full bg-black" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <CartButton basePath={basePath} />
          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center text-black sm:hidden"
          >
            {menuOpen ? (
              <XMark className="h-5 w-5" />
            ) : (
              <BarsThree className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-beige-200 bg-white px-4 py-4 sm:hidden">
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={clsx(
                    "block text-sm",
                    pathname === link.href
                      ? "font-medium text-black"
                      : "text-neutral-500"
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
