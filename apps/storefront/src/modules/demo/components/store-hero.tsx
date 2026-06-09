type Props = {
  title?: string
  productCount: number
}

export default function StoreHero({
  title = "Tienda",
  productCount,
}: Props) {
  return (
    <div className="flex flex-col gap-8 border-b border-beige-200 pb-10 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="font-serif text-5xl font-normal tracking-tight text-black sm:text-6xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-neutral-500">
          {productCount} productos disponibles
        </p>
      </div>
      <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-beige-100 sm:h-56 lg:h-64 lg:max-w-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80"
          alt="Colección de ropa"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}
