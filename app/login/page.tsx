"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Mock authentication
    setTimeout(() => {
      if (email === "admin@crisistruth.org" && password === "admin123") {
        window.location.href = "/admin"
      } else if (email === "factchecker@crisistruth.org" && password === "checker123") {
        window.location.href = "/dashboard"
      } else if (email && password) {
        window.location.href = "/dashboard"
      } else {
        setError("Invalid email or password")
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image src="/Gemini_Generate.png" alt="CrisisTruth Logo" width={120} height={32} className="h-8 w-auto" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Sign in to your account to continue fact-checking</p>
        </div>

        {/* Demo Accounts */}
        <Card className="mb-6 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Demo Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-1 sm:gap-2">
              <span className="text-muted-foreground font-medium shrink-0">Admin:</span>
              <Badge variant="secondary" className="text-xs font-mono break-all text-left p-2 sm:p-1">
                admin@crisistruth.org / admin123
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-1 sm:gap-2">
              <span className="text-muted-foreground font-medium shrink-0">Fact-Checker:</span>
              <Badge variant="secondary" className="text-xs font-mono break-all text-left p-2 sm:p-1">
                factchecker@crisistruth.org / checker123
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-1 sm:gap-2">
              <span className="text-muted-foreground font-medium shrink-0">User:</span>
              <Badge variant="secondary" className="text-xs font-mono break-all text-left p-2 sm:p-1">
                Any email / Any password
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between">
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {"Don't have an account? "}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
