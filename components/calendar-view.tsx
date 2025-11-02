"use client"

import { Card } from "@/components/ui/card"

interface CheckIn {
    id: string
    user_id: string
    date: string
    morning: boolean | null
    afternoon: boolean | null
    evening: boolean | null
}

interface CalendarViewProps {
    checkIns: CheckIn[]
    userId: string
    userFailedAt: string | null
}

export default function CalendarView({ checkIns }: CalendarViewProps) {
    const today = new Date()
    const currentMonth = 10 // November (0-indexed)
    const currentYear = today.getFullYear()

    const daysInMonth = 30 // November has 30 days
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    // Filter check-ins for November
    const novemberCheckIns = checkIns.filter((c) => {
        const checkInDate = new Date(c.date)
        return (
            checkInDate.getFullYear() === currentYear &&
            checkInDate.getMonth() === currentMonth
        )
    })

    // Create a map of check-ins for November
    const checkInMap = new Map(
        novemberCheckIns.map((c) => {
            const dateKey = new Date(c.date).toISOString().split("T")[0] // Ensure YYYY-MM-DD format
            return [dateKey, c]
        }),
    )

    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i)
    }

    const getSafePeriodsForDay = (checkIn: CheckIn | undefined): { count: number; hasFailed: boolean } => {
        if (!checkIn) return { count: 0, hasFailed: false }
        let count = 0
        let hasFailed = false

        // Count safe periods
        if (checkIn.morning === true) count++
        if (checkIn.afternoon === true) count++
        if (checkIn.evening === true) count++

        // Mark as failed if any period is explicitly false
        if (
            checkIn.morning === false ||
            checkIn.afternoon === false ||
            checkIn.evening === false
        ) {
            hasFailed = true
        }

        return { count, hasFailed }
    }

    const getCellStyle = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        const checkIn = checkInMap.get(dateStr)
        const { count, hasFailed } = getSafePeriodsForDay(checkIn)

        if (hasFailed) {
            return {
                backgroundImage: "url('/jakul.gif')", 
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
                border: "2px solid #ff0000", 
            }
        }

        if (count === 3) {
            return {
                backgroundImage: "url('/safe.gif')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "black",
                border: "1px solid #d1d5db",
            }
        }

        if (count === 2) {
            return {
                backgroundImage: "url('/second.gif')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "black",
                border: "1px solid #d1d5db",
            }
        }

        if (count === 1) {
            return {
                backgroundImage: "url('/never-goon.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "black",
                border: "1px solid #d1d5db",
            }
        }

        // Default style for days without any check-ins
        return {
            backgroundColor: "#000",
            color: "var(--color-muted-foreground)",
            border: "1px solid var(--color-border)",
        }
    }

    return (
        <Card className="bg-card border-border/50 p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">November Calendar</h2>

            <div className="flex gap-6 mb-6 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded"
                        style={{
                            backgroundImage: "url('/safe.gif')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    ></div>
                    <span className="text-muted-foreground">All 3 periods safe</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded"
                        style={{
                            backgroundImage: "url('/second.gif')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    ></div>
                    <span className="text-muted-foreground">2 periods safe</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded"
                        style={{
                            backgroundImage: "url('/gooner.gif')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    ></div>
                    <span className="text-muted-foreground">1 period safe</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded"
                        style={{
                            backgroundImage: "url('/jakul.gif')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    ></div>
                    <span className="text-muted-foreground">Failed</span>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                        {day}
                    </div>
                ))}

                {days.map((day, idx) => {
                    if (day === null) {
                        return <div key={`empty-${idx}`} className="aspect-square" />
                    }

                    return (
                        <div
                            key={day}
                            style={getCellStyle(day)} // Apply dynamic styles here
                            className="aspect-square flex items-center justify-center rounded-lg font-semibold text-sm transition-colors"
                        >
                            {day}
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}