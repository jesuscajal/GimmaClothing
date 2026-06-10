import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { stripOuterQuotes } from "./lib/catalog-import"

/**
 * Quita comillas de los títulos de productos ya importados en Medusa.
 *
 * Uso: npm run fix:quotes -w @dtc/backend
 */
export default async function fixProductQuotes({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productModule = container.resolve(Modules.PRODUCT)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title"],
  })

  let updated = 0

  for (const product of products) {
    const title = product.title as string
    const cleaned = stripOuterQuotes(title)

    if (!cleaned || cleaned === title) continue

    await productModule.updateProducts(product.id, { title: cleaned })
    logger.info(`"${title}" → "${cleaned}"`)
    updated += 1
  }

  logger.info(`Productos actualizados: ${updated}`)
}
