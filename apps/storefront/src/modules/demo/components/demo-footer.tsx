import Link from "next/link"
import GimmaLogo from "@modules/demo/components/gimma-logo"
import { gimmaPath } from "@lib/gimma/paths"

type Props = {
  basePath?: string
}

export default function DemoFooter({ basePath = "/demo" }: Props) {
  return (
    <footer className="mt-auto border-t border-beige-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="flex items-start gap-4">
            <GimmaLogo href={gimmaPath(basePath, "inicio")} size="md" />
            <div>
              <p className="font-serif text-lg text-black">Gimma Clothing</p>
              <p className="mt-2 max-w-xs text-sm text-neutral-500">
                Moda minimal. Pedí por WhatsApp.
              </p>
            </div>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <p className="font-medium text-black">Tienda</p>
              <ul className="mt-2 space-y-1 text-neutral-500">
                <li>
                  <Link
                    href={gimmaPath(basePath, "inicio")}
                    className="hover:text-black"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href={gimmaPath(basePath, "tienda")}
                    className="hover:text-black"
                  >
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link
                    href={gimmaPath(basePath, "carrito")}
                    className="hover:text-black"
                  >
                    Carrito
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-black">Contacto</p>
              <p className="mt-2 text-neutral-500">WhatsApp · Instagram</p>
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
