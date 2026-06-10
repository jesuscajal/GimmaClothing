"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export const STORE_PRODUCTS_ANCHOR = "productos-tienda"

export function scrollToStoreProducts() {
  const el = document.getElementById(STORE_PRODUCTS_ANCHOR)
  if (!el) return

  el.scrollIntoView({ behavior: "smooth", block: "start" })
}

export default function StoreProductsScroll() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (window.location.hash.slice(1) !== STORE_PRODUCTS_ANCHOR) return

    requestAnimationFrame(() => {
      scrollToStoreProducts()
      history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`
      )
    })
  }, [searchParams])

  return null
}
