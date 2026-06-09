import Link from "next/link"
import Image from "next/image"

type Props = {
  href?: string | null
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZES = {
  sm: { box: "h-10 w-10", img: 40 },
  md: { box: "h-14 w-14", img: 56 },
  lg: { box: "h-24 w-24", img: 96 },
}

export default function GimmaLogo({
  href = "/demo/inicio",
  size = "md",
  className = "",
}: Props) {
  const { box, img } = SIZES[size]

  const logo = (
    <Image
      src="/images/logo-gimma.png"
      alt="Gimma Clothing"
      width={img}
      height={img}
      className={`${box} rounded-full object-cover ${className}`}
      priority={size === "lg"}
    />
  )

  if (!href) return logo

  return (
    <Link href={href} className="inline-flex shrink-0">
      {logo}
    </Link>
  )
}
