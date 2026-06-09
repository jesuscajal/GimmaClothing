import DemoCartView from "@modules/demo/components/cart-view"

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function GimmaCartPage({ params }: Props) {
  const { countryCode } = await params
  const basePath = `/${countryCode}`

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold text-black">Tu carrito</h1>
      <p className="mt-2 text-neutral-400">
        Revisá tu pedido y envialo por WhatsApp
      </p>
      <div className="mt-10">
        <DemoCartView basePath={basePath} currency="ars" />
      </div>
    </div>
  )
}
