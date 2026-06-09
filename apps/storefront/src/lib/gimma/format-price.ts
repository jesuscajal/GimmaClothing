export function formatGimmaPrice(amount: number, currency = "ars") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount)
}
