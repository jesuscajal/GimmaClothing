const CLIENTS = [
  {
    name: "María González",
    email: "maria.g@email.com",
    phone: "+54 11 4521-8834",
    orders: 4,
    spent: 185420,
  },
  {
    name: "Lucas Fernández",
    email: "lucas.f@email.com",
    phone: "+54 11 3344-2211",
    orders: 2,
    spent: 62980,
  },
  {
    name: "Valentina Ruiz",
    email: "vale.ruiz@email.com",
    phone: "+54 11 5566-7788",
    orders: 6,
    spent: 312500,
  },
  {
    name: "Diego Martínez",
    email: "diego.m@email.com",
    phone: "+54 11 2233-4455",
    orders: 1,
    spent: 52990,
  },
  {
    name: "Camila Soto",
    email: "camila.s@email.com",
    phone: "+54 11 6677-8899",
    orders: 3,
    spent: 124970,
  },
]

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n)
}

export default function AdminClientsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold text-neutral-900">Clientes</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {CLIENTS.length} clientes registrados
      </p>

      <div className="mt-8 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50 text-left text-neutral-500">
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Contacto</th>
              <th className="px-5 py-3 font-medium">Pedidos</th>
              <th className="px-5 py-3 font-medium text-right">Total gastado</th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map((c) => (
              <tr
                key={c.email}
                className="border-b border-neutral-50 hover:bg-neutral-50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-700">
                      {c.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{c.name}</p>
                      <p className="text-xs text-neutral-500">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-neutral-600">{c.phone}</td>
                <td className="px-5 py-4">{c.orders}</td>
                <td className="px-5 py-4 text-right font-medium">
                  {formatPrice(c.spent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
