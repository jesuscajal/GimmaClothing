import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Table } from "@medusajs/ui"
import { useEffect, useState } from "react"

// Simple SVG Document icon
const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />
  </svg>
)

type OrderData = {
  id: string
  display_id: number
  created_at: string
  total: number
  currency_code: string
  status: string
  email: string
}

type MonthSummary = {
  monthKey: string // YYYY-MM
  monthName: string // e.g., "Junio 2026"
  totalSales: number
  orderCount: number
  averageTicket: number
  orders: OrderData[]
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

function formatMonthKey(dateStr: string): { key: string; label: string } {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const monthIdx = date.getMonth()
  const monthName = MONTH_NAMES[monthIdx]
  return {
    key: `${year}-${String(monthIdx + 1).padStart(2, '0')}`,
    label: `${monthName} ${year}`
  }
}

export function FacturacionPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summaries, setSummaries] = useState<MonthSummary[]>([])
  const [mostProductiveMonth, setMostProductiveMonth] = useState<MonthSummary | null>(null)
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)
        // Buscamos las órdenes en el endpoint de Medusa Admin (la cookie de sesión ya está en el navegador)
        const response = await fetch("/admin/orders?limit=999")
        if (!response.ok) {
          throw new Error("No se pudo obtener el listado de pedidos de la tienda.")
        }
        const data = await response.json()
        const ordersList: OrderData[] = data.orders || []

        // Filtrar órdenes que no estén canceladas
        const activeOrders = ordersList.filter(o => o.status !== "canceled")

        // Agrupar por mes
        const groups: Record<string, { label: string; orders: OrderData[] }> = {}
        activeOrders.forEach(order => {
          const { key, label } = formatMonthKey(order.created_at)
          if (!groups[key]) {
            groups[key] = { label, orders: [] }
          }
          groups[key].orders.push(order)
        })

        // Construir resúmenes
        const list: MonthSummary[] = Object.keys(groups).map(key => {
          const group = groups[key]
          const totalSales = group.orders.reduce((sum, o) => sum + (o.total || 0), 0)
          const orderCount = group.orders.length
          const averageTicket = orderCount > 0 ? totalSales / orderCount : 0

          return {
            monthKey: key,
            monthName: group.label,
            totalSales,
            orderCount,
            averageTicket,
            orders: group.orders.sort((a, b) => b.display_id - a.display_id)
          }
        })

        // Ordenar cronológicamente descendente
        list.sort((a, b) => b.monthKey.localeCompare(a.monthKey))

        // Determinar mes más productivo (por facturación total)
        let best: MonthSummary | null = null
        list.forEach(item => {
          if (!best || item.totalSales > best.totalSales) {
            best = item
          }
        })

        setSummaries(list)
        setMostProductiveMonth(best)
      } catch (err: any) {
        setError(err.message || "Error cargando facturación")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <Container className="p-8">
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-neutral-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="mt-4 text-sm font-medium">Cargando datos de facturación...</span>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="p-8 border-red-200 bg-red-50">
        <Heading level="h2" className="text-red-900 font-semibold">Error al cargar facturación</Heading>
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </Container>
    )
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-1">
      <div className="flex flex-col gap-2">
        <Heading level="h1" className="text-2xl font-bold text-neutral-900">
          Facturación y Ventas Mensuales
        </Heading>
        <p className="text-sm text-neutral-500">
          Reporte histórico agrupado por mes de todas las órdenes activas en la tienda.
        </p>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid gap-4 md:grid-cols-3">
        {mostProductiveMonth && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Mes Más Productivo
              </span>
              <p className="text-2xl font-bold text-emerald-950 mt-3">
                {mostProductiveMonth.monthName}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-xs text-emerald-700">Facturación récord</p>
              <p className="text-lg font-bold text-emerald-900">{formatCurrency(mostProductiveMonth.totalSales)}</p>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-neutral-200 bg-white p-5 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
              Ventas Históricas Totales
            </span>
            <p className="text-2xl font-bold text-neutral-950 mt-3">
              {formatCurrency(summaries.reduce((sum, s) => sum + s.totalSales, 0))}
            </p>
          </div>
          <div className="mt-4">
            <p className="text-xs text-neutral-500">Volumen acumulado</p>
            <p className="text-sm font-semibold text-neutral-700">
              {summaries.reduce((sum, s) => sum + s.orderCount, 0)} pedidos completados
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
              Ticket Promedio General
            </span>
            <p className="text-2xl font-bold text-neutral-950 mt-3">
              {formatCurrency(
                summaries.reduce((sum, s) => sum + s.orderCount, 0) > 0
                  ? summaries.reduce((sum, s) => sum + s.totalSales, 0) / summaries.reduce((sum, s) => sum + s.orderCount, 0)
                  : 0
              )}
            </p>
          </div>
          <div className="mt-4">
            <p className="text-xs text-neutral-500">Valor promedio de compra</p>
            <p className="text-sm font-semibold text-neutral-700">Estimado por orden</p>
          </div>
        </div>
      </div>

      {/* Tabla Principal de Resumen Mensual */}
      <Container className="p-0 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-neutral-200">
          <Heading level="h2" className="text-lg font-bold text-neutral-900">Historial de Ventas</Heading>
        </div>
        
        {summaries.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            No se encontraron pedidos registrados en el sistema.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <Table.Header>
                <Table.Row className="bg-neutral-50 text-neutral-600">
                  <Table.HeaderCell className="px-6 py-3">Mes</Table.HeaderCell>
                  <Table.HeaderCell className="px-6 py-3 text-right">Facturación</Table.HeaderCell>
                  <Table.HeaderCell className="px-6 py-3 text-right">Cant. Pedidos</Table.HeaderCell>
                  <Table.HeaderCell className="px-6 py-3 text-right">Ticket Promedio</Table.HeaderCell>
                  <Table.HeaderCell className="px-6 py-3 text-center">Acción</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {summaries.map((summary) => (
                  <>
                    <Table.Row key={summary.monthKey} className="border-t border-neutral-200 hover:bg-neutral-50/50">
                      <Table.Cell className="px-6 py-4 font-semibold text-neutral-900">
                        {summary.monthName}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 text-right font-bold text-emerald-700">
                        {formatCurrency(summary.totalSales)}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 text-right text-neutral-700">
                        {summary.orderCount}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 text-right text-neutral-700">
                        {formatCurrency(summary.averageTicket)}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 text-center">
                        <button
                          onClick={() => setExpandedMonth(expandedMonth === summary.monthKey ? null : summary.monthKey)}
                          className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 border border-neutral-200 px-3 py-1.5 rounded-lg bg-white shadow-sm hover:bg-neutral-50 transition"
                        >
                          {expandedMonth === summary.monthKey ? "Ocultar Pedidos" : "Ver Pedidos"}
                        </button>
                      </Table.Cell>
                    </Table.Row>

                    {/* Desglose de Pedidos del Mes */}
                    {expandedMonth === summary.monthKey && (
                      <Table.Row className="bg-neutral-50/70 border-t border-neutral-100">
                        <Table.Cell colSpan={5} className="px-6 py-4">
                          <div className="space-y-2 max-w-[900px] mx-auto">
                            <Heading level="h3" className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                              Desglose de Pedidos - {summary.monthName}
                            </Heading>
                            <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-sm">
                              <table className="min-w-full divide-y divide-neutral-200 text-xs">
                                <thead className="bg-neutral-50">
                                  <tr className="text-left text-neutral-500 font-semibold">
                                    <th className="px-4 py-2">Orden ID</th>
                                    <th className="px-4 py-2">Fecha</th>
                                    <th className="px-4 py-2">Contacto</th>
                                    <th className="px-4 py-2 text-right">Total</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                  {summary.orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-neutral-50">
                                      <td className="px-4 py-2.5 font-bold text-neutral-900">
                                        <a
                                          href={`/app/orders/${order.id}`}
                                          className="text-indigo-600 hover:underline"
                                        >
                                          #{order.display_id}
                                        </a>
                                      </td>
                                      <td className="px-4 py-2.5 text-neutral-500">
                                        {new Date(order.created_at).toLocaleDateString("es-AR", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit"
                                        })}
                                      </td>
                                      <td className="px-4 py-2.5 text-neutral-700 truncate max-w-[200px]">
                                        {order.email}
                                      </td>
                                      <td className="px-4 py-2.5 text-right font-semibold text-neutral-900">
                                        {formatCurrency(order.total)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </Container>
    </div>
  )
}

// Configuración para el sidebar del Admin
export const config = defineRouteConfig({
  label: "Facturación",
  icon: DocumentIcon,
})

export default FacturacionPage
