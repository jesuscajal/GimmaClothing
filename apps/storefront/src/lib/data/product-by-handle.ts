"use server"

import { listProducts } from "./products"

export async function getProductByHandle(
  handle: string,
  countryCode: string
) {
  const { response } = await listProducts({
    countryCode,
    queryParams: {
      handle,
      limit: 1,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*categories,*images",
    },
  })
  return response.products[0] ?? null
}
