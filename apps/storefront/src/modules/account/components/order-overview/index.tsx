"use client"

import { Button } from "@modules/common/components/ui"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex w-full flex-col gap-y-6">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border-b border-neutral-100 pb-6 last:border-none last:pb-0"
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="flex w-full flex-col items-center gap-y-4 py-8 text-center"
      data-testid="no-orders-container"
    >
      <h2 className="font-serif text-xl font-semibold text-black">
        Todavía no hay pedidos
      </h2>
      <p className="max-w-sm text-sm text-neutral-600">
        Cuando compres en Gimma Clothing, vas a ver el historial acá.
      </p>
      <div className="mt-2">
        <LocalizedClientLink href="/inicio" passHref>
          <Button
            data-testid="continue-shopping-button"
            className="rounded-full bg-black text-white hover:bg-neutral-800"
          >
            Ir a la tienda
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
