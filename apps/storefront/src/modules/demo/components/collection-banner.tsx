import Link from "next/link"

type Props = {
  href: string
}

export default function CollectionBanner({ href }: Props) {
  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-beige-800/55" />
      <div className="relative px-5 py-8">
        <p className="text-[10px] font-medium tracking-[0.2em] text-white/80 uppercase">
          Nueva colección
        </p>
        <p className="mt-2 font-serif text-xl leading-snug text-white">
          Elegancia que te acompaña siempre
        </p>
        <Link
          href={href}
          className="mt-5 inline-block rounded-lg bg-beige-900 px-5 py-2.5 text-xs font-medium tracking-wide text-white uppercase transition hover:bg-black"
        >
          Ver colección
        </Link>
      </div>
    </div>
  )
}
