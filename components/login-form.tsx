"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface LoginFormProps {
    onLogin: (user: any) => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
    const [isSignUp, setIsSignUp] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!username || !password) {
            setError("Please fill in all fields")
            return
        }

        if (isSignUp) {
            const existingUsers = JSON.parse(localStorage.getItem("nnn_users") || "[]")
            if (existingUsers.some((u: any) => u.username === username)) {
                setError("Username already exists")
                return
            }

            const newUser = {
                id: Date.now().toString(),
                username,
                password,
                createdAt: new Date().toISOString(),
                failedAt: null,
            }

            existingUsers.push(newUser)
            localStorage.setItem("nnn_users", JSON.stringify(existingUsers))
            localStorage.setItem("nnn_user", JSON.stringify(newUser))
            onLogin(newUser)
        } else {
            const existingUsers = JSON.parse(localStorage.getItem("nnn_users") || "[]")
            const user = existingUsers.find((u: any) => u.username === username && u.password === password)

            if (!user) {
                setError("Invalid username or password")
                return
            }

            localStorage.setItem("nnn_user", JSON.stringify(user))
            onLogin(user)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-10 text-6xl animate-bounce" style={{ animationDelay: "0s" }}>
                    🎃
                </div>
                <div className="absolute top-20 right-20 text-5xl animate-pulse">🕷️</div>
                <div className="absolute bottom-20 left-1/4 text-6xl animate-bounce" style={{ animationDelay: "0.5s" }}>
                    🎃
                </div>
                <div className="absolute bottom-10 right-10 text-5xl animate-pulse" style={{ animationDelay: "0.3s" }}>
                    🕷️
                </div>
            </div>

            <Card className="w-full max-w-md bg-card border-2 border-primary/50 backdrop-blur relative z-10 shadow-2xl">
                <div className="p-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                            🎃 NNN 🎃
                        </h1>
                        <p className="text-muted-foreground">No Nut November Tracker</p>
                        <p className="text-xs text-accent mt-2">Spooky Season Challenge</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Username</label>
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="bg-input border-primary/30 text-foreground placeholder:text-muted-foreground/50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="bg-input border-primary/30 text-foreground placeholder:text-muted-foreground/50"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold"
                        >
                            {isSignUp ? "Sign Up" : "Login"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground text-sm">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp)
                                    setError("")
                                }}
                                className="ml-2 text-primary hover:text-accent hover:underline font-medium transition-colors"
                            >
                                {isSignUp ? "Login" : "Sign Up"}
                            </button>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
