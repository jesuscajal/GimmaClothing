import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import ChevronDown from "@modules/common/icons/chevron-down"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const profileCompletion = getProfileCompletion(customer)

  return (
    <div data-testid="overview-page-wrapper">
      <div className="flex flex-col gap-4 border-b border-neutral-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className="font-serif text-2xl font-semibold text-black"
            data-testid="welcome-message"
            data-value={customer?.first_name}
          >
            Hola, {customer?.first_name}
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Sesión iniciada como{" "}
            <span className="font-medium text-black" data-testid="customer-email">
              {customer?.email}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-neutral-50 p-5">
          <h3 className="text-sm font-semibold text-black">Perfil</h3>
          <div className="mt-3 flex items-end gap-2">
            <span
              className="font-serif text-4xl font-semibold leading-none text-[#A89578]"
              data-testid="customer-profile-completion"
              data-value={profileCompletion}
            >
              {profileCompletion}%
            </span>
            <span className="text-sm text-neutral-500">completo</span>
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-50 p-5">
          <h3 className="text-sm font-semibold text-black">Direcciones</h3>
          <div className="mt-3 flex items-end gap-2">
            <span
              className="font-serif text-4xl font-semibold leading-none text-[#A89578]"
              data-testid="addresses-count"
              data-value={customer?.addresses?.length || 0}
            >
              {customer?.addresses?.length || 0}
            </span>
            <span className="text-sm text-neutral-500">guardadas</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-serif text-lg font-semibold text-black">
          Pedidos recientes
        </h3>
        <ul className="mt-4 flex flex-col gap-y-3" data-testid="orders-wrapper">
          {orders && orders.length > 0 ? (
            orders.slice(0, 5).map((order) => (
              <li key={order.id} data-testid="order-wrapper" data-value={order.id}>
                <LocalizedClientLink
                  href={`/account/orders/details/${order.id}`}
                  className="block rounded-2xl border border-neutral-100 bg-neutral-50 p-4 transition hover:border-neutral-300"
                >
                  <div className="grid flex-1 grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-neutral-500">Fecha</p>
                      <p
                        className="font-medium text-black"
                        data-testid="order-created-date"
                      >
                        {new Date(order.created_at).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Pedido</p>
                      <p
                        className="font-medium text-black"
                        data-testid="order-id"
                        data-value={order.display_id}
                      >
                        #{order.display_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Total</p>
                      <p className="font-medium text-black" data-testid="order-amount">
                        {convertToLocale({
                          amount: order.total,
                          currency_code: order.currency_code,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-end">
                      <ChevronDown className="-rotate-90 text-neutral-400" />
                      <span className="sr-only">
                        Ver pedido #{order.display_id}
                      </span>
                    </div>
                  </div>
                </LocalizedClientLink>
              </li>
            ))
          ) : (
            <li
              className="rounded-2xl bg-neutral-50 p-6 text-center text-sm text-neutral-600"
              data-testid="no-orders-message"
            >
              Todavía no tenés pedidos
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) count++
  if (customer.first_name && customer.last_name) count++
  if (customer.phone) count++

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )
  if (billingAddress) count++

  return (count / 4) * 100
}

export default Overview
