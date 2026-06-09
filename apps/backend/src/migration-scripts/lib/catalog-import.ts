import * as fs from "fs"
import * as path from "path"

export type CatalogRow = {
  nombre: string
  precio: number
  categoria?: string
  descripcion?: string
  foto?: string
  talles: string[]
  colores: string[]
  rowNumber: number
}

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic"])

const HEADER_MAP: Record<string, keyof Omit<CatalogRow, "rowNumber" | "talles" | "colores">> = {
  nombre: "nombre",
  producto: "nombre",
  name: "nombre",
  title: "nombre",
  precio: "precio",
  price: "precio",
  valor: "precio",
  categoria: "categoria",
  category: "categoria",
  descripcion: "descripcion",
  description: "descripcion",
  foto: "foto",
  imagen: "foto",
  archivo: "foto",
  file: "foto",
  imagen_foto: "foto",
}

export function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

export function slugify(value: string) {
  return normalizeKey(value).replace(/\s+/g, "-")
}

export function parsePrice(raw: unknown): number | null {
  if (raw === null || raw === undefined || raw === "") return null
  if (typeof raw === "number" && !Number.isNaN(raw)) {
    return raw < 1000 ? Math.round(raw * 1000) : Math.round(raw)
  }

  const text = String(raw).trim()
  if (!text) return null

  const digits = text.replace(/[^\d]/g, "")
  if (!digits) return null

  const amount = Number(digits)
  return Number.isFinite(amount) ? amount : null
}

function splitList(raw: unknown): string[] {
  if (!raw) return []
  return String(raw)
    .split(/[,;|/]/)
    .map((v) => v.trim())
    .filter(Boolean)
}

function readRowsFromCsv(filePath: string): Record<string, string>[] {
  const content = fs.readFileSync(filePath, "utf8")
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  if (!lines.length) return []

  const delimiter = lines[0].includes(";") ? ";" : ","
  const headers = lines[0].split(delimiter).map((h) => normalizeKey(h))

  return lines.slice(1).map((line) => {
    const values = line.split(delimiter).map((v) => v.trim())
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] ?? ""
    })
    return row
  })
}

function readRowsFromXlsx(filePath: string): Record<string, string>[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const XLSX = require("xlsx") as typeof import("xlsx")
  const workbook = XLSX.readFile(filePath)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  })

  return json.map((row) => {
    const mapped: Record<string, string> = {}
    for (const [key, value] of Object.entries(row)) {
      mapped[normalizeKey(key)] = String(value ?? "").trim()
    }
    return mapped
  })
}

export function readCatalog(filePath: string): CatalogRow[] {
  const ext = path.extname(filePath).toLowerCase()
  const rawRows =
    ext === ".csv"
      ? readRowsFromCsv(filePath)
      : readRowsFromXlsx(filePath)

  const rows: CatalogRow[] = []

  rawRows.forEach((raw, index) => {
    const mapped: Partial<CatalogRow> = { rowNumber: index + 2 }

    for (const [header, value] of Object.entries(raw)) {
      const field = HEADER_MAP[header]
      if (!field) continue
      if (field === "precio") {
        const parsed = parsePrice(value)
        if (parsed !== null) mapped.precio = parsed
      } else {
        mapped[field] = value
      }
    }

    const talles = splitList(raw.talles || raw.talle || raw.sizes || raw.size)
    const colores = splitList(raw.colores || raw.color || raw.colors)

    if (!mapped.nombre || !mapped.precio) return

    rows.push({
      nombre: mapped.nombre,
      precio: mapped.precio!,
      categoria: mapped.categoria,
      descripcion: mapped.descripcion,
      foto: mapped.foto,
      talles: talles.length ? talles : ["Único"],
      colores: colores.length ? colores : ["Único"],
      rowNumber: mapped.rowNumber!,
    })
  })

  return rows
}

export function listPhotos(photosDir: string) {
  if (!fs.existsSync(photosDir)) return []

  return fs
    .readdirSync(photosDir)
    .filter((file) => IMAGE_EXT.has(path.extname(file).toLowerCase()))
    .map((file) => ({
      file,
      base: path.parse(file).name,
      key: normalizeKey(path.parse(file).name),
      fullPath: path.join(photosDir, file),
    }))
}

