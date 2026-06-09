import DemoNav from "@modules/demo/components/demo-nav"
import DemoFooter from "@modules/demo/components/demo-footer"
import { DemoCartProvider } from "@modules/demo/demo-cart-context"

type Props = {
  children: React.ReactNode
  params: Promise<{ countryCode: string }>
}

export default async function GimmaStoreLayout({ children, params }: Props) {
  const { countryCode } = await params
  const basePath = `/${countryCode}`

  return (
    <DemoCartProvider storageKey="gimma-store-cart">
      <div className="flex min-h-screen flex-col bg-neutral-100 text-black antialiased">
        <DemoNav basePath={basePath} />
        {children}
        <DemoFooter />
      </div>
    </DemoCartProvider>
  )
}
