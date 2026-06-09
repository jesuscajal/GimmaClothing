/**
 * Configuración Gimma: demo (diseño) vs producción (Medusa).
 *
 * Local / diseño:     NEXT_PUBLIC_GIMMA_ROOT=demo
 * VPS datos reales:   NEXT_PUBLIC_GIMMA_ROOT=production
 */
export const gimmaConfig = {
  /** "demo" = /demo es el inicio. "production" = tienda Medusa real (/ar/...) */
  root: (process.env.NEXT_PUBLIC_GIMMA_ROOT || "demo") as "demo" | "production",

  /** País/región por defecto en producción (ISO 2) */
  defaultCountry: process.env.NEXT_PUBLIC_DEFAULT_REGION || "ar",

  whatsapp: process.env.NEXT_PUBLIC_DEMO_WHATSAPP || "5491123456789",

  /** Rutas del laboratorio de diseño (siempre accesibles si existen) */
  demoBasePath: "/demo",

  isDemoRoot: () =>
    (process.env.NEXT_PUBLIC_GIMMA_ROOT || "demo") === "demo",

  productionHome: () => {
    const country = process.env.NEXT_PUBLIC_DEFAULT_REGION || "ar"
    return `/${country}`
  },
} as const
