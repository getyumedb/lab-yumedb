"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface UseInfiniteScrollOptions<T> {
  data: T[]
  pageSize: number
}

export function useInfiniteScroll<T>({ data, pageSize }: UseInfiniteScrollOptions<T>) {
  const [displayCount, setDisplayCount] = useState(pageSize)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const hasMore = displayCount < data.length
  const displayedItems = data.slice(0, displayCount)

  const loadMore = useCallback(() => {
    setDisplayCount((prev) => Math.min(prev + pageSize, data.length))
  }, [pageSize, data.length])

  // Reset when data changes (filters applied)
  useEffect(() => {
    setDisplayCount(pageSize)
  }, [data.length, pageSize])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  return { displayedItems, hasMore, sentinelRef, totalCount: data.length }
}
