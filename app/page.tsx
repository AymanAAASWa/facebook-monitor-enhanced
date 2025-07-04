"use client"

import { useState, useEffect } from "react"
import { AppProvider } from "@/lib/app-context"
import { FacebookMonitor } from "@/components/facebook-monitor"
import { EnhancedDataViewer } from "@/components/enhanced-data-viewer"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { DocumentationExport } from "@/components/documentation-export"
import { ProjectStructureViewer } from "@/components/project-structure-viewer"
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Database,
  Settings,
  BookOpen,
  Activity,
  FolderTree
} from "lucide-react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <AppProvider>
      <div className="w-screen h-screen overflow-hidden">
        <FacebookMonitor />
      </div>
    </AppProvider>
  )
}