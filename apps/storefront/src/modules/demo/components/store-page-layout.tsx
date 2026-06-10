import { ReactNode, Suspense } from "react"
import StorePageBackground from "@modules/demo/components/store-page-background"
import StorePageIntro from "@modules/demo/components/store-page-intro"

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
    <div className="relative min-h-full flex-1">
      <StorePageBackground />
      <div className="relative z-10 mx-4 pb-12 pt-6 sm:mx-6 lg:mx-auto lg:max-w-6xl">
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
        <div className="mt-10 lg:max-w-none">
          <Suspense fallback={null}>{toolbar}</Suspense>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