export function findPhoto(
  photos: ReturnType<typeof listPhotos>,
  row: CatalogRow
) {
  if (row.foto) {
    const explicit = photos.find(
      (p) =>
        p.file.toLowerCase() === row.foto!.toLowerCase() ||
        p.base.toLowerCase() === row.foto!.toLowerCase()
    )
    if (explicit) return explicit
  }

  const nameKey = normalizeKey(row.nombre)

  const exact = photos.find((p) => p.key === nameKey)
  if (exact) return exact

  const contains = photos.find(
    (p) => p.key.includes(nameKey) || nameKey.includes(p.key)
  )
  return contains ?? null
}

export type WhatsAppPhotoEntry = {
  file: string
  nombre: string
  chatLine: number
}

const WA_ATTACHMENT_RE =
  /(IMG-\d{8}-WA\d{4}\.[a-z0-9]+)\s*\(archivo adjunto\)/i
const WA_DATE_LINE_RE = /^\d{1,2}\/\d{1,2}\/\d{4}/

function isChatMetaLine(line: string) {
  const trimmed = line.trim()
  return (
    !trimmed ||
    trimmed.includes("Se eliminó este mensaje") ||
    trimmed.includes("cifrados de extremo a extremo") ||
    trimmed.includes("creó el grupo") ||
    trimmed.includes("te añadió") ||
    trimmed.includes("Se te añadió")
  )
}

function extractNameAfterAttachment(line: string) {
  const parts = line.split(/\(archivo adjunto\)/i)
  const after = parts[1]?.trim() ?? ""
  if (!after || WA_DATE_LINE_RE.test(after)) return ""
  return after
}

function readNameFromFollowingLines(lines: string[], startIndex: number) {
  for (let j = startIndex + 1; j < lines.length; j++) {
    const next = lines[j].trim()
    if (!next || isChatMetaLine(next)) continue
    if (WA_DATE_LINE_RE.test(next) || WA_ATTACHMENT_RE.test(next)) break
    const colonIdx = next.indexOf(": ")
    const candidate =
      colonIdx >= 0 && WA_DATE_LINE_RE.test(next.slice(0, colonIdx + 2))
        ? next.slice(colonIdx + 2).trim()
        : next
    if (candidate && !WA_ATTACHMENT_RE.test(candidate)) return candidate
  }
  return ""
}

export function parseWhatsAppChat(content: string): WhatsAppPhotoEntry[] {
  const lines = content.split(/\r?\n/)
  const entries: WhatsAppPhotoEntry[] = []

  lines.forEach((line, index) => {
    const match = line.match(WA_ATTACHMENT_RE)
    if (!match) return

    const file = match[1]
    const inlineName = extractNameAfterAttachment(line)
    const nombre =
      inlineName || readNameFromFollowingLines(lines, index) || ""

    entries.push({
      file,
      nombre: nombre.trim(),
      chatLine: index + 1,
    })
  })

  return entries
}

export function findWhatsAppChatFile(dir: string) {
  if (!fs.existsSync(dir)) return null

  const chat = fs
    .readdirSync(dir)
    .find(
      (file) =>
        file.toLowerCase().endsWith(".txt") &&
        file.toLowerCase().includes("chat")
    )

  return chat ? path.join(dir, chat) : null
}

export type PriceRow = {
  nombre: string
  precio: number
  categoria?: string
  raw: Record<string, string>
}

export function readPriceList(filePath: string): PriceRow[] {
  const ext = path.extname(filePath).toLowerCase()
  const rawRows =
    ext === ".csv" ? readRowsFromCsv(filePath) : readRowsFromXlsx(filePath)

  const rows: PriceRow[] = []

  for (const raw of rawRows) {
    let nombre = ""
    let precio: number | null = null
    let categoria: string | undefined

    for (const [header, value] of Object.entries(raw)) {
      const field = HEADER_MAP[header]
      if (field === "nombre" && value) nombre = value
      if (field === "precio") precio = parsePrice(value)
      if (field === "categoria" && value) categoria = value
    }

    if (!nombre || precio === null) continue
    rows.push({ nombre, precio, categoria, raw })
  }

  return rows
}

