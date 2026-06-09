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
