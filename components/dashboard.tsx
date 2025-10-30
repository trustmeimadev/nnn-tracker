"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CheckInForm from "./check-in-form"
import CalendarView from "./calendar-view"
import Leaderboard from "./leaderboard"
import ProfilePage from "./profile-page"
import CountdownTimer from "./countdown-timer"
import { countFailuresForUser } from "@/lib/tracker-utils"
import type { User } from "@supabase/supabase-js"

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

interface DashboardProps {
    user: User
    userData: UserData | null
    checkIns: CheckIn[]
}

export default function Dashboard({ user, userData, checkIns: initialCheckIns }: DashboardProps) {
    const [activeTab, setActiveTab] = useState("dashboard")
    const [checkIns, setCheckIns] = useState<CheckIn[]>(initialCheckIns)
    const [daysSurvived, setDaysSurvived] = useState(0)
    const [userFailedAt, setUserFailedAt] = useState<string | null>(userData?.failed_at || null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (userFailedAt) {
            const failedDate = new Date(userFailedAt)
            const novemberStart = new Date(new Date().getFullYear(), 10, 1)
            const days = Math.floor((failedDate.getTime() - novemberStart.getTime()) / (1000 * 60 * 60 * 24))
            setDaysSurvived(Math.max(0, days))
        } else {
            const today = new Date()
            const novemberStart = new Date(today.getFullYear(), 10, 1)
            const days = Math.floor((today.getTime() - novemberStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
            setDaysSurvived(days)
        }
    }, [userFailedAt])

    const failureCount = countFailuresForUser(checkIns)
    const isEliminated = failureCount >= 3 || !!userFailedAt

    const handleLogout = async () => {
        setIsLoading(true)
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/auth/login")
    }

    const todayCheckIn = checkIns.find((c) => c.date === new Date().toISOString().split("T")[0])
    const todayStatus = isEliminated
        ? "Eliminated"
        : todayCheckIn &&
            (todayCheckIn.morning === true || todayCheckIn.afternoon === true || todayCheckIn.evening === true)
            ? "Strong"
            : "Not checked"

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b-2 border-primary/50 bg-gradient-to-r from-card via-card to-accent/20 backdrop-blur sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            🎃 NNN Tracker 🎃
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isEliminated ? "💀 Challenge Over" : "🏆 Welcome"}, {userData?.username}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <CountdownTimer />
                        <Button
                            onClick={handleLogout}
                            disabled={isLoading}
                            variant="outline"
                            className="border-primary/50 text-foreground hover:bg-primary/10 bg-transparent"
                        >
                            {isLoading ? "Logging out..." : "Logout"}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-card border-2 border-primary/50">
                        <TabsTrigger
                            value="dashboard"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground"
                        >
                            Dashboard
                        </TabsTrigger>
                        <TabsTrigger
                            value="calendar"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground"
                        >
                            Calendar
                        </TabsTrigger>
                        <TabsTrigger
                            value="leaderboard"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground"
                        >
                            Leaderboard
                        </TabsTrigger>
                        <TabsTrigger
                            value="profile"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground"
                        >
                            Profile
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-primary/50 p-6">
                                <div className="text-center">
                                    <p className="text-muted-foreground text-sm mb-2">Days Survived</p>
                                    <p className={`text-5xl font-bold ${isEliminated ? "text-destructive" : "text-primary"}`}>
                                        {daysSurvived}
                                    </p>
                                    <p className="text-muted-foreground text-xs mt-2">in November</p>
                                </div>
                            </Card>

                            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-accent/50 p-6">
                                <div className="text-center">
                                    <p className="text-muted-foreground text-sm mb-2">Status</p>
                                    <p className={`text-2xl font-bold ${isEliminated ? "text-destructive" : "text-accent"}`}>
                                        {isEliminated ? "💀 Out" : "🏆 Still In"}
                                    </p>
                                </div>
                            </Card>

                            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-primary/50 p-6">
                                <div className="text-center">
                                    <p className="text-muted-foreground text-sm mb-2">Strikes</p>
                                    <p className={`text-5xl font-bold ${failureCount >= 3 ? "text-destructive" : "text-primary"}`}>
                                        {failureCount}/3
                                    </p>
                                    <p className="text-muted-foreground text-xs mt-2">failures</p>
                                </div>
                            </Card>
                        </div>

                        <CheckInForm
                            userId={user.id}
                            userHasFailed={isEliminated}
                            onCheckInUpdate={() => {
                                router.refresh()
                            }}
                            onUserFailed={() => {
                                setUserFailedAt(new Date().toISOString().split("T")[0])
                            }}
                        />
                    </TabsContent>

                    <TabsContent value="calendar" className="mt-6">
                        <CalendarView checkIns={checkIns} userId={user.id} userFailedAt={userFailedAt} />
                    </TabsContent>

                    <TabsContent value="leaderboard" className="mt-6">
                        <Leaderboard currentUserId={user.id} />
                    </TabsContent>

                    <TabsContent value="profile" className="mt-6">
                        <ProfilePage user={userData} checkIns={checkIns} daysSurvived={daysSurvived} userFailedAt={userFailedAt} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
