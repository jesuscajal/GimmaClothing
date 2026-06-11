import { useEffect } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"

function WelcomeBannerWidget() {
  useEffect(() => {
    const hideDefaultMedusaElements = () => {
      const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
      const medusaHeading = headings.find(
        (h) =>
          h.textContent?.includes("Bienvenido a Medusa") ||
          h.textContent?.includes("Welcome to Medusa")
      )

      if (medusaHeading) {
        // Ocultar el título principal de Medusa
        ;(medusaHeading as HTMLElement).style.display = "none"

        // Ocultar la descripción justo debajo del título
        const desc = medusaHeading.nextElementSibling
        if (
          desc &&
          (desc.tagName === "P" ||
            desc.textContent?.includes("Inicia sesión") ||
            desc.textContent?.includes("Sign in"))
        ) {
          ;(desc as HTMLElement).style.display = "none"
        }

        // Ocultar el logo de Medusa arriba del título
        const logo = medusaHeading.previousElementSibling
        if (logo) {
          ;(logo as HTMLElement).style.display = "none"
        }
      }
    }

    hideDefaultMedusaElements()
    // Ejecutarlo periódicamente por si el DOM se actualiza dinámicamente
    const interval = setInterval(hideDefaultMedusaElements, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center text-center pb-6 select-none">
      <img
        src="https://gimmaclothing.com/images/logo-gimma.png"
        alt="Gimma"
        className="w-16 h-16 rounded-full mb-3 object-cover shadow-md border border-neutral-200 dark:border-zinc-800"
        onError={(e) => {
          e.currentTarget.style.display = "none"
        }}
      />
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-zinc-50 font-sans">
        Bienvenido a Gimma Panel Stock
      </h1>
      <p className="text-sm text-neutral-500 mt-1.5 dark:text-zinc-400 max-w-[280px]">
        Gestión de inventario y pedidos de WhatsApp
      </p>
    </div>
  )
}


export const config = defineWidgetConfig({
  zone: "login.before",
})

export default WelcomeBannerWidget
