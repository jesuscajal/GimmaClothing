import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows"
import * as fs from "fs"
import * as path from "path"
import {
  findPhoto,
  listPhotos,
  previewMatches,
  readCatalog,
  slugify,
} from "./lib/catalog-import"

/**
 * Importa catálogo desde Excel/CSV + carpeta de fotos (WhatsApp).
 *
 * Estructura:
 *   import/precios.xlsx   (o .csv)
 *   import/fotos/         (imágenes nombradas igual que el producto)
 *
 * Variables de entorno:
 *   IMPORT_CATALOG_FILE      ruta al Excel/CSV (default: ../../import/precios.xlsx)
 *   IMPORT_PHOTOS_DIR        carpeta de fotos (default: ../../import/fotos)
 *   IMPORT_PUBLIC_DIR        destino público (default: ../../apps/storefront/public/catalog)
 *   IMPORT_CATALOG_BASE_URL  URL base para imágenes (default: https://gimmaclothing.com)
 *   IMPORT_DRY_RUN=true      solo muestra coincidencias, no crea productos
 *   IMPORT_DEFAULT_STOCK=50  stock inicial por variante
 *
 * Uso:
 *   npm run import:catalog -w @dtc/backend
 *   IMPORT_DRY_RUN=true npm run import:catalog -w @dtc/backend
 */
