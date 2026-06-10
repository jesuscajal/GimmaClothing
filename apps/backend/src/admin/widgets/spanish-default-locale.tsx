import { useEffect } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useTranslation } from "react-i18next"

function SpanishDefaultLocale() {
  const { i18n } = useTranslation()

  useEffect(() => {
    if (i18n.language.startsWith("es")) {
      return
    }

    void i18n.changeLanguage("es")
  }, [i18n])

  return null
}

export const config = defineWidgetConfig({
  zone: [
    "login.before",
    "order.list.before",
    "product.list.before",
    "customer.list.before",
  ],
})

export default SpanishDefaultLocale