function priceMatchScore(a: string, b: string) {
  const left = normalizeKey(a)
  const right = normalizeKey(b)
  if (!left || !right) return 0
  if (left === right) return 100
  if (left.includes(right) || right.includes(left)) return 80

  const leftTokens = new Set(left.split(" ").filter(Boolean))
  const rightTokens = new Set(right.split(" ").filter(Boolean))
  let shared = 0
  leftTokens.forEach((token) => {
    if (rightTokens.has(token)) shared += 1
  })

  if (!shared) return 0
  return Math.round(
    (shared / Math.max(leftTokens.size, rightTokens.size)) * 70
  )
}

export function matchPriceForName(
  nombre: string,
  prices: PriceRow[]
): PriceRow | null {
  let best: PriceRow | null = null
  let bestScore = 0

  for (const row of prices) {
    const score = priceMatchScore(nombre, row.nombre)
    if (score > bestScore) {
      bestScore = score
      best = row
    }
  }

  return bestScore >= 70 ? best : null
}

export function whatsAppEntriesToCatalog(
  entries: WhatsAppPhotoEntry[],
  photosDir: string,
  prices: PriceRow[] = []
): {
  rows: Array<CatalogRow & { foto: string; sinPrecio?: boolean; sinFoto?: boolean }>
  warnings: string[]
} {
  const photos = listPhotos(photosDir)
  const photoSet = new Set(photos.map((p) => p.file.toLowerCase()))
  const warnings: string[] = []
  const rows: Array<
    CatalogRow & { foto: string; sinPrecio?: boolean; sinFoto?: boolean }
  > = []

  const usedFiles = new Map<string, string>()

  entries.forEach((entry, index) => {
    const nombre = entry.nombre || `Producto ${entry.file}`
    const hasPhoto = photoSet.has(entry.file.toLowerCase())

    if (!entry.nombre) {
      warnings.push(
        `Línea ${entry.chatLine}: ${entry.file} sin nombre en el chat`
      )
    }

    if (!hasPhoto) {
      warnings.push(`Falta imagen en carpeta: ${entry.file}`)
    }

    if (usedFiles.has(entry.file)) {
      warnings.push(
        `Duplicado ${entry.file}: antes "${usedFiles.get(entry.file)}", ahora "${nombre}"`
      )
    }
    usedFiles.set(entry.file, nombre)

    const priceMatch = matchPriceForName(nombre, prices)

    rows.push({
      nombre,
      precio: priceMatch?.precio ?? 0,
      categoria: priceMatch?.categoria,
      foto: entry.file,
      talles: ["Único"],
      colores: ["Único"],
      rowNumber: index + 2,
      sinPrecio: !priceMatch,
      sinFoto: !hasPhoto,
    })
  })

  return { rows, warnings }
}

export function writeCatalogCsv(
  filePath: string,
  rows: Array<{
    nombre: string
    precio: number | string
    foto: string
    categoria?: string
  }>
) {
  const header = "nombre,precio,foto,categoria"
  const body = rows.map((row) => {
    const nombre = `"${row.nombre.replace(/"/g, '""')}"`
    const precio = row.precio === 0 ? "" : String(row.precio)
    const categoria = row.categoria ? `"${row.categoria.replace(/"/g, '""')}"` : ""
    return `${nombre},${precio},${row.foto},${categoria}`
  })

  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, [header, ...body].join("\n"), "utf8")
}

export type MatchPreview = {
  row: CatalogRow
  photo: ReturnType<typeof listPhotos>[number] | null
  status: "ok" | "sin_foto" | "sin_precio"
}

export function previewMatches(
  catalogFile: string,
  photosDir: string
): MatchPreview[] {
  const rows = readCatalog(catalogFile)
  const photos = listPhotos(photosDir)

  return rows.map((row) => ({
    row,
    photo: findPhoto(photos, row),
    status: findPhoto(photos, row) ? "ok" : "sin_foto",
  }))
}
