import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import * as fs from "fs"
import * as path from "path"

type ApiKeyRow = {
  id?: string
  token?: string
  type?: string
  title?: string
}

const ENV_VARS: Record<string, string> = {
  NEXT_PUBLIC_MEDUSA_BACKEND_URL: "http://localhost:9000",
  NEXT_PUBLIC_DEFAULT_REGION: "ar",
  NEXT_PUBLIC_BASE_URL: "http://localhost:8000",
  NEXT_PUBLIC_GIMMA_ROOT: "production",
  NODE_ENV: "development",
}

function upsertEnvFile(filePath: string, updates: Record<string, string>) {
  const lines: string[] = []
  const seen = new Set<string>()

  if (fs.existsSync(filePath)) {
    for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=/)
      if (match && updates[match[1]] !== undefined) {
        lines.push(`${match[1]}=${updates[match[1]]}`)
        seen.add(match[1])
      } else {
        lines.push(line)
      }
    }
  }

  for (const [key, value] of Object.entries(updates)) {
    if (!seen.has(key)) {
      if (lines.length && lines[lines.length - 1] !== "") {
        lines.push("")
      }
      lines.push(`${key}=${value}`)
    }
  }

  const content = lines.join("\n").replace(/\n*$/, "\n")
  fs.writeFileSync(filePath, content, "utf8")
}

/**
 * Lee la publishable key de PostgreSQL y actualiza apps/storefront/.env.local
 *
 * Uso: npm run env:sync -w @dtc/backend
 */
export default async function syncStorefrontEnv({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: keys } = await query.graph({
    entity: "api_key",
    fields: ["id", "title", "token", "type"],
  })

  const publishable = (keys as ApiKeyRow[]).find((k) => k.type === "publishable")

  if (!publishable?.token) {
    throw new Error(
      "No hay publishable API key en la DB. Ejecutá primero: npm run db:setup"
    )
  }

  const envPath = path.resolve(process.cwd(), "../storefront/.env.local")
  const updates = {
    ...ENV_VARS,
    NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: publishable.token,
  }

  upsertEnvFile(envPath, updates)

  logger.info("============================================")
  logger.info("Storefront conectado a la base de datos")
  logger.info(`Archivo: ${envPath}`)
  logger.info(`Publishable key: ${publishable.token}`)
  logger.info(`Región: ar | GIMMA_ROOT: production`)
  logger.info("Reiniciá el storefront: npm run storefront:dev")
  logger.info("============================================")
}
