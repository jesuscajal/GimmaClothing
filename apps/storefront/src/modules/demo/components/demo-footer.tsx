import Link from "next/link"
import GimmaLogo from "@modules/demo/components/gimma-logo"

export default function DemoFooter() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="flex items-start gap-4">
            <GimmaLogo href="/demo/inicio" size="md" />
            <div>
              <p className="text-sm font-medium tracking-wide text-black uppercase">
                Gimma Clothing
              </p>
              <p className="mt-2 max-w-xs text-sm text-neutral-400">
                Gris, negro y blanco. Pedidos por WhatsApp.
              </p>
            </div>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <p className="font-medium text-black">Tienda</p>
              <ul className="mt-2 space-y-1 text-neutral-400">
                <li>
                  <Link href="/demo/inicio" className="hover:text-black">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/demo/tienda" className="hover:text-black">
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link href="/demo/carrito" className="hover:text-black">
                    Carrito
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-black">Contacto</p>
              <p className="mt-2 text-neutral-400">WhatsApp · Instagram</p>
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs text-neutral-400">
          © {new Date().getFullYear()} Gimma Clothing
        </p>
      </div>
    </footer>
  )
}
