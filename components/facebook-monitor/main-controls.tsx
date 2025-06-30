"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, Download, Bell, BellOff, Settings, Loader2 } from "lucide-react"

interface MainControlsProps {
  loading: boolean
  autoReload: boolean
  postsCount: number
  onLoadPosts: () => void
  onDownloadCSV: () => void
  onToggleAutoReload: () => void
  onOpenSettings: () => void
  language: "ar" | "en"
}

export function MainControls({
  loading,
  autoReload,
  postsCount,
  onLoadPosts,
  onDownloadCSV,
  onToggleAutoReload,
  onOpenSettings,
  language,
}: MainControlsProps) {
  const t = {
    ar: {
      loadPosts: "تحميل المنشورات",
      downloadCSV: "تحميل CSV",
      autoReload: "التحديث التلقائي",
      stopAutoReload: "إيقاف التحديث التلقائي",
      settings: "الإعدادات",
    },
    en: {
      loadPosts: "Load Posts",
      downloadCSV: "Download CSV",
      autoReload: "Auto Reload",
      stopAutoReload: "Stop Auto Reload",
      settings: "Settings",
    },
  }

  const text = t[language]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Button
        onClick={onLoadPosts}
        disabled={loading}
        className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
        {text.loadPosts}
      </Button>
      <Button
        onClick={onDownloadCSV}
        variant="outline"
        className="h-12 bg-white/50 backdrop-blur-sm hover:bg-white/70"
        disabled={postsCount === 0}
      >
        <Download className="w-4 h-4 mr-2" />
        {text.downloadCSV}
      </Button>
      <Button
        onClick={onToggleAutoReload}
        variant={autoReload ? "destructive" : "outline"}
        className="h-12 backdrop-blur-sm"
      >
        {autoReload ? <BellOff className="w-4 h-4 mr-2" /> : <Bell className="w-4 h-4 mr-2" />}
        {autoReload ? text.stopAutoReload : text.autoReload}
      </Button>
      <Button
        variant="outline"
        className="h-12 bg-white/50 backdrop-blur-sm hover:bg-white/70"
        onClick={onOpenSettings}
      >
        <Settings className="w-4 h-4 mr-2" />
        {text.settings}
      </Button>
    </div>
  )
}
