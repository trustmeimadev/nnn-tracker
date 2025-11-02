"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import Image from "next/image" // Import Next.js Image component

interface User {
    id: string
    username: string
    failed_at: string | null
    created_at: string
}

interface LeaderboardProps {
    currentUserId: string
}

export default function Leaderboard({ currentUserId }: LeaderboardProps) {
    const [stillIn, setStillIn] = useState<User[]>([])
    const [hallOfFallen, setHallOfFallen] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            const supabase = createClient()
            const { data: users } = await supabase.from("users").select("*")

            if (users) {
                const calculateDaysSurvived = (user: User) => {
                    const novemberStart = new Date(new Date().getFullYear(), 10, 1)
                    let endDate: Date

                    if (user.failed_at) {
                        endDate = new Date(user.failed_at)
                    } else {
                        endDate = new Date()
                    }

                    const days = Math.floor((endDate.getTime() - novemberStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
                    return Math.max(0, days)
                }

                const inChallenge = users
                    .filter((u) => !u.failed_at)
                    .sort((a, b) => calculateDaysSurvived(b) - calculateDaysSurvived(a))

                const failed = users
                    .filter((u) => u.failed_at)
                    .sort((a, b) => calculateDaysSurvived(b) - calculateDaysSurvived(a))

                setStillIn(inChallenge)
                setHallOfFallen(failed)
            }

            setIsLoading(false)
        }

        fetchUsers()
    }, [])

    const calculateDaysSurvived = (user: User) => {
        const novemberStart = new Date(new Date().getFullYear(), 10, 1)
        let endDate: Date

        if (user.failed_at) {
            endDate = new Date(user.failed_at)
        } else {
            endDate = new Date()
        }

        const days = Math.floor((endDate.getTime() - novemberStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
        return Math.max(0, days)
    }

    if (isLoading) {
        return <div className="text-center text-muted-foreground">Loading leaderboard...</div>
    }

    return (
        <div className="space-y-8">
            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-primary/50 p-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
                    🏆 Still In Champions
                </h2>

                {stillIn.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No one is still in the challenge</p>
                ) : (
                    <div className="space-y-2">
                        {stillIn.map((user, idx) => (
                            <div
                                key={user.id}
                                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${user.id === currentUserId
                                    ? "bg-primary/20 border-primary"
                                    : "bg-muted/30 border-primary/30 hover:bg-muted/50 hover:border-primary/50"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 relative">
                                        {idx === 0 && (
                                            <Image
                                                src="/first-place.gif"
                                                alt="First Place"
                                                layout="fill"
                                            // className=""
                                            />
                                        )}
                                        {idx === 1 && (
                                            <Image
                                                src="/second-place.gif"
                                                alt="Second Place"
                                                layout="fill"
                                            // className="rounded-full"
                                            />
                                        )}
                                        {idx === 2 && (
                                            <Image
                                                src="/third-place.gif"
                                                alt="Third Place"
                                                layout="fill"
                                            // className="rounded-full"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{user.username}</p>
                                        <p className="text-xs text-muted-foreground">Still going strong</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">{calculateDaysSurvived(user)}</p>
                                    <p className="text-xs text-muted-foreground">days</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>


            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-destructive/50 p-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-destructive to-accent bg-clip-text text-transparent mb-6">
                    💀 Fallen Soldiers
                </h2>
                <p className="text-center text-muted-foreground text-sm mb-4">Jakul pa more</p>

                {hallOfFallen.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No one has failed yet</p>
                ) : (
                    <div className="space-y-2">
                        {hallOfFallen.map((user, idx) => (
                            <div
                                key={user.id}
                                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${user.id === currentUserId
                                    ? "bg-destructive/20 border-destructive"
                                    : "bg-muted/30 border-destructive/30 hover:bg-muted/50 hover:border-destructive/50"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl font-bold w-8 text-center">{idx + 1}</div>
                                    <div>
                                        <p className="font-semibold text-foreground">{user.username}</p>
                                        <p className="text-xs text-destructive">Failed on day {calculateDaysSurvived(user)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-destructive">{calculateDaysSurvived(user)}</p>
                                    <p className="text-xs text-muted-foreground">days lasted</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}