"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NovemberCountdown() {
    const [timeLeft, setTimeLeft] = useState<{
        days: number
        hours: number
        minutes: number
        seconds: number
        isNovember: boolean
    } | null>(null)

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()
            const currentYear = now.getFullYear()

            // Check if we're in November
            const isNovember = now.getMonth() === 10 // November is month 10 (0-indexed)

            let targetDate: Date

            if (isNovember) {
                // If in November, count down to end of November
                targetDate = new Date(currentYear, 10, 30, 23, 59, 59)
            } else if (now.getMonth() < 10) {
                // If before November, count down to start of November
                targetDate = new Date(currentYear, 10, 1, 0, 0, 0)
            } else {
                // If after November, count down to next year's November
                targetDate = new Date(currentYear + 1, 10, 1, 0, 0, 0)
            }

            const difference = targetDate.getTime() - now.getTime()

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                    isNovember,
                })
            } else {
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    isNovember,
                })
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)
        return () => clearInterval(timer)
    }, [])

    if (!timeLeft) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-950 via-purple-950 to-black p-4 relative overflow-hidden">
                {/* Halloween background decorations */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-6xl">🎃</div>
                    <div className="absolute top-20 right-20 text-5xl">🕷️</div>
                    <div className="absolute bottom-20 left-1/4 text-6xl">🎃</div>
                    <div className="absolute bottom-10 right-10 text-5xl">🕷️</div>
                </div>
                <Card className="w-full max-w-md relative z-10">
                    <CardHeader>
                        <CardTitle>No Nut November</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="animate-pulse h-20 bg-slate-700 rounded" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-950 via-purple-950 to-black p-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                {/* Pumpkins */}
                <div className="absolute top-8 left-8 text-7xl animate-bounce" style={{ animationDelay: "0s" }}>
                    🎃
                </div>
                <div className="absolute top-20 right-12 text-6xl animate-bounce" style={{ animationDelay: "0.5s" }}>
                    🎃
                </div>
                <div className="absolute bottom-20 left-1/4 text-7xl animate-bounce" style={{ animationDelay: "1s" }}>
                    🎃
                </div>
                <div className="absolute bottom-10 right-1/4 text-6xl animate-bounce" style={{ animationDelay: "0.3s" }}>
                    🎃
                </div>

                {/* Spiders */}
                <div className="absolute top-1/4 right-8 text-5xl animate-pulse">🕷️</div>
                <div className="absolute top-1/3 left-12 text-4xl animate-pulse" style={{ animationDelay: "0.5s" }}>
                    🕷️
                </div>
                <div className="absolute bottom-1/3 right-1/3 text-5xl animate-pulse" style={{ animationDelay: "1s" }}>
                    🕷️
                </div>

                {/* Cobwebs */}
                <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 1000 1000">
                    <path d="M 100 100 Q 300 200 500 100 T 900 100" stroke="white" strokeWidth="2" fill="none" />
                    <path d="M 150 150 L 250 250 L 350 150" stroke="white" strokeWidth="1.5" fill="none" />
                    <path d="M 700 200 L 800 300 L 900 200" stroke="white" strokeWidth="1.5" fill="none" />
                    <path d="M 50 500 Q 200 600 400 500 T 950 500" stroke="white" strokeWidth="2" fill="none" />
                </svg>
            </div>

            <Card className="w-full max-w-md border-orange-500/50 relative z-10 bg-slate-900/95 backdrop-blur">
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
                        🎃 No Nut November 🎃
                    </CardTitle>
                    <CardDescription className="text-lg mt-2 text-orange-300">
                        {timeLeft.isNovember ? "🕷️ Challenge Active! 🕷️" : "👻 Coming Soon 👻"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {timeLeft.isNovember ? (
                        <>
                            <p className="text-center text-orange-200 text-sm font-semibold">Time remaining in November:</p>
                            <div className="grid grid-cols-4 gap-2">
                                <div className="bg-gradient-to-br from-orange-500/30 to-orange-600/20 rounded-lg p-4 text-center border-2 border-orange-500/60 hover:border-orange-400 transition">
                                    <div className="text-2xl font-bold text-orange-300">{timeLeft.days}</div>
                                    <div className="text-xs text-orange-200 mt-1 font-semibold">Days</div>
                                </div>
                                <div className="bg-gradient-to-br from-orange-500/30 to-orange-600/20 rounded-lg p-4 text-center border-2 border-orange-500/60 hover:border-orange-400 transition">
                                    <div className="text-2xl font-bold text-orange-300">{String(timeLeft.hours).padStart(2, "0")}</div>
                                    <div className="text-xs text-orange-200 mt-1 font-semibold">Hours</div>
                                </div>
                                <div className="bg-gradient-to-br from-orange-500/30 to-orange-600/20 rounded-lg p-4 text-center border-2 border-orange-500/60 hover:border-orange-400 transition">
                                    <div className="text-2xl font-bold text-orange-300">{String(timeLeft.minutes).padStart(2, "0")}</div>
                                    <div className="text-xs text-orange-200 mt-1 font-semibold">Mins</div>
                                </div>
                                <div className="bg-gradient-to-br from-orange-500/30 to-orange-600/20 rounded-lg p-4 text-center border-2 border-orange-500/60 hover:border-orange-400 transition">
                                    <div className="text-2xl font-bold text-orange-300">{String(timeLeft.seconds).padStart(2, "0")}</div>
                                    <div className="text-xs text-orange-200 mt-1 font-semibold">Secs</div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-lg p-4 text-center">
                                <p className="text-green-300 font-bold text-lg">🎃 The challenge is live! 🎃</p>
                                <p className="text-sm text-green-200 mt-2">Stay strong and track your progress</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-center text-purple-200 text-sm font-semibold">Time until November starts:</p>
                            <div className="grid grid-cols-4 gap-2">
                                <div className="bg-gradient-to-br from-purple-500/30 to-purple-600/20 rounded-lg p-4 text-center border-2 border-purple-500/60 hover:border-purple-400 transition">
                                    <div className="text-2xl font-bold text-purple-300">{timeLeft.days}</div>
                                    <div className="text-xs text-purple-200 mt-1 font-semibold">Days</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-500/30 to-purple-600/20 rounded-lg p-4 text-center border-2 border-purple-500/60 hover:border-purple-400 transition">
                                    <div className="text-2xl font-bold text-purple-300">{String(timeLeft.hours).padStart(2, "0")}</div>
                                    <div className="text-xs text-purple-200 mt-1 font-semibold">Hours</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-500/30 to-purple-600/20 rounded-lg p-4 text-center border-2 border-purple-500/60 hover:border-purple-400 transition">
                                    <div className="text-2xl font-bold text-purple-300">{String(timeLeft.minutes).padStart(2, "0")}</div>
                                    <div className="text-xs text-purple-200 mt-1 font-semibold">Mins</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-500/30 to-purple-600/20 rounded-lg p-4 text-center border-2 border-purple-500/60 hover:border-purple-400 transition">
                                    <div className="text-2xl font-bold text-purple-300">{String(timeLeft.seconds).padStart(2, "0")}</div>
                                    <div className="text-xs text-purple-200 mt-1 font-semibold">Secs</div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-500/50 rounded-lg p-4 text-center">
                                <p className="text-purple-300 font-bold text-lg">👻 Get ready for the challenge! 👻</p>
                                <p className="text-sm text-purple-200 mt-2">November is coming soon</p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
