import { HttpTypes } from "@medusajs/types"
import { GimmaVariant } from "./types"

function variantOptionValue(
  variant: HttpTypes.StoreProductVariant,
  title: string
): string | undefined {
  return variant.options?.find(
    (o) => o.option?.title?.toLowerCase() === title.toLowerCase()
  )?.value
}

export function mapGimmaVariants(
  product: HttpTypes.StoreProduct
): GimmaVariant[] {
  return (
    product.variants
      ?.filter((v) => v.id)
      .map((v) => ({
        id: v.id!,
        size: variantOptionValue(v, "size") ?? "U",
        color: variantOptionValue(v, "color"),
      })) ?? []
  )
}

export function resolveVariantId(
  variants: GimmaVariant[],
  size: string,
  color: string
): string | undefined {
  const normalizedColor = color === "Único" ? undefined : color

  return variants.find((v) => {
    if (v.size !== size) return false
    if (!v.color) return !normalizedColor
    return v.color === normalizedColor || v.color === color
  })?.id
}
