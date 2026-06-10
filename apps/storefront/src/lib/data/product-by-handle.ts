"use server"

import { listProducts } from "./products"

export async function getProductByHandle(
  handle: string,
  countryCode: string,
  revalidate = 60
) {
  const { response } = await listProducts({
    countryCode,
    revalidate,
    queryParams: {
      handle,
      limit: 1,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+variants.options,+variants.options.option,+metadata,+tags,*categories,*images",
    },
  })
  return response.products[0] ?? null
}
