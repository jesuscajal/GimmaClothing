import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"

type Props = {
  href?: string | null
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZES = {
  sm: 40,
  md: 56,
  lg: 96,
}

export default function GimmaLogo({
  href = "/demo/inicio",
  size = "md",
  className = "",
}: Props) {
  const px = SIZES[size]

  const logo = (
    <span
      className={clsx(
        "inline-flex shrink-0 overflow-hidden rounded-full",
        className
      )}
      style={{ width: px, height: px }}
    >
      <Image
        src="/images/logo-gimma.png"
        alt="Gimma Clothing"
        width={px}
        height={px}
        className="h-full w-full rounded-full object-cover"
        priority={size === "lg"}
      />
    </span>
  )

  if (!href) return logo

  return (
    <Link href={href} className="inline-flex shrink-0">
      {logo}
    </Link>
  )
}
