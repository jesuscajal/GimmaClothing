"use client"

import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"
import clsx from "clsx"

import { signout } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

const NAV_ITEMS = [
  { href: "/account", label: "Resumen", exact: true },
  { href: "/account/profile", label: "Perfil" },
  { href: "/account/addresses", label: "Direcciones" },
  { href: "/account/orders", label: "Pedidos" },
] as const

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const isActive = (href: string, exact?: boolean) => {
    const path = route.split(countryCode)[1] ?? ""
    return exact ? path === href : path.startsWith(href)
  }

  return (
    <nav data-testid="account-nav">
      <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm lg:hidden">
        <p className="text-xs font-semibold tracking-[0.15em] text-neutral-500 uppercase">
          Mi cuenta
        </p>
        <p className="mt-1 font-medium text-black">
          Hola, {customer?.first_name ?? "cliente"}
        </p>
      </div>

      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="mb-3 flex items-center gap-x-2 text-sm text-neutral-700"
            data-testid="account-main-link"
          >
            <ChevronDown className="rotate-90" />
            <span>Volver a mi cuenta</span>
          </LocalizedClientLink>
        ) : (
          <ul className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <LocalizedClientLink
                  href={item.href}
                  className={clsx(
                    "flex items-center justify-between border-b border-neutral-100 px-5 py-4 text-sm transition last:border-b-0",
                    isActive(item.href, item.exact)
                      ? "bg-[#E8DFD3] font-medium text-black"
                      : "text-neutral-700 hover:bg-neutral-50"
                  )}
                  data-testid={`${item.href.split("/").pop()}-link`}
                >
                  <span>{item.label}</span>
                  <ChevronDown className="-rotate-90 text-neutral-400" />
                </LocalizedClientLink>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-sm text-neutral-700 transition hover:bg-neutral-50"
                onClick={handleLogout}
                data-testid="logout-button"
              >
                <span className="flex items-center gap-2">
                  <ArrowRightOnRectangle />
                  Cerrar sesión
                </span>
                <ChevronDown className="-rotate-90 text-neutral-400" />
              </button>
            </li>
          </ul>
        )}
      </div>

      <div className="hidden small:block">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-5 py-4">
            <p className="text-xs font-semibold tracking-[0.15em] text-neutral-500 uppercase">
              Gimma Clothing
            </p>
            <p className="mt-1 text-sm font-medium text-black">
              {customer?.first_name} {customer?.last_name}
            </p>
          </div>
          <ul className="p-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <LocalizedClientLink
                  href={item.href}
                  className={clsx(
                    "block rounded-xl px-3 py-2.5 text-sm transition",
                    isActive(item.href, item.exact)
                      ? "bg-[#E8DFD3] font-medium text-black"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
                  )}
                  data-testid={`${item.href.split("/").pop()}-link`}
                >
                  {item.label}
                </LocalizedClientLink>
              </li>
            ))}
            <li className="mt-1 border-t border-neutral-100 pt-1">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-neutral-600 transition hover:bg-neutral-50 hover:text-black"
                data-testid="logout-button"
              >
                <ArrowRightOnRectangle />
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default AccountNav
