#!/usr/bin/env node
/**
 * Asocia fotos IMG-*.jpg con nombres del export de WhatsApp (.txt)
 * y genera import/precios.csv (cruza con import/precios.xlsx si existe).
 *
 * Uso: node import/prepare-whatsapp.mjs
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(__dirname, "..")

const WHATSAPP_DIR =
  process.env.IMPORT_WHATSAPP_DIR ||
  path.join(REPO, "apps/storefront/src/imgwhatsap")
const PRICE_FILE =
  process.env.IMPORT_PRICE_FILE || path.join(REPO, "import/stock-gimma.csv")
const OUTPUT_CSV = process.env.IMPORT_OUTPUT_CSV || path.join(REPO, "import/precios.csv")
const FOTOS_DIR = process.env.IMPORT_FOTOS_DIR || path.join(REPO, "import/fotos")

const WA_ATTACHMENT_RE = /(IMG-\d{8}-WA\d{4}\.[a-z0-9]+)\s*\(archivo adjunto\)/i
const WA_DATE_LINE_RE = /^\d{1,2}\/\d{1,2}\/\d{4}/

function normalizeKey(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

/** Nombres del chat → términos de búsqueda en el stock */
function expandWhatsAppName(nombre) {
  const key = normalizeKey(nombre)
  const variants = [key]

  const aliases = {
    "vestido danielli": "vestido danielle",
    "carterita mini bag": "cartera",
    "puperas argentina": "camisetas argentinas",
    "remeras musculosa": "remera microfibra",
    "musculosas": "remera microfibra cruzado",
    "body micro encaje": "top microfibra encaje lazo",
    "vestido largo indi": "vestido",
    "short micro": "short gamuzado",
    "top bruche pico": "top",
    "manga larga a rayas": "remera microfibra",
    "remeras a rayas": "remera microfibra",
  }

  if (aliases[key]) variants.push(aliases[key])

  const piluso = key.match(/^piluso\s+(.+)$/)
  if (piluso) {
    const color = piluso[1]
    if (color.includes("animal") || color.includes("print")) {
      variants.push("piluso nordico print")
    } else {
      variants.push("piluso nordico liso")
    }
  }

  return [...new Set(variants)]
}

function isMeta(line) {
  const t = line.trim()
  return (
    !t ||
    t.includes("Se eliminó este mensaje") ||
    t.includes("cifrados de extremo a extremo") ||
    t.includes("creó el grupo") ||
    t.includes("te añadió")
  )
}

function parseWhatsAppChat(content) {
  const lines = content.split(/\r?\n/)
  const entries = []

  lines.forEach((line, index) => {
    const match = line.match(WA_ATTACHMENT_RE)
    if (!match) return

    const file = match[1]
    let nombre = ""

    const after = line.split(/\(archivo adjunto\)/i)[1]?.trim() ?? ""
    if (after && !WA_DATE_LINE_RE.test(after)) nombre = after

    if (!nombre) {
      for (let j = index + 1; j < lines.length; j++) {
        const next = lines[j].trim()
        if (!next || isMeta(next)) continue
        if (WA_DATE_LINE_RE.test(next) || WA_ATTACHMENT_RE.test(next)) break
        const colon = next.indexOf(": ")
        nombre =
          colon >= 0 && WA_DATE_LINE_RE.test(next.slice(0, colon + 2))
            ? next.slice(colon + 2).trim()
            : next
        break
      }
    }

    entries.push({ file, nombre: nombre.trim(), chatLine: index + 1 })
  })

  return entries
}

function findChatFile(dir) {
  if (!fs.existsSync(dir)) return null
  const file = fs
    .readdirSync(dir)
    .find((f) => f.toLowerCase().endsWith(".txt") && f.toLowerCase().includes("chat"))
  return file ? path.join(dir, file) : null
}

function parsePrice(raw) {
  if (raw === null || raw === undefined || raw === "") return null
  if (typeof raw === "number") return raw < 1000 ? Math.round(raw * 1000) : Math.round(raw)
  const digits = String(raw).replace(/[^\d]/g, "")
  return digits ? Number(digits) : null
}

