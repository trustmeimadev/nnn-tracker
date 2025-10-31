"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import CheckInConfirmation from "./check-in-confirmation"

interface CheckIn {
    id: string
    user_id: string
    date: string
    morning: boolean | null
    afternoon: boolean | null
    evening: boolean | null
}

interface CheckInFormProps {
    userId: string
    userHasFailed: boolean
    onCheckInUpdate: () => void
    onUserFailed: () => void
}

export default function CheckInForm({ userId, userHasFailed, onCheckInUpdate, onUserFailed }: CheckInFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [confirmationState, setConfirmationState] = useState<{
        period: string
        isFailed: boolean
    } | null>(null)
    const [todayCheckIn, setTodayCheckIn] = useState<CheckIn | null>(null)
    const [todayDate, setTodayDate] = useState("")
    const [currentPeriod, setCurrentPeriod] = useState<string | null>(null)

    useEffect(() => {
        const updateDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            setTodayDate(formattedDate);
            fetchTodayCheckIn(formattedDate);
            determineCurrentPeriod();
        };

        updateDate();

        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const msUntilMidnight = tomorrow.getTime() - now.getTime();

        const midnightTimer = setTimeout(updateDate, msUntilMidnight);

        return () => clearTimeout(midnightTimer);
    }, []);

    const fetchTodayCheckIn = async (date: string) => {
        const supabase = createClient()
        const { data, error } = await supabase
            .from("check_ins")
            .select("*")
            .eq("user_id", userId)
            .eq("date", date)
            .single()

        if (error && error.code === "PGRST116") {
            // If no entry exists, create one
            const { error: insertError } = await supabase.from("check_ins").insert({
                user_id: userId,
                date,
                morning: null,
                afternoon: null,
                evening: null,
            })

            // if (insertError) {
            //     console.error("Error creating today's check-in:", insertError)
            // } else {
            //     console.log("Today's check-in entry created")
            // }

            setTodayCheckIn({
                id: "",
                user_id: userId,
                date,
                morning: null,
                afternoon: null,
                evening: null,
            })
        } else if (data) {
            setTodayCheckIn(data as CheckIn)
        } else {
            console.error("Error fetching today's check-in:", error)
        }
    }

    const determineCurrentPeriod = () => {
        const now = new Date()
        const hour = now.getHours()

        if (hour >= 0 && hour < 12) {
            setCurrentPeriod("morning")
        } else if (hour >= 12 && hour < 18) {
            setCurrentPeriod("afternoon")
        } else {
            setCurrentPeriod("evening")
        }
    }

    const periods = [
        { id: "morning", label: "Hindi ka Nagjakul this morning", icon: "🌅", time: "12am - 12pm" },
        { id: "afternoon", label: "Hindi ka Nagjakul this afternoon", icon: "☀️", time: "12pm - 6pm" },
        { id: "evening", label: "Hindi ka Nagjakul this evening", icon: "🌙", time: "6pm - 12am" },
    ]

    const handleSafe = (period: string) => {
        setConfirmationState({ period, isFailed: false })
    }

    const handleFailed = (period: string) => {
        setConfirmationState({ period, isFailed: true })
    }

    const handleConfirm = async () => {
        if (!confirmationState) return

        setIsLoading(true)
        const supabase = createClient()
        const { period, isFailed } = confirmationState

        try {
            const { data: existing } = await supabase
                .from("check_ins")
                .select("*")
                .eq("user_id", userId)
                .eq("date", todayDate)
                .single()

            if (existing) {
                await supabase
                    .from("check_ins")
                    .update({ [period]: isFailed ? false : true })
                    .eq("id", existing.id)
            } else {
                await supabase.from("check_ins").insert({
                    user_id: userId,
                    date: todayDate,
                    [period]: isFailed ? false : true,
                })
            }

            if (isFailed) {
                await supabase.from("users").update({ failed_at: todayDate }).eq("id", userId)
                onUserFailed()
            }

            setConfirmationState(null)
            await fetchTodayCheckIn(todayDate)
            onCheckInUpdate()
        } catch (error) {
            console.error("Error saving check-in:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (userHasFailed) {
        return (
            <Card className="bg-destructive/10 border-destructive/50 p-6">
                <div className="text-center">
                    <p className="text-2xl font-bold text-destructive mb-2">Challenge Over</p>
                    <p className="text-muted-foreground">You&apos;ve been eliminated from the challenge. Better luck next year!</p>
                </div>
            </Card>
        )
    }

    return (
        <>
            <Card className="bg-card border-border/50 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Daily Check-in</h2>
                        <p className="text-muted-foreground text-sm">Today: {todayDate}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Safe Periods</p>
                        <p className="text-2xl font-bold text-green-500">
                            {todayCheckIn
                                ? [todayCheckIn.morning, todayCheckIn.afternoon, todayCheckIn.evening].filter((p) => p === true).length
                                : 0}
                            /3
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {periods.map((period) => {
                        const periodValue = todayCheckIn?.[period.id as keyof CheckIn]
                        const isMarked = periodValue !== null
                        const isCurrentPeriod = currentPeriod === period.id

                        return (
                            <div key={period.id} className="border border-border/50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-foreground flex items-center gap-2">
                                            <span className="text-2xl">{period.icon}</span>
                                            {period.label}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{period.time}</p>
                                    </div>
                                    {isMarked && (
                                        <span className={`text-sm font-semibold ${periodValue ? "text-green-500" : "text-destructive"}`}>
                                            {periodValue ? "✅ Safe" : "❌ Failed"}
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => handleSafe(period.id)}
                                        disabled={isLoading || !isCurrentPeriod || isMarked}
                                        className={`flex-1 ${isCurrentPeriod && !isMarked
                                            ? "bg-green-500/20 hover:bg-green-500/30 text-green-600 border border-green-500/50"
                                            : "bg-muted/20 text-muted-foreground border-muted/50 cursor-not-allowed"
                                            }`}
                                    >
                                        {isLoading ? "..." : "✅ Safe"}
                                    </Button>
                                    <Button
                                        onClick={() => handleFailed(period.id)}
                                        disabled={isLoading || !isCurrentPeriod || isMarked}
                                        className={`flex-1 ${isCurrentPeriod && !isMarked
                                            ? "bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/50"
                                            : "bg-muted/20 text-muted-foreground border-muted/50 cursor-not-allowed"
                                            }`}
                                    >
                                        {isLoading ? "..." : "❌ Failed"}
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Card>

            {confirmationState && (
                <CheckInConfirmation
                    period={confirmationState.period}
                    isFailed={confirmationState.isFailed}
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirmationState(null)}
                    isLoading={isLoading}
                />
            )}
        </>
    )
}