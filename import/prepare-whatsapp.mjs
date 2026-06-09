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
const PRICE_FILE = process.env.IMPORT_PRICE_FILE || path.join(REPO, "import/precios.xlsx")
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

function matchPrice(nombre, prices) {
  const key = normalizeKey(nombre)
  let best = null
  let bestScore = 0

  for (const row of prices) {
    const other = normalizeKey(row.nombre)
    let score = 0
    if (key === other) score = 100
    else if (key.includes(other) || other.includes(key)) score = 80
    else {
      const a = new Set(key.split(" "))
      const b = new Set(other.split(" "))
      let shared = 0
      a.forEach((t) => b.has(t) && shared++)
      if (shared) score = Math.round((shared / Math.max(a.size, b.size)) * 70)
    }
    if (score > bestScore) {
      bestScore = score
      best = row
    }
  }

  return bestScore >= 70 ? best : null
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
    prices = readPricesXlsx(PRICE_FILE)
    console.log(`Excel precios: ${prices.length} filas`)
  } else {
    console.log("Sin Excel en import/precios.xlsx — precios quedarán vacíos")
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
    console.log(`  ${r.foto} → "${r.nombre}" | ${r.precio || "SIN PRECIO"}`)
  })

  if (warnings.length) {
    console.log(`\nAvisos (${warnings.length}):`)
    warnings.slice(0, 15).forEach((w) => console.log(`  - ${w}`))
  }

  if (conPrecio < rows.length) {
    console.log("\n→ Poné tu Excel en import/precios.xlsx y volvé a ejecutar.")
  } else {
    console.log("\n→ Siguiente: npm run import:catalog")
  }
}

main()
