type Props = {
  title?: string
  productCount: number
}

export default function StorePageIntro({
  title = "Tienda",
  productCount,
}: Props) {
  return (
    <header className="relative">
      <h1 className="font-serif text-5xl font-semibold tracking-tight text-black sm:text-6xl">
        {title}
      </h1>

      <div className="mt-4 flex items-center gap-3">
        <span className="h-px flex-1 max-w-[120px] bg-neutral-400/50" />
        <span className="text-xs text-black" aria-hidden>
          ♥
        </span>
        <span className="h-px flex-1 bg-neutral-400/30" />
      </div>

      <p className="mt-4 text-sm text-neutral-600">
        <span className="font-semibold text-[#A89578]">{productCount}</span>{" "}
        productos disponibles
      </p>

      <div className="relative mt-6 overflow-hidden rounded-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/store-banner.png"
          alt="Gimma Clothing"
          className="aspect-[16/10] w-full object-cover sm:aspect-[21/9]"
        />
      </div>
    </header>
  )
}
