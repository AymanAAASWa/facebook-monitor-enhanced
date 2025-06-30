"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Globe, Sun, Moon, LogOut, RefreshCw, Loader2 } from "lucide-react"

interface HeaderProps {
  title: string
  subtitle: string
  language: "ar" | "en"
  setLanguage: (lang: "ar" | "en") => void
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
  userName: string
  lastUpdate: Date | null
  loadingSettings: boolean
  loading: boolean
  onLoadPosts: () => void
  onLogout: () => void
}

export function Header({
  title,
  subtitle,
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  userName,
  lastUpdate,
  loadingSettings,
  loading,
  onLoadPosts,
  onLogout,
}: HeaderProps) {
  return (
    <Card
      className={`shadow-2xl border-0 overflow-hidden ${
        darkMode ? "bg-gradient-to-r from-gray-800 to-slate-800 backdrop-blur-xl" : "bg-white/90 backdrop-blur-xl"
      }`}
    >
      <CardHeader className="relative bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">{title}</h1>
              <p className="text-blue-100 drop-shadow">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Globe className="w-4 h-4 mr-2" />
                {language === "ar" ? "EN" : "AR"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <div className="text-sm text-blue-100 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                مرحباً, {userName}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {lastUpdate && (
                <div className="text-sm text-blue-100 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  آخر تحديث: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
              {loadingSettings && (
                <div className="text-sm text-blue-100 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  جاري التحميل...
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoadPosts}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                تحميل المنشورات
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
