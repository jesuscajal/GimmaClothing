// @ts-nocheck
import { useEffect } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"

function ProductListPriceColumn() {
  useEffect(() => {
    let productPrices: Record<string, number> = {}

    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "/admin/products?limit=100&fields=id,*variants,*variants.prices"
        )
        if (!res.ok) return
        const data = await res.json()
        const productsList = data.products || []
        productsList.forEach((p: any) => {
          if (p.variants && p.variants.length > 0) {
            const arsPrice = p.variants[0].prices?.find(
              (pr: any) => pr.currency_code === "ars"
            )
            if (arsPrice) {
              productPrices[p.id] = arsPrice.amount
            }
          }
        })
        // Forzar inyección después de cargar
        injectColumn()
      } catch (err) {
        console.error("Error fetching product prices for table:", err)
      }
    }

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }).format(amount)
    }

    const injectColumn = () => {
      const table = document.querySelector("table")
      if (!table) return

      // Inyectar el Header de Precio
      const headerRow = table.querySelector("thead tr")
      if (headerRow && !headerRow.querySelector("[data-injected-header]")) {
        const headerCells = headerRow.querySelectorAll("th")
        if (headerCells.length > 0) {
          const lastHeader = headerCells[headerCells.length - 1]
          const priceHeader = document.createElement("th")
          priceHeader.className = lastHeader.className
          priceHeader.setAttribute("data-injected-header", "true")
          priceHeader.textContent = "Precio"
          lastHeader.parentNode?.insertBefore(priceHeader, lastHeader)
        }
      }

      // Inyectar las celdas de Precio en las filas
      const bodyRows = table.querySelectorAll("tbody tr")
      bodyRows.forEach((row) => {
        if (row.querySelector("[data-injected-cell]")) {
          return // Ya inyectada
        }

        // Buscar el link del producto para extraer el ID
        const link = row.querySelector('a[href*="/products/"]')
        if (!link) return

        const href = link.getAttribute("href") || ""
        const match = href.match(/\/products\/(prod_[a-zA-Z0-9]+)/)
        if (!match) return
        const productId = match[1]

        const priceAmount = productPrices[productId]
        const formattedPrice =
          priceAmount !== undefined ? formatCurrency(priceAmount) : "-"

        const cells = row.querySelectorAll("td")
        if (cells.length > 0) {
          const lastCell = cells[cells.length - 1]
          const priceCell = document.createElement("td")
          priceCell.className = lastCell.className
          priceCell.setAttribute("data-injected-cell", "true")
          priceCell.innerHTML = `<span class="font-semibold text-emerald-700 dark:text-emerald-400">${formattedPrice}</span>`
          lastCell.parentNode?.insertBefore(priceCell, lastCell)
        }
      })
    }

    // Cargar precios e iniciar inyección
    fetchPrices()

    // Configurar observador de mutaciones para re-inyectar al paginar, ordenar o buscar
    const observer = new MutationObserver(() => {
      injectColumn()
    })

    const mainContainer = document.querySelector("main") || document.body
    observer.observe(mainContainer, {
      childList: true,
      subtree: true,
    })

    // Intervalo de respaldo por cambios asíncronos rápidos
    const interval = setInterval(injectColumn, 500)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  return null
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default ProductListPriceColumn
