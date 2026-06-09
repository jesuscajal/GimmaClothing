import Link from "next/link"
import clsx from "clsx"

type Props = {
  href?: string | null
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZES = {
  sm: { box: "h-10 w-10", text: "text-[10px]" },
  md: { box: "h-14 w-14", text: "text-xs" },
  lg: { box: "h-24 w-24", text: "text-base" },
}

export default function GimmaLogo({
  href = "/demo/inicio",
  size = "md",
  className = "",
}: Props) {
  const { box, text } = SIZES[size]

  const logo = (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full border border-beige-300 bg-white",
        box,
        className
      )}
    >
      <span className={clsx("font-serif font-semibold leading-none text-black", text)}>
        Gimma
      </span>
    </div>
  )

  if (!href) return logo

  return (
    <Link href={href} className="inline-flex shrink-0">
      {logo}
    </Link>
  )
}
