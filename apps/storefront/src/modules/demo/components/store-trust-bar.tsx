import { gimmaConfig } from "@lib/gimma/config"

const ITEMS = [
  {
    label: "Envíos a todo el país",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7V10z" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
  },
  {
    label: "Pagá como quieras",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    label: "Cambios sin cargo",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 7h16M4 12h16M4 17h10" />
        <circle cx="18" cy="17" r="3" />
      </svg>
    ),
  },
  {
    label: "Pedí por WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.02 2 11c0 1.96.58 3.78 1.58 5.3L2 22l5.9-1.5A9.8 9.8 0 0012 20c5.52 0 10-4.02 10-9S17.52 2 12 2zm0 16.5c-1.55 0-3-.45-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A7.5 7.5 0 1112 18.5z" />
      </svg>
    ),
    href: `https://wa.me/${gimmaConfig.whatsapp}`,
  },
]

export default function StoreTrustBar() {
  return (
    <section className="mx-4 mt-4 sm:mx-6">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-neutral-300/60 sm:grid-cols-4">
        {ITEMS.map((item) => {
          const content = (
            <>
              <div className="text-neutral-700">{item.icon}</div>
              <p className="mt-2 text-[10px] font-semibold uppercase leading-tight tracking-wide text-neutral-800">
                {item.label}
              </p>
            </>
          )

          const className =
            "flex flex-col items-center bg-neutral-200/80 px-3 py-5 text-center transition hover:bg-neutral-200"

          if (item.href) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {content}
              </a>
            )
          }

          return (
            <div key={item.label} className={className}>
              {content}
            </div>
          )
        })}
      </div>
    </section>
  )
}
