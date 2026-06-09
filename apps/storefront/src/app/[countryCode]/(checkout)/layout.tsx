import { gimmaConfig } from "@lib/gimma/config"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import GimmaLogo from "@modules/demo/components/gimma-logo"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isGimma = !gimmaConfig.isDemoRoot()

  return (
    <div className="relative w-full bg-white small:min-h-screen">
      <div className="h-16 border-b bg-white">
        <nav className="content-container flex h-full items-center justify-between">
          <LocalizedClientLink
            href={isGimma ? "/carrito" : "/cart"}
            className="text-small-semi text-ui-fg-base flex flex-1 basis-0 items-center gap-x-2 uppercase"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base mt-px hidden small:block">
              {isGimma ? "Volver al carrito" : "Back to shopping cart"}
            </span>
            <span className="txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base mt-px block small:hidden">
              Volver
            </span>
          </LocalizedClientLink>

          {isGimma ? (
            <GimmaLogo href={null} size="sm" />
          ) : (
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
              data-testid="store-link"
            >
              Medusa Store
            </LocalizedClientLink>
          )}

          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
      {!isGimma && (
        <div className="flex w-full items-center justify-center py-4">
          <MedusaCTA />
        </div>
      )}
    </div>
  )
}
