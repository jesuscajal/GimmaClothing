import clsx from "clsx"

type Props = {
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZES = {
  sm: { gimma: "text-lg", clothing: "text-[8px] tracking-[0.35em]" },
  md: { gimma: "text-2xl", clothing: "text-[9px] tracking-[0.4em]" },
  lg: { gimma: "text-4xl", clothing: "text-[10px] tracking-[0.45em]" },
}

export default function GimmaBrandTitle({
  size = "md",
  className = "",
}: Props) {
  const s = SIZES[size]

  return (
    <div className={clsx("flex flex-col items-center text-center", className)}>
      <span
        className={clsx(
          "font-serif font-semibold leading-none tracking-wide text-black",
          s.gimma
        )}
      >
        GIMMA
      </span>
      <span className="mt-0.5 flex items-center gap-1">
        <span className="text-[10px] text-black" aria-hidden>
          ♥
        </span>
        <span
          className={clsx(
            "font-sans font-medium uppercase text-neutral-600",
            s.clothing
          )}
        >
          Clothing
        </span>
      </span>
    </div>
  )
}
