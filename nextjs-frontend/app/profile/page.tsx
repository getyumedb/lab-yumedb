"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function ProfileRedirect() {
  const { user, isAuthenticated, hydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!hydrated) return
    if (isAuthenticated && user) {
      router.replace(`/user/${user.username}`)
    } else {
      router.replace("/login")
    }
  }, [hydrated, isAuthenticated, user, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
