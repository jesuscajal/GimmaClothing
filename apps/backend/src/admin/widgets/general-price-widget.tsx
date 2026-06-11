// @ts-nocheck
import { useState, useEffect } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"

type PriceWidgetProps = {
  data?: {
    product?: {
      id: string
      title: string
    }
  }
}

function GeneralPriceWidget({ data }: PriceWidgetProps) {
  // Soporta tanto data.product como product directo en props
  const product = data?.product || (data as any)
  if (!product?.id) return null

  const [price, setPrice] = useState<string>("")
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Consultar precios actuales de las variantes en ARS
  const fetchProductPrices = async () => {
    try {
      setFetching(true)
      const res = await fetch(
        `/admin/products/${product.id}?fields=id,title,*variants,*variants.prices`
      )
      if (!res.ok) throw new Error("Error al consultar el producto")
      const result = await res.json()

      const latestProduct = result.product
      if (latestProduct && latestProduct.variants?.length > 0) {
        // Buscar el precio en ARS de la primera variante
        const firstVariant = latestProduct.variants[0]
        const arsPrice = firstVariant.prices?.find(
          (p: any) => p.currency_code === "ars"
        )
        if (arsPrice) {
          setCurrentPrice(arsPrice.amount)
          setPrice(arsPrice.amount.toString())
        }
      }
    } catch (error) {
      console.error("Error fetching product prices:", error)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchProductPrices()
  }, [product.id])

  const handleUpdatePrice = async () => {
    const newPrice = parseFloat(price)
    if (isNaN(newPrice) || newPrice < 0) {
      alert("Por favor, ingresá un precio válido mayor o igual a 0.")
      return
    }

    try {
      setLoading(true)

      // Consultar variantes más recientes
      const res = await fetch(`/admin/products/${product.id}?fields=id,*variants`)
      if (!res.ok) throw new Error("Error al obtener las variantes")
      const result = await res.json()
      const variants = result.product?.variants || []

      if (variants.length === 0) {
        alert("El producto no tiene variantes para actualizar.")
        return
      }

      // Actualizar el precio de todas las variantes secuencialmente
      for (const variant of variants) {
        const updateRes = await fetch(
          `/admin/products/${product.id}/variants/${variant.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prices: [
                {
                  amount: newPrice,
                  currency_code: "ars",
                },
              ],
            }),
          }
        )
        if (!updateRes.ok) {
          throw new Error(
            `Error al actualizar la variante: ${variant.title || variant.id}`
          )
        }
      }

      // Refrescar precios actuales
      await fetchProductPrices()
      alert("Precio general actualizado con éxito en todas las variantes.")
    } catch (error: any) {
      alert(error.message || "Ocurrió un error al actualizar los precios.")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Container className="p-0 overflow-hidden shadow-sm border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-xl">
      <div className="px-6 py-4 border-b border-neutral-200 dark:border-zinc-800">
        <Heading level="h2" className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Precio General
        </Heading>
        <p className="text-xs text-zinc-500 mt-1 dark:text-zinc-400">
          Modificá el precio en pesos (ARS) de todas las variantes de este producto al mismo tiempo.
        </p>
      </div>

      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-zinc-500">
            Precio Actual
          </span>
          <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            {fetching ? (
              <span className="text-sm font-medium text-neutral-400">Cargando...</span>
            ) : currentPrice !== null ? (
              formatCurrency(currentPrice)
            ) : (
              "Sin precio"
            )}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:max-w-[360px]">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">$</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading || fetching}
              placeholder="Ej: 15000"
              className="w-full rounded-lg border border-neutral-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2.5 pl-6 pr-3 text-sm text-black dark:text-white outline-none focus:border-neutral-400 dark:focus:border-zinc-500 transition"
            />
          </div>
          <button
            onClick={handleUpdatePrice}
            disabled={loading || fetching || !price}
            className="rounded-lg bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-900 px-4 py-2.5 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition disabled:opacity-50 shrink-0"
          >
            {loading ? "Actualizando..." : "Modificar precio"}
          </button>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default GeneralPriceWidget
