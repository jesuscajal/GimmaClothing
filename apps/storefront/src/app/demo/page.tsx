import Link from "next/link"
import GimmaLogo from "@modules/demo/components/gimma-logo"

const STORE_SCREENS = [
  {
    href: "/demo/inicio",
    title: "Inicio",
    description: "Hero, categorías y productos destacados",
    tag: "Tienda",
  },
  {
    href: "/demo/tienda",
    title: "Catálogo",
    description: "Listado con filtros por categoría",
    tag: "Tienda",
  },
  {
    href: "/demo/producto/remera-oversize-negra",
    title: "Producto",
    description: "Ficha con talles, colores y carrito",
    tag: "Tienda",
  },
  {
    href: "/demo/carrito",
    title: "Carrito + WhatsApp",
    description: "Resumen y envío del pedido por WhatsApp",
    tag: "Tienda",
  },
]

const ADMIN_SCREENS = [
  {
    href: "/demo/admin",
    title: "Dashboard",
    description: "Métricas, pedidos recientes y alertas de stock",
    tag: "Admin",
  },
  {
    href: "/demo/admin/pedidos",
    title: "Pedidos",
    description: "Listado con canal WhatsApp/web y estados",
    tag: "Admin",
  },
  {
    href: "/demo/admin/pedidos/ord-001",
    title: "Detalle de pedido",
    description: "Ítems, cliente y botón responder por WhatsApp",
    tag: "Admin",
  },
  {
    href: "/demo/admin/productos",
    title: "Productos",
    description: "Catálogo, precios, stock y estados",
    tag: "Admin",
  },
  {
    href: "/demo/admin/inventario",
    title: "Inventario",
    description: "Stock por SKU y alertas",
    tag: "Admin",
  },
  {
    href: "/demo/admin/clientes",
    title: "Clientes",
    description: "Historial y contacto",
    tag: "Admin",
  },
]

function ScreenGrid({
  screens,
  accent,
}: {
  screens: typeof STORE_SCREENS
  accent: string
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {screens.map((screen) => (
        <Link
          key={screen.href}
          href={screen.href}
          className="group border border-neutral-200 bg-white p-6 transition hover:border-neutral-900"
        >
          <span
            className={`text-[10px] font-semibold tracking-widest uppercase ${accent}`}
          >
            {screen.tag}
          </span>
          <h2 className="mt-2 text-xl font-medium text-neutral-900 group-hover:underline">
            {screen.title}
          </h2>
          <p className="mt-2 text-sm text-neutral-500">{screen.description}</p>
          <span className="mt-4 inline-block text-sm font-medium text-neutral-900">
            Ver pantalla →
          </span>
        </Link>
      ))}
    </div>
  )
}

export default function DemoIndexPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <div className="flex items-center gap-4">
            <GimmaLogo href="/demo/inicio" size="md" />
            <div>
              <p className="text-xs font-medium tracking-[0.3em] text-neutral-500 uppercase">
                Vista previa · sin backend
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
                Gimma Clothing
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-xl text-neutral-600">
            Demo completo: tienda para el cliente y panel admin para gestionar
            productos y pedidos por WhatsApp.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Tienda (cliente)
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Lo que ve quien quiere comprar ropa
        </p>
        <div className="mt-6">
          <ScreenGrid screens={STORE_SCREENS} accent="text-neutral-600" />
        </div>

        <h2 className="mt-14 text-lg font-semibold text-neutral-900">
          Panel admin (dueño)
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Donde se gestionan pedidos, productos e inventario
        </p>
        <div className="mt-6">
          <ScreenGrid screens={ADMIN_SCREENS} accent="text-neutral-500" />
        </div>

        <div className="mt-12 rounded-lg border border-neutral-300 bg-neutral-100 p-4 text-sm text-neutral-700">
          <strong>Tip:</strong> Ejecutá{" "}
          <code className="rounded bg-neutral-200 px-1.5 py-0.5 text-xs">
            npm run storefront:dev
          </code>{" "}
          en <code className="text-xs">apps/storefront</code> y abrí{" "}
          <a href="http://localhost:8000/demo" className="font-medium underline">
            localhost:8000/demo
          </a>
        </div>
      </div>
    </div>
  )
}
