import DemoCartView from "@modules/demo/components/cart-view"

export default function DemoCartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="border-b border-beige-200 pb-8">
        <h1 className="font-serif text-5xl font-normal text-black sm:text-6xl">
          Tu carrito
        </h1>
        <p className="mt-3 text-sm text-neutral-500">
          Revisá tu pedido y envialo por WhatsApp
        </p>
      </div>
      <div className="mt-10">
        <DemoCartView />
      </div>
    </div>
  )
}
