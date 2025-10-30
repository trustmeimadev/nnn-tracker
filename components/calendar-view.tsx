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

    const checkInMap = new Map(
        checkIns.map((c) => {
            const dateKey = c.date // Already in YYYY-MM-DD format from Supabase
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

    const getSafePeriodsForDay = (checkIn: CheckIn | undefined) => {
        if (!checkIn) return 0
        let count = 0
        if (checkIn.morning === true) count++
        if (checkIn.afternoon === true) count++
        if (checkIn.evening === true) count++
        return count
    }

    const getFailedPeriodForDay = (checkIn: CheckIn | undefined) => {
        if (!checkIn) return null
        if (checkIn.morning === false) return "morning"
        if (checkIn.afternoon === false) return "afternoon"
        if (checkIn.evening === false) return "evening"
        return null
    }

    const getColorClass = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        const checkIn = checkInMap.get(dateStr)
        const failedPeriod = getFailedPeriodForDay(checkIn)

        if (failedPeriod) {
            return "bg-destructive text-destructive-foreground border-2 border-red-600"
        }

        const safePeriods = getSafePeriodsForDay(checkIn)
        if (safePeriods === 3) {
            return "bg-green-600 text-white" // Dark green - all 3 periods safe
        } else if (safePeriods === 2) {
            return "bg-green-500 text-white" // Medium green - 2 periods safe
        } else if (safePeriods === 1) {
            return "bg-green-400 text-white" // Light green - 1 period safe
        }

        return "bg-muted/30 text-muted-foreground border border-border/50" // Gray - not checked
    }

    return (
        <Card className="bg-card border-border/50 p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">November Calendar</h2>

            <div className="flex gap-6 mb-6 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-600"></div>
                    <span className="text-muted-foreground">All 3 periods safe</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span className="text-muted-foreground">2 periods safe</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-400"></div>
                    <span className="text-muted-foreground">1 period safe</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-destructive border-2 border-red-600"></div>
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
                            className={`aspect-square flex items-center justify-center rounded-lg font-semibold text-sm transition-colors ${getColorClass(day)}`}
                        >
                            {day}
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}
