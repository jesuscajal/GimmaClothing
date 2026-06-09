"use server"

import {
  addToCart,
  deleteLineItem,
  getOrSetCart,
  retrieveCart,
} from "@lib/data/cart"
import { redirect } from "next/navigation"

type CheckoutLine = {
  variantId: string
  quantity: number
}

/**
 * Copia el carrito Gimma (local) al carrito Medusa y abre el checkout con envío.
 */
export async function syncGimmaCartToCheckout(
  items: CheckoutLine[],
  countryCode: string
) {
  if (!items.length) {
    throw new Error("El carrito está vacío")
  }

  const cart = await getOrSetCart(countryCode)
  if (!cart?.id) {
    throw new Error("No se pudo crear el carrito de envío")
  }

  const full = await retrieveCart(cart.id, "*items")
  if (full?.items?.length) {
    for (const line of full.items) {
      if (line.id) {
        await deleteLineItem(line.id)
      }
    }
  }

  for (const item of items) {
    await addToCart({
      variantId: item.variantId,
      quantity: item.quantity,
      countryCode,
    })
  }

  redirect(`/${countryCode}/checkout`)
}