function readGimmaStockCsv(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/).filter(Boolean)
  const byProduct = new Map()

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(";")
    if (parts.length < 6) continue

    const codigo = parts[0]?.trim() ?? ""
    const producto = parts[1]?.trim() ?? ""
    const color = parts[2]?.trim() ?? ""
    const precioVenta = parsePrice(parts[5])
    const costo = parsePrice(parts[4])
    const precio = precioVenta ?? (costo ? Math.round(costo * 1.4) : null)

    if (!producto || precio === null) continue

    const marca = codigo.replace(/^\d+\s*/, "").trim()
    const key = normalizeKey(producto)
    const row =
      byProduct.get(key) ||
      {
        nombre: producto.replace(/\s+/g, " ").trim(),
        precios: [],
        categoria: marca || undefined,
      }

    row.precios.push(precio)
    byProduct.set(key, row)
  }

  return [...byProduct.values()].map((row) => ({
    nombre: row.nombre,
    precio: Math.min(...row.precios),
    precioMax: Math.max(...row.precios),
    categoria: row.categoria,
  }))
}

function readPriceList(filePath) {
  if (!fs.existsSync(filePath)) return []
  const ext = path.extname(filePath).toLowerCase()
  if (ext === ".csv") {
    const firstLine = fs.readFileSync(filePath, "utf8").split(/\r?\n/)[0] || ""
    if (firstLine.includes("Producto") && firstLine.includes(";")) {
      return readGimmaStockCsv(filePath)
    }
  }
  return readPricesXlsx(filePath)
}

function readPricesXlsx(filePath) {
  let XLSX
  try {
    XLSX = require(path.join(REPO, "apps/backend/node_modules/xlsx"))
  } catch {
    XLSX = require("xlsx")
  }
  const wb = XLSX.readFile(filePath)
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const json = XLSX.utils.sheet_to_json(sheet, { defval: "" })

  const mapHeader = {
    nombre: "nombre",
    producto: "nombre",
    prenda: "nombre",
    descripcion: "nombre",
    precio: "precio",
    price: "precio",
    valor: "precio",
    categoria: "categoria",
  }

  return json
    .map((row) => {
      const mapped = {}
      for (const [key, value] of Object.entries(row)) {
        const field = mapHeader[normalizeKey(key).replace(/\s+/g, "_")] || mapHeader[normalizeKey(key)]
        if (field) mapped[field] = String(value).trim()
      }
      const precio = parsePrice(mapped.precio)
      if (!mapped.nombre || precio === null) return null
      return { nombre: mapped.nombre, precio, categoria: mapped.categoria }
    })
    .filter(Boolean)
}

function tokenize(value) {
  return normalizeKey(value)
    .split(" ")
    .filter((t) => t.length > 1 && !["de", "con", "en", "el", "la"].includes(t))
}

function scoreMatch(searchKey, searchTokens, row) {
  const other = normalizeKey(row.nombre)
  const stockTokens = tokenize(row.nombre)
  let score = 0

  if (searchKey === other) score = 100
  else if (searchKey.includes(other) || other.includes(searchKey)) score = 88
  else {
    let shared = 0
    for (const token of searchTokens) {
      if (
        stockTokens.some(
          (st) => st === token || st.includes(token) || token.includes(st)
        )
      ) {
        shared += 1
      }
    }
    if (shared && searchTokens.length) {
      score = Math.round((shared / searchTokens.length) * 82)
    }
  }

  return score
}

function matchPrice(nombre, prices) {
  const variants = expandWhatsAppName(nombre)
  let best = null
  let bestScore = 0

  for (const variant of variants) {
    const waTokens = tokenize(variant)
    for (const row of prices) {
      const score = scoreMatch(variant, waTokens, row)
      if (score > bestScore) {
        bestScore = score
        best = { ...row, matchScore: score }
      }
    }
  }

  return bestScore >= 50 ? best : null
}

