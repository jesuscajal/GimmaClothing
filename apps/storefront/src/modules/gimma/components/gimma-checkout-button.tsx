"use client"

import { useState } from "react"
import { DemoCartLine } from "@lib/demo/whatsapp"
import { syncGimmaCartToCheckout } from "@lib/gimma/checkout"

type Props = {
  items: DemoCartLine[]
  countryCode: string
}

export default function GimmaCheckoutButton({ items, countryCode }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkoutItems = items
    .filter((i) => i.variantId)
    .map((i) => ({
      variantId: i.variantId!,
      quantity: i.quantity,
    }))

  const hasMissingVariants = items.some((i) => !i.variantId)

  const handleCheckout = async () => {
    setError(null)

    if (!checkoutItems.length) {
      setError(
        "Volvé a agregar los productos desde la tienda para habilitar el envío."
      )
      return
    }

    setLoading(true)
    try {
      await syncGimmaCartToCheckout(checkoutItems, countryCode)
    } catch {
      setError("No se pudo iniciar el checkout. Intentá de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || !items.length}
        className="flex w-full items-center justify-center rounded-lg border border-beige-300 bg-beige-50 py-4 text-sm font-medium text-black transition hover:border-beige-500 hover:bg-beige-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Preparando envío…" : "Continuar con envío"}
      </button>

      {hasMissingVariants && items.length > 0 && (
        <p className="mt-2 text-center text-xs text-amber-600">
          Algunos ítems son viejos: vaciá el carrito y volvé a cargarlos para
          enviar.
        </p>
      )}

      {error && (
        <p className="mt-2 text-center text-xs text-red-600">{error}</p>
      )}

      <p className="mt-2 text-center text-xs text-neutral-500">
        Dirección, envío a otras localidades y pago online
      </p>
    </div>
  )
}
