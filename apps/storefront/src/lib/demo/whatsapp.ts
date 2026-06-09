import { DEMO_WHATSAPP } from "./data"

export type DemoCartLine = {
  handle: string
  title: string
  price: number
  size: string
  color: string
  quantity: number
}

export function buildWhatsAppOrderUrl(items: DemoCartLine[]) {
  if (!items.length) return `https://wa.me/${DEMO_WHATSAPP}`

  const lines = items.map(
    (i) =>
      `• ${i.title} (${i.color}, talle ${i.size}) x${i.quantity} — $${(i.price * i.quantity).toLocaleString("es-AR")}`
  )
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const message = [
    "Hola Gimma Clothing! 👋",
    "Quiero hacer este pedido:",
    "",
    ...lines,
    "",
    `*Total: $${total.toLocaleString("es-AR")}*`,
    "",
    "¿Tienen stock? ¿Cómo puedo pagar?",
  ].join("\n")

  return `https://wa.me/${DEMO_WHATSAPP}?text=${encodeURIComponent(message)}`
}
