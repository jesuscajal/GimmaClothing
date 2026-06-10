export default function StorePageBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 bg-neutral-300"
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/store-bg-waves.png"
        alt=""
        className="h-full w-full object-cover opacity-90"
      />
    </div>
  )
}