export default async function importCatalog({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const backendRoot = process.cwd()
  const repoRoot = path.resolve(backendRoot, "../..")

  const catalogFile = path.resolve(
    backendRoot,
    process.env.IMPORT_CATALOG_FILE || "../../import/precios.csv"
  )
  const photosDir = path.resolve(
    backendRoot,
    process.env.IMPORT_PHOTOS_DIR || "../../import/fotos"
  )
  const publicDir = path.resolve(
    backendRoot,
    process.env.IMPORT_PUBLIC_DIR || "../../apps/storefront/public/catalog"
  )
  const baseUrl = (
    process.env.IMPORT_CATALOG_BASE_URL || "https://gimmaclothing.com"
  ).replace(/\/$/, "")
  const dryRun = process.env.IMPORT_DRY_RUN === "true"
  const defaultStock = Number(process.env.IMPORT_DEFAULT_STOCK || "50")

  if (!fs.existsSync(catalogFile)) {
    throw new Error(
      `No se encontró el archivo de precios: ${catalogFile}\n` +
        "Ejecutá npm run prepare:whatsapp o copiá import/precios.csv"
    )
  }

  const matches = previewMatches(catalogFile, photosDir)
  const photos = listPhotos(photosDir)

  logger.info(`Archivo: ${catalogFile}`)
  logger.info(`Fotos:   ${photosDir} (${photos.length} archivos)`)
  logger.info(`Destino: ${publicDir}`)
  logger.info("--- Vista previa ---")

  for (const match of matches) {
    const photoName = match.photo?.file ?? "SIN FOTO"
    logger.info(
      `[fila ${match.row.rowNumber}] ${match.row.nombre} | $${match.row.precio} | ${photoName}`
    )
  }

  const unmatchedPhotos = photos.filter(
    (photo) =>
      !matches.some(
        (match) => match.photo?.file.toLowerCase() === photo.file.toLowerCase()
      )
  )

  if (unmatchedPhotos.length) {
    logger.warn("--- Fotos sin producto en Excel ---")
    unmatchedPhotos.forEach((photo) => logger.warn(`  ${photo.file}`))
  }

  const ready = matches.filter((m) => m.photo)
  const missing = matches.filter((m) => !m.photo)

  if (missing.length) {
    logger.warn(`--- ${missing.length} productos sin foto ---`)
    missing.forEach((m) =>
      logger.warn(`  fila ${m.row.rowNumber}: ${m.row.nombre}`)
    )
  }

  if (dryRun) {
    logger.info(
      `DRY RUN: ${ready.length} listos, ${missing.length} sin foto. No se creó nada.`
    )
    return
  }

  if (!ready.length) {
    throw new Error("No hay productos con foto para importar.")
  }

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfiles[0]
  if (!shippingProfile) {
    throw new Error("No hay shipping profile. Ejecutá db:setup primero.")
  }

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const salesChannel = salesChannels[0]
  if (!salesChannel) {
    throw new Error("No hay sales channel configurado.")
  }

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "title"],
  })

  const existingHandles = new Set(
    existingProducts.map((p: { handle?: string }) => p.handle)
  )

  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  })

  const categoryByName = new Map(
    categories.map((c: { id: string; name: string }) => [
      c.name.toLowerCase(),
      c.id,
    ])
  )

  fs.mkdirSync(publicDir, { recursive: true })

  const productsToCreate = []

  for (const match of ready) {
    const { row, photo } = match
    const handle = slugify(row.nombre)

    if (existingHandles.has(handle)) {
      logger.info(`Omitiendo "${row.nombre}" (ya existe: ${handle})`)
      continue
    }

    let categoryId: string | undefined
    if (row.categoria) {
      const key = row.categoria.toLowerCase()
      categoryId = categoryByName.get(key)
      if (!categoryId) {
        const { result } = await createProductCategoriesWorkflow(container).run({
          input: {
            product_categories: [
              { name: row.categoria, is_active: true },
            ],
          },
        })
        categoryId = result[0].id
        categoryByName.set(key, categoryId)
        logger.info(`Categoría creada: ${row.categoria}`)
      }
    }

    const ext = path.extname(photo!.file).toLowerCase() || ".jpg"
    const publicName = `${handle}${ext}`
    const publicPath = path.join(publicDir, publicName)
    fs.copyFileSync(photo!.fullPath, publicPath)

    const imageUrl = `${baseUrl}/catalog/${publicName}`
    const hasSize = row.talles.length > 1 || row.talles[0] !== "Único"
    const hasColor = row.colores.length > 1 || row.colores[0] !== "Único"

    const options = []
    if (hasSize) {
      options.push({ title: "Size", values: row.talles })
    }
    if (hasColor) {
      options.push({ title: "Color", values: row.colores })
    }

    const variants = []
    const sizes = hasSize ? row.talles : ["Único"]
    const colors = hasColor ? row.colores : ["Único"]

    let variantIndex = 0
    for (const size of sizes) {
      for (const color of colors) {
        variantIndex += 1
        const parts = [size, color].filter((p) => p !== "Único")
        const title = parts.length ? parts.join(" / ") : "Único"
        const optionValues: Record<string, string> = {}
        if (hasSize) optionValues.Size = size
        if (hasColor) optionValues.Color = color

        variants.push({
          title,
          sku: `GIMMA-${handle}-${variantIndex}`.toUpperCase().slice(0, 50),
          options: optionValues,
          prices: [{ amount: row.precio, currency_code: "ars" }],
        })
      }
    }

    productsToCreate.push({
      title: row.nombre,
      handle,
      description:
        row.descripcion ||
        `${row.nombre}. Consultá talles y colores disponibles.`,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: categoryId ? [categoryId] : undefined,
      images: [{ url: imageUrl }],
      options: options.length ? options : undefined,
      variants,
      sales_channels: [{ id: salesChannel.id }],
    })
  }

  if (!productsToCreate.length) {
    logger.info("No hay productos nuevos para crear.")
    return
  }

  logger.info(`Creando ${productsToCreate.length} productos...`)

  await createProductsWorkflow(container).run({
    input: { products: productsToCreate },
  })

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })
  const stockLocation = stockLocations[0]
  if (!stockLocation) {
    throw new Error("No hay stock location configurada.")
  }

  const createdHandles = new Set(productsToCreate.map((p) => p.handle))
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  })

  const newSkus = new Set(
    productsToCreate.flatMap((p) => p.variants.map((v) => v.sku))
  )

  const levels = inventoryItems
    .filter((item: { sku?: string }) => item.sku && newSkus.has(item.sku))
    .map((item: { id: string }) => ({
      location_id: stockLocation.id,
      inventory_item_id: item.id,
      stocked_quantity: defaultStock,
    }))

  if (levels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: levels },
    })
  }

  logger.info("--- Importación completada ---")
  logger.info(`Productos creados: ${productsToCreate.length}`)
  logger.info(`Handles: ${[...createdHandles].join(", ")}`)
  logger.info(
    "Verificá en https://gimmaclothing.com/ar/tienda y en el admin Medusa."
  )
}
