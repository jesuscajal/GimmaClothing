import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  updateProductCategoriesWorkflow,
} from "@medusajs/medusa/core-flows"
import {
  classifyGarmentCategory,
  GIMMA_GARMENT_CATEGORIES,
} from "./lib/garment-categories"
import { normalizeCategoryName } from "./lib/catalog-import"

/**
 * Reorganiza categorías: de marcas (NINFA, NOIX…) a tipo de prenda
 * (Vestidos, Tops, Buzos…) según estándar de tiendas de ropa online.
 *
 * Uso: npm run reclassify:categories -w @dtc/backend
 */
export default async function reclassifyCategories({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productModule = container.resolve(Modules.PRODUCT)

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle", "is_active"],
  })

  const categoryByHandle = new Map(
    existingCategories.map((c: { handle: string; id: string }) => [
      c.handle.toLowerCase(),
      c,
    ])
  )

  logger.info("--- Creando categorías por tipo de prenda ---")

  for (const def of GIMMA_GARMENT_CATEGORIES) {
    if (categoryByHandle.has(def.handle)) {
      logger.info(`Ya existe: ${def.label} (${def.handle})`)
      continue
    }

    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: [
          {
            name: def.label,
            handle: def.handle,
            description: def.description,
            is_active: true,
          },
        ],
      },
    })

    const created = result[0]
    categoryByHandle.set(def.handle, created)
    logger.info(`Creada: ${def.label}`)
  }

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "metadata", "categories.id", "categories.handle", "categories.name"],
  })

  const assignments = new Map<string, string[]>()

  for (const product of products) {
    const title = product.title as string
    const garmentHandle = classifyGarmentCategory(title)
    const garmentCat = categoryByHandle.get(garmentHandle)

    if (!garmentCat) {
      logger.warn(`Sin categoría destino para: ${title}`)
      continue
    }

    const currentCategories = (product.categories ?? []) as {
      id: string
      handle?: string
      name?: string
    }[]

    const garmentHandles = new Set(
      GIMMA_GARMENT_CATEGORIES.map((g) => g.handle)
    )
    const legacyBrand = currentCategories.find(
      (c) => !garmentHandles.has((c.handle ?? "").toLowerCase())
    )
    const brand =
      normalizeCategoryName(legacyBrand?.name) ??
      (product.metadata as Record<string, string> | undefined)?.brand

    const metadata = {
      ...((product.metadata as Record<string, unknown>) ?? {}),
      ...(brand ? { brand } : {}),
    }

    await productModule.updateProducts(product.id, {
      category_ids: [garmentCat.id],
      metadata,
    })

    const list = assignments.get(garmentHandle) ?? []
    list.push(product.id)
    assignments.set(garmentHandle, list)

    logger.info(
      `${title} → ${garmentCat.name}${brand ? ` (marca: ${brand})` : ""}`
    )
  }

  logger.info("--- Desactivando categorías viejas por marca ---")

  const garmentHandles = new Set(
    GIMMA_GARMENT_CATEGORIES.map((g) => g.handle)
  )

  for (const cat of existingCategories) {
    const handle = ((cat.handle as string) ?? "").toLowerCase()
    if (garmentHandles.has(handle)) continue

    await updateProductCategoriesWorkflow(container).run({
      input: {
        selector: { id: cat.id },
        update: { is_active: false },
      },
    })
    logger.info(`Desactivada categoría antigua: ${cat.name}`)
  }

  logger.info("--- Resumen ---")
  for (const [handle, ids] of assignments) {
    const label =
      GIMMA_GARMENT_CATEGORIES.find((c) => c.handle === handle)?.label ?? handle
    logger.info(`${label}: ${ids.length} productos`)
  }

  logger.info(
    "Listo. Verificá en https://gimmaclothing.com/ar/tienda y en admin Medusa."
  )
}
