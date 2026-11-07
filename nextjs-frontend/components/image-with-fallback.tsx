"use client"

import { useState } from "react"
import { NoImagePlaceholder } from "@/components/no-image-placeholder"

interface ImageWithFallbackProps {
  src: string | null | undefined
  alt: string
  className?: string
  placeholderVariant?: "square" | "portrait" | "landscape" | "circle" | "banner"
  placeholderLabel?: string
  placeholderClassName?: string
}

export function ImageWithFallback({
  src,
  alt,
  className = "",
  placeholderVariant = "portrait",
  placeholderLabel = "Sin imagen",
  placeholderClassName = "",
}: ImageWithFallbackProps) {
  const [imgError, setImgError] = useState(false)

  if (!src || imgError) {
    return (
      <NoImagePlaceholder
        variant={placeholderVariant}
        className={placeholderClassName || className}
        label={placeholderLabel}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImgError(true)}
    />
  )
}
