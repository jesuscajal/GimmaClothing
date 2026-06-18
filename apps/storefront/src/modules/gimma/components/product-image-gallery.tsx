"use client"

import { useState } from "react"

interface ProductImageGalleryProps {
  images: string[]
  title: string
  defaultImage?: string
}

export default function ProductImageGallery({
  images,
  title,
  defaultImage,
}: ProductImageGalleryProps) {
  // Use defaultImage as initial state, fallback to first image or empty string
  const [activeImage, setActiveImage] = useState(
    defaultImage || images[0] || ""
  )

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main product image container */}
      <div className="aspect-[3/4] overflow-hidden rounded-xl bg-beige-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeImage}
          alt={title}
          className="h-full w-full object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => {
            const isActive = img === activeImage
            return (
              <div
                key={i}
                role="button"
                tabIndex={0}
                onClick={() => setActiveImage(img)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setActiveImage(img)
                  }
                }}
                className={`aspect-square overflow-hidden rounded-lg bg-beige-100 border-2 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "border-black scale-[1.02] ring-1 ring-black/10"
                    : "border-transparent opacity-80 hover:opacity-100 hover:border-beige-300"
                }`}
                aria-label={`Ver foto ${i + 1} de ${title}`}
                aria-current={isActive ? "true" : "false"}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
