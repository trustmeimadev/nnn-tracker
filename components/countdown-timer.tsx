"use client"

import { useState, useEffect } from "react"

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date()
            const currentYear = now.getFullYear()

            // Calculate end of November (Nov 30, 11:59:59 PM)
            const endOfNovember = new Date(currentYear, 10, 30, 23, 59, 59)

            // If November has passed, calculate for next year
            if (now > endOfNovember) {
                endOfNovember.setFullYear(currentYear + 1)
            }

            const diff = endOfNovember.getTime() - now.getTime()

            if (diff > 0) {
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
                const minutes = Math.floor((diff / (1000 * 60)) % 60)
                const seconds = Math.floor((diff / 1000) % 60)

                setTimeLeft({ hours, minutes, seconds })
            } else {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
            }
        }

        updateCountdown()
        const interval = setInterval(updateCountdown, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Time Left:</span>
            <span className="font-mono font-bold text-foreground">
                {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
            </span>
        </div>
    )
}