function main() {
  const chatFile = findChatFile(WHATSAPP_DIR)
  if (!chatFile) {
    console.error("No se encontró el .txt del chat en:", WHATSAPP_DIR)
    process.exit(1)
  }

  const entries = parseWhatsAppChat(fs.readFileSync(chatFile, "utf8"))
  const imageSet = new Set(
    fs
      .readdirSync(WHATSAPP_DIR)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .map((f) => f.toLowerCase())
  )

  let prices = []
  if (fs.existsSync(PRICE_FILE)) {
    prices = readPriceList(PRICE_FILE)
    console.log(`Lista de precios: ${PRICE_FILE} (${prices.length} productos únicos)`)
  } else {
    console.log("Sin archivo de precios — precios quedarán vacíos")
  }

  fs.mkdirSync(FOTOS_DIR, { recursive: true })

  const rows = []
  const warnings = []
  const usedFiles = new Map()

  for (const entry of entries) {
    const nombre = entry.nombre || `Producto ${entry.file}`
    const hasPhoto = imageSet.has(entry.file.toLowerCase())
    const price = matchPrice(nombre, prices)

    if (!entry.nombre) {
      warnings.push(`Línea ${entry.chatLine}: ${entry.file} sin nombre`)
    }
    if (!hasPhoto) warnings.push(`Falta foto: ${entry.file}`)
    if (usedFiles.has(entry.file)) {
      warnings.push(
        `Duplicado ${entry.file}: "${usedFiles.get(entry.file)}" y "${nombre}"`
      )
    }
    usedFiles.set(entry.file, nombre)

    const src = path.join(WHATSAPP_DIR, entry.file)
    const dest = path.join(FOTOS_DIR, entry.file)
    if (fs.existsSync(src)) fs.copyFileSync(src, dest)

    rows.push({
      nombre,
      precio: price?.precio ?? "",
      foto: entry.file,
      categoria: price?.categoria ?? "",
      stockMatch: price?.nombre ?? "",
      sinPrecio: !price,
      sinFoto: !hasPhoto,
    })
  }

  const csv = [
    "nombre,precio,foto,categoria",
    ...rows.map((r) => {
      const n = `"${r.nombre.replace(/"/g, '""')}"`
      const c = r.categoria ? `"${r.categoria.replace(/"/g, '""')}"` : ""
      return `${n},${r.precio},${r.foto},${c}`
    }),
  ].join("\n")

  fs.writeFileSync(OUTPUT_CSV, csv, "utf8")

  const conPrecio = rows.filter((r) => !r.sinPrecio).length
  console.log(`\n✓ ${rows.length} productos asociados`)
  console.log(`✓ CSV: ${OUTPUT_CSV}`)
  console.log(`✓ Fotos: ${FOTOS_DIR}`)
  console.log(`  Con precio: ${conPrecio} | Sin precio: ${rows.length - conPrecio}`)
  console.log("\nPrimeras asociaciones:")
  rows.slice(0, 12).forEach((r) => {
    const stock = r.stockMatch ? ` ← ${r.stockMatch}` : ""
    console.log(
      `  ${r.foto} → "${r.nombre}" | ${r.precio || "SIN PRECIO"}${stock}`
    )
  })

  const sinMatch = rows.filter((r) => r.sinPrecio)
  if (sinMatch.length) {
    console.log(`\nSin precio en stock (${sinMatch.length}):`)
    sinMatch.forEach((r) => console.log(`  - "${r.nombre}"`))
  }

  if (warnings.length) {
    console.log(`\nAvisos (${warnings.length}):`)
    warnings.slice(0, 15).forEach((w) => console.log(`  - ${w}`))
  }

  if (conPrecio < rows.length) {
    console.log("\n→ Revisá los nombres sin match y ajustá el stock o el chat.")
  } else {
    console.log("\n→ Siguiente: npm run import:catalog")
  }
}

main()
