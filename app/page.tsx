"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import NovemberCountdown from "@/components/november-countdown"

export default function Home() {
  const router = useRouter()
  const [isNovember, setIsNovember] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const now = new Date()
    const inNovember = now.getMonth() === 10 // November is month 10 (0-indexed)
    setIsNovember(inNovember)
    setIsLoading(false)

    if (inNovember) {
      router.push("/dashboard")
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-pulse">
          <div className="h-20 w-20 bg-slate-700 rounded" />
        </div>
      </div>
    )
  }

  // Show countdown if not in November
  return <NovemberCountdown />
}
