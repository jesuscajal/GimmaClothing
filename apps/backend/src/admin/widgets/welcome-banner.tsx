import { defineWidgetConfig } from "@medusajs/admin-sdk"

function WelcomeBannerWidget() {
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
