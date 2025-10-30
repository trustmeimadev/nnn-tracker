import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Dashboard from "@/components/dashboard"

export default async function DashboardPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    // Fetch user data
    const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

    // Fetch check-ins for current month
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]

    const { data: checkIns } = await supabase
        .from("check_ins")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", monthStart)
        .lte("date", monthEnd)

    return <Dashboard user={user} userData={userData} checkIns={checkIns || []} />
}
