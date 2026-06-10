import React from "react"

import AccountNav from "../components/account-nav"
import GimmaBrandTitle from "@modules/demo/components/gimma-brand-title"
import { gimmaConfig } from "@lib/gimma/config"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  const whatsappUrl = `https://wa.me/${gimmaConfig.whatsapp}`

  return (
    <div className="bg-neutral-300" data-testid="account-page">
      <div className="mx-auto max-w-6xl px-4 py-8 pb-12 sm:px-6">
        <div className="text-center">
          <GimmaBrandTitle size="md" className="mb-3" />
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-black sm:text-4xl">
            Mi cuenta
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Gestioná tu perfil, pedidos y direcciones en Gimma Clothing
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr] lg:gap-8">
          {customer && (
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <AccountNav customer={customer} />
            </aside>
          )}
          <div className="min-w-0 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            {children}
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h3 className="font-serif text-lg font-semibold text-black">
              ¿Necesitás ayuda?
            </h3>
            <p className="mt-1 text-sm text-neutral-600">
              Escribinos por WhatsApp y te ayudamos con tu pedido o tu cuenta.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex shrink-0 items-center justify-center rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 sm:mt-0"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
