export default function StorePageBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/store-bg-waves.png"
        alt=""
        className="h-full w-full object-cover object-center"
      />
    </div>
  )
}
