"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag } from "@medusajs/icons"
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

  const links = [
    { href: gimmaPath(basePath, "inicio"), label: "Inicio" },
    { href: gimmaPath(basePath, "tienda"), label: "Tienda" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={gimmaPath(basePath, "inicio")} className="flex items-center gap-3">
          <GimmaLogo href={null} size="sm" />
          <span className="hidden text-sm font-medium tracking-[0.15em] text-black uppercase sm:inline">
            Gimma Clothing
          </span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-sm transition-colors",
                pathname === link.href
                  ? "font-medium text-black"
                  : "text-neutral-400 hover:text-black"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <CartButton basePath={basePath} />
      </div>

      <nav className="flex items-center justify-center gap-6 border-t border-neutral-100 bg-neutral-50 py-2 sm:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "text-xs",
              pathname === link.href
                ? "font-medium text-black"
                : "text-neutral-400"
            )}
          >
            {link.label}
          </Link>
        ))}
        <CartButton basePath={basePath} />
      </nav>
    </header>
  )
}
