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

interface UserData {
    id: string
    username: string
    failed_at: string | null
    created_at: string
}

interface ProfilePageProps {
    user: UserData | null
    checkIns: CheckIn[]
    daysSurvived: number
    userFailedAt: string | null
}

export default function ProfilePage({ user, checkIns, daysSurvived, userFailedAt }: ProfilePageProps) {
    if (!user) {
        return <div className="text-center text-muted-foreground">Loading profile...</div>
    }

    const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    const totalSafePeriods = checkIns.reduce((count, c) => {
        let periodCount = 0
        if (c.morning === true) periodCount++
        if (c.afternoon === true) periodCount++
        if (c.evening === true) periodCount++
        return count + periodCount
    }, 0)

    const totalFailedPeriods = checkIns.reduce((count, c) => {
        let periodCount = 0
        if (c.morning === false) periodCount++
        if (c.afternoon === false) periodCount++
        if (c.evening === false) periodCount++
        return count + periodCount
    }, 0)

    const daysChecked = checkIns.length

    return (
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-primary/50 p-8">
                <div className="text-center mb-8">
                    <div
                        className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-4 ${userFailedAt ? "bg-destructive/20 border-destructive" : "bg-primary/20 border-primary"
                            }`}
                    >
                        <span className="text-4xl font-bold">{userFailedAt ? "💀" : "🏆"}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">{user.username}</h1>
                    <p
                        className={`text-lg font-semibold mt-2 bg-gradient-to-r bg-clip-text text-transparent ${userFailedAt ? "from-destructive to-accent" : "from-primary to-accent"
                            }`}
                    >
                        {userFailedAt ? "Challenge Over" : "Still In"}
                    </p>
                    <p className="text-muted-foreground mt-1">Joined {joinDate}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border-2 border-primary/50">
                        <p className="text-muted-foreground text-sm mb-2">Days Survived</p>
                        <p className={`text-4xl font-bold ${userFailedAt ? "text-destructive" : "text-primary"}`}>{daysSurvived}</p>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg border-2 border-accent/50">
                        <p className="text-muted-foreground text-sm mb-2">Safe Periods</p>
                        <p className="text-4xl font-bold text-accent">{totalSafePeriods}</p>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-destructive/20 to-destructive/10 rounded-lg border-2 border-destructive/50">
                        <p className="text-muted-foreground text-sm mb-2">Failed Periods</p>
                        <p className="text-4xl font-bold text-destructive">{totalFailedPeriods}</p>
                    </div>
                </div>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-primary/50 p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Statistics</h2>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-primary/30">
                        <span className="text-foreground">Days with Check-ins</span>
                        <span className="font-semibold text-primary">{daysChecked}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-primary/30">
                        <span className="text-foreground">Average Safe Periods per Day</span>
                        <span className="font-semibold text-primary">
                            {daysChecked > 0 ? (totalSafePeriods / daysChecked).toFixed(2) : "0"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-primary/30">
                        <span className="text-foreground">Success Rate</span>
                        <span className="font-semibold text-primary">
                            {daysChecked > 0 ? Math.round((totalSafePeriods / (totalSafePeriods + totalFailedPeriods)) * 100) : 0}%
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    )
}
