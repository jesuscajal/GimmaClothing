import { ReactNode, Suspense } from "react"
import StorePageBackground from "@modules/demo/components/store-page-background"
import StorePageIntro from "@modules/demo/components/store-page-intro"
import StoreProductsScroll, {
  STORE_PRODUCTS_ANCHOR,
} from "@modules/demo/components/store-products-scroll"
import { StoreSearchProvider } from "./store-search-context"

type Props = {
  productCount: number
  filters: ReactNode
  toolbar: ReactNode
  children: ReactNode
}

export default function StorePageLayout({
  productCount,
  filters,
  toolbar,
  children,
}: Props) {
  return (
    <StoreSearchProvider>
      <div className="relative isolate min-h-screen flex-1">
        <StorePageBackground />
        <div className="relative mx-4 pb-12 pt-6 sm:mx-6 lg:mx-auto lg:max-w-6xl">
          <div className="lg:max-w-2xl">
            <StorePageIntro productCount={productCount} />
            <Suspense
              fallback={
                <p className="mt-8 text-sm text-neutral-500">Cargando…</p>
              }
            >
              {filters}
            </Suspense>
          </div>
          <div
            id={STORE_PRODUCTS_ANCHOR}
            className="mt-10 scroll-mt-24 lg:max-w-none"
          >
            <Suspense fallback={null}>
              <StoreProductsScroll />
              {toolbar}
            </Suspense>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </StoreSearchProvider>
  )
}
