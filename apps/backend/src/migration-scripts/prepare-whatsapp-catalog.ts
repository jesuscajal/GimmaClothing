import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import * as fs from "fs"
import * as path from "path"
import {
  findWhatsAppChatFile,
  parseWhatsAppChat,
  readPriceList,
  whatsAppEntriesToCatalog,
  writeCatalogCsv,
} from "./lib/catalog-import"

/**
 * Lee el export de WhatsApp (chat .txt + fotos IMG-*.jpg) y genera import/precios.csv
 * uniendo precios del Excel si existe.
 *
 * Variables:
 *   IMPORT_WHATSAPP_DIR  carpeta con chat + fotos
 *   IMPORT_PRICE_FILE    Excel/CSV de precios (opcional)
 *   IMPORT_OUTPUT_CSV    salida (default: ../../import/precios.csv)
 *   IMPORT_FOTOS_DIR     copia fotos aquí (default: ../../import/fotos)
 *
 * Uso:
 *   npm run prepare:whatsapp -w @dtc/backend
 */
export default async function prepareWhatsAppCatalog({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const backendRoot = process.cwd()
  const repoRoot = path.resolve(backendRoot, "../..")

  const whatsappDir = path.resolve(
    backendRoot,
    process.env.IMPORT_WHATSAPP_DIR ||
      "../../apps/storefront/src/imgwhatsap"
  )
  const priceFile = process.env.IMPORT_PRICE_FILE
    ? path.resolve(backendRoot, process.env.IMPORT_PRICE_FILE)
    : path.join(repoRoot, "import/precios.xlsx")
  const outputCsv = path.resolve(
    backendRoot,
    process.env.IMPORT_OUTPUT_CSV || "../../import/precios.csv"
  )
  const fotosDir = path.resolve(
    backendRoot,
    process.env.IMPORT_FOTOS_DIR || "../../import/fotos"
  )

  const chatFile = findWhatsAppChatFile(whatsappDir)
  if (!chatFile) {
    throw new Error(
      `No se encontró el .txt del chat en ${whatsappDir}\n` +
        "Exportá el chat de WhatsApp sin multimedia y copiá el .txt junto a las fotos."
    )
  }

  const chatContent = fs.readFileSync(chatFile, "utf8")
  const entries = parseWhatsAppChat(chatContent)

  logger.info(`Chat: ${chatFile}`)
  logger.info(`Fotos en chat: ${entries.length}`)

  let prices = []
  if (fs.existsSync(priceFile)) {
    prices = readPriceList(priceFile)
    logger.info(`Precios Excel: ${priceFile} (${prices.length} filas)`)
  } else {
    logger.warn(
      `Sin Excel de precios (${priceFile}). El CSV saldrá con precio vacío.`
    )
  }

  const { rows, warnings } = whatsAppEntriesToCatalog(
    entries,
    whatsappDir,
    prices
  )

  fs.mkdirSync(fotosDir, { recursive: true })

  for (const row of rows) {
    const src = path.join(whatsappDir, row.foto)
    const dest = path.join(fotosDir, row.foto)
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest)
    }
  }

  writeCatalogCsv(
    outputCsv,
    rows.map((row) => ({
      nombre: row.nombre,
      precio: row.sinPrecio ? "" : row.precio,
      foto: row.foto,
      categoria: row.categoria,
    }))
  )

  const conPrecio = rows.filter((r) => !r.sinPrecio).length
  const sinPrecio = rows.filter((r) => r.sinPrecio).length
  const sinFoto = rows.filter((r) => r.sinFoto).length

  logger.info("--- Resultado ---")
  logger.info(`CSV generado: ${outputCsv}`)
  logger.info(`Fotos copiadas a: ${fotosDir}`)
  logger.info(`Con precio: ${conPrecio} | Sin precio: ${sinPrecio} | Sin foto: ${sinFoto}`)

  logger.info("--- Primeras 15 asociaciones ---")
  rows.slice(0, 15).forEach((row) => {
    const precio = row.sinPrecio ? "SIN PRECIO" : `$${row.precio}`
    logger.info(`${row.foto} → "${row.nombre}" | ${precio}`)
  })

  if (warnings.length) {
    logger.warn(`--- ${warnings.length} avisos ---`)
    warnings.slice(0, 30).forEach((w) => logger.warn(w))
    if (warnings.length > 30) {
      logger.warn(`... y ${warnings.length - 30} más`)
    }
  }

  if (sinPrecio > 0) {
    logger.warn(
      "Poné tu Excel en import/precios.xlsx y volvé a ejecutar para cruzar precios."
    )
  } else {
    logger.info(
      "Siguiente paso: npm run import:catalog -w @dtc/backend"
    )
  }
}
