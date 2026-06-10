import { Button } from "@modules/common/components/ui"
import { useMemo } from "react"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  return (
    <div
      className="flex flex-col rounded-2xl bg-neutral-50 p-4"
      data-testid="order-card"
    >
      <div className="mb-1 font-serif text-lg font-semibold text-black">
        #<span data-testid="order-display-id">{order.display_id}</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-600">
        <span data-testid="order-created-at">
          {new Date(order.created_at).toLocaleDateString("es-AR")}
        </span>
        <span aria-hidden>·</span>
        <span className="font-medium text-black" data-testid="order-amount">
          {convertToLocale({
            amount: order.total,
            currency_code: order.currency_code,
          })}
        </span>
        <span aria-hidden>·</span>
        <span>{`${numberOfLines} ${
          numberOfLines === 1 ? "artículo" : "artículos"
        }`}</span>
      </div>
      <div className="my-4 grid grid-cols-2 gap-4 small:grid-cols-4">
        {order.items?.slice(0, 3).map((i) => (
          <div key={i.id} className="flex flex-col gap-y-2" data-testid="order-item">
            <Thumbnail thumbnail={i.thumbnail} images={[]} size="full" />
            <div className="flex items-center text-sm text-neutral-700">
              <span className="font-medium text-black" data-testid="item-title">
                {i.title}
              </span>
              <span className="ml-2">x</span>
              <span data-testid="item-quantity">{i.quantity}</span>
            </div>
          </div>
        ))}
        {numberOfProducts > 4 && (
          <div className="flex h-full w-full flex-col items-center justify-center text-sm text-neutral-500">
            <span>+ {numberOfLines - 4}</span>
            <span>más</span>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
          <Button
            data-testid="order-details-link"
            variant="secondary"
            className="rounded-full"
          >
            Ver detalle
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
