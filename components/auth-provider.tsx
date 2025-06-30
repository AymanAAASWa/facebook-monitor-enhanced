"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, LogIn } from "lucide-react"

interface User {
  uid: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("facebook_monitor_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("facebook_monitor_user")
      }
    }
    setLoading(false)
  }, [])

  // قم بتحسين دالة login:
  const login = async (email: string, password: string) => {
    // Simple demo authentication - replace with real auth
    if (email && password) {
      const mockUser: User = {
        uid: "user_" + email.replace(/[^a-zA-Z0-9]/g, "_"), // معرف ثابت للمستخدم
        name: email.split("@")[0],
        email: email,
      }
      setUser(mockUser)
      localStorage.setItem("facebook_monitor_user", JSON.stringify(mockUser))
      console.log("User logged in:", mockUser)
    } else {
      throw new Error("Invalid credentials")
    }
  }

  // قم بتحسين دالة logout لمسح الإعدادات المحلية:
  const logout = () => {
    setUser(null)
    localStorage.removeItem("facebook_monitor_user")
    // مسح أي إعدادات محلية أخرى إذا لزم الأمر
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

interface LoginScreenProps {
  darkMode: boolean
  language: "ar" | "en"
}

export function LoginScreen({ darkMode, language }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(email, password)
    } catch (error) {
      setError("فشل في تسجيل الدخول. يرجى المحاولة مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }

  const t = {
    ar: {
      title: "تسجيل الدخول",
      subtitle: "أدخل بياناتك للوصول إلى النظام",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      login: "تسجيل الدخول",
      enterEmail: "أدخل بريدك الإلكتروني",
      enterPassword: "أدخل كلمة المرور",
    },
    en: {
      title: "Sign In",
      subtitle: "Enter your credentials to access the system",
      email: "Email",
      password: "Password",
      login: "Sign In",
      enterEmail: "Enter your email",
      enterPassword: "Enter your password",
    },
  }

  const text = t[language]

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Card className={`w-full max-w-md ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} shadow-2xl`}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {text.title}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">{text.subtitle}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{text.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={text.enterEmail}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">{text.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={text.enterPassword}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
              {text.login}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
