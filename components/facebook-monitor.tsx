"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Settings,
  Play,
  Pause,
  RefreshCw,
  Download,
  Users,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  Database,
  Phone,
  Eye,
  BarChart3,
  FileText,
  Globe,
} from "lucide-react"

import { useAppContext } from "@/lib/app-context"
import { facebookService } from "@/lib/facebook-service"
import { firebaseService } from "@/lib/firebase-service"

import { SettingsPanel } from "./settings-panel"
import { EnhancedPostsList } from "./enhanced-posts-list"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { UserTable } from "./user-table"
import { PhoneDatabaseManager } from "./phone-database-manager"
import { EnhancedDataViewer } from "./enhanced-data-viewer"
import { AutoCollectionControl } from "./auto-collection-control"
import { DocumentationExport } from "./documentation-export"

import type { FacebookPost } from "@/lib/facebook-service"

interface MonitoringStats {
  totalPosts: number
  totalUsers: number
  totalComments: number
  phoneNumbersFound: number
  lastUpdate: Date
  isRunning: boolean
  errors: string[]
}

export function FacebookMonitor() {
  const { userSettings, updateSettings, isAuthenticated } = useAppContext()
  const [posts, setPosts] = useState<FacebookPost[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [stats, setStats] = useState<MonitoringStats>({
    totalPosts: 0,
    totalUsers: 0,
    totalComments: 0,
    phoneNumbersFound: 0,
    lastUpdate: new Date(),
    isRunning: false,
    errors: [],
  })
  const [activeTab, setActiveTab] = useState("posts")
  const [showSettings, setShowSettings] = useState(false)
  const [nextPageToken, setNextPageToken] = useState<string>("")

  const t = {
    ar: {
      title: "مراقب الفيسبوك المحسن",
      subtitle: "مراقبة وتحليل المنشورات والتعليقات من الفيسبوك",
      posts: "المنشورات",
      users: "المستخدمون",
      analytics: "التحليلات",
      settings: "الإعدادات",
      phoneDatabase: "قاعدة أرقام الهواتف",
      enhancedData: "البيانات المحسنة",
      autoCollection: "التجميع التلقائي",
      documentation: "التوثيق",
      startMonitoring: "بدء المراقبة",
      stopMonitoring: "إيقاف المراقبة",
      refreshData: "تحديث البيانات",
      exportData: "تصدير البيانات",
      totalPosts: "إجمالي المنشورات",
      totalUsers: "إجمالي المستخدمين",
      totalComments: "إجمالي التعليقات",
      phoneNumbersFound: "أرقام الهواتف المكتشفة",
      lastUpdate: "آخر تحديث",
      status: "الحالة",
      running: "يعمل",
      stopped: "متوقف",
      error: "خطأ",
      success: "نجح",
      loadingPosts: "جاري تحميل المنشورات...",
      noAccessToken: "يرجى إدخال رمز الوصول في الإعدادات",
      noSourcesConfigured: "يرجى تكوين المصادر في الإعدادات",
      monitoringStarted: "تم بدء المراقبة بنجاح",
      monitoringStopped: "تم إيقاف المراقبة",
      dataRefreshed: "تم تحديث البيانات",
      errorLoadingPosts: "خطأ في تحميل المنشورات",
      errorStartingMonitoring: "خطأ في بدء المراقبة",
      configureSettings: "تكوين الإعدادات",
      viewAnalytics: "عرض التحليلات",
      managePhoneDatabase: "إدارة قاعدة أرقام الهواتف",
      viewEnhancedData: "عرض البيانات المحسنة",
      setupAutoCollection: "إعداد التجميع التلقائي",
      exportDocumentation: "تصدير التوثيق",
    },
    en: {
      title: "Enhanced Facebook Monitor",
      subtitle: "Monitor and analyze Facebook posts and comments",
      posts: "Posts",
      users: "Users",
      analytics: "Analytics",
      settings: "Settings",
      phoneDatabase: "Phone Database",
      enhancedData: "Enhanced Data",
      autoCollection: "Auto Collection",
      documentation: "Documentation",
      startMonitoring: "Start Monitoring",
      stopMonitoring: "Stop Monitoring",
      refreshData: "Refresh Data",
      exportData: "Export Data",
      totalPosts: "Total Posts",
      totalUsers: "Total Users",
      totalComments: "Total Comments",
      phoneNumbersFound: "Phone Numbers Found",
      lastUpdate: "Last Update",
      status: "Status",
      running: "Running",
      stopped: "Stopped",
      error: "Error",
      success: "Success",
      loadingPosts: "Loading posts...",
      noAccessToken: "Please enter access token in settings",
      noSourcesConfigured: "Please configure sources in settings",
      monitoringStarted: "Monitoring started successfully",
      monitoringStopped: "Monitoring stopped",
      dataRefreshed: "Data refreshed",
      errorLoadingPosts: "Error loading posts",
      errorStartingMonitoring: "Error starting monitoring",
      configureSettings: "Configure Settings",
      viewAnalytics: "View Analytics",
      managePhoneDatabase: "Manage Phone Database",
      viewEnhancedData: "View Enhanced Data",
      setupAutoCollection: "Setup Auto Collection",
      exportDocumentation: "Export Documentation",
    },
  }

  const text = t[userSettings?.language || "ar"]

  // تحميل المنشورات
  const loadPosts = useCallback(
    async (loadMore = false) => {
      if (!userSettings?.accessToken) {
        setError(text.noAccessToken)
        return
      }

      if (!userSettings.pageId && userSettings.groupIds.length === 0) {
        setError(text.noSourcesConfigured)
        return
      }

      try {
        if (loadMore) {
          setLoadingOlder(true)
        } else {
          setLoading(true)
          setError("")
        }

        const sources = []
        if (userSettings.pageId) {
          sources.push({ id: userSettings.pageId, type: "page" })
        }
        userSettings.groupIds.forEach((groupId) => {
          sources.push({ id: groupId, type: "group" })
        })

        const result = await facebookService.getPostsFromSources(
          sources,
          userSettings.accessToken,
          loadMore ? nextPageToken : undefined,
        )

        if (result.success && result.data) {
          if (loadMore) {
            setPosts((prev) => [...prev, ...result.data.posts])
          } else {
            setPosts(result.data.posts)
          }

          setNextPageToken(result.data.nextPageToken || "")
          setHasMorePosts(!!result.data.nextPageToken)

          // تحديث الإحصائيات
          setStats((prev) => ({
            ...prev,
            totalPosts: loadMore ? prev.totalPosts + result.data.posts.length : result.data.posts.length,
            lastUpdate: new Date(),
          }))

          // حفظ البيانات في Firebase
          if (result.data.posts.length > 0) {
            await firebaseService.savePosts(result.data.posts)
          }

          if (!loadMore) {
            setSuccess(text.dataRefreshed)
            setTimeout(() => setSuccess(""), 3000)
          }
        } else {
          throw new Error(result.error || text.errorLoadingPosts)
        }
      } catch (err: any) {
        console.error("Error loading posts:", err)
        setError(err.message || text.errorLoadingPosts)
        setStats((prev) => ({
          ...prev,
          errors: [...prev.errors, err.message || text.errorLoadingPosts],
        }))
      } finally {
        setLoading(false)
        setLoadingOlder(false)
      }
    },
    [userSettings, nextPageToken, text],
  )

  // بدء المراقبة
  const startMonitoring = useCallback(async () => {
    try {
      setStats((prev) => ({ ...prev, isRunning: true }))
      await loadPosts()
      setSuccess(text.monitoringStarted)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(text.errorStartingMonitoring)
      setStats((prev) => ({ ...prev, isRunning: false }))
    }
  }, [loadPosts, text])

  // إيقاف المراقبة
  const stopMonitoring = useCallback(() => {
    setStats((prev) => ({ ...prev, isRunning: false }))
    setSuccess(text.monitoringStopped)
    setTimeout(() => setSuccess(""), 3000)
  }, [text])

  // التحديث التلقائي
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (stats.isRunning && userSettings?.autoRefresh && userSettings.refreshInterval > 0) {
      interval = setInterval(() => {
        loadPosts()
      }, userSettings.refreshInterval * 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [stats.isRunning, userSettings?.autoRefresh, userSettings?.refreshInterval, loadPosts])

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    if (userSettings?.accessToken && (userSettings.pageId || userSettings.groupIds.length > 0)) {
      loadPosts()
    }
  }, []) // تشغيل مرة واحدة فقط عند التحميل

  // تصدير البيانات
  const exportData = useCallback(() => {
    const dataToExport = {
      posts,
      users,
      stats,
      exportDate: new Date().toISOString(),
      settings: userSettings,
    }

    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `facebook-monitor-export-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [posts, users, stats, userSettings])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-600">
              <Globe className="w-8 h-8 mx-auto mb-2" />
              {text.title}
            </CardTitle>
            <p className="text-gray-600">{text.subtitle}</p>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>يرجى تسجيل الدخول للمتابعة</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${
        userSettings?.darkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-blue-50 to-purple-50"
      }`}
    >
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <Card
          className={`${userSettings?.darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"} backdrop-blur-sm`}
        >
          <CardHeader>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                  <Globe className="w-8 h-8" />
                  {text.title}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{text.subtitle}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  onClick={stats.isRunning ? stopMonitoring : startMonitoring}
                  disabled={loading}
                  className={stats.isRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : stats.isRunning ? (
                    <Pause className="w-4 h-4 mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {stats.isRunning ? text.stopMonitoring : text.startMonitoring}
                </Button>

                <Button onClick={() => loadPosts()} disabled={loading} variant="outline">
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  {text.refreshData}
                </Button>

                <Button onClick={exportData} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  {text.exportData}
                </Button>

                <Button onClick={() => setShowSettings(!showSettings)} variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  {text.settings}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Status and Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <Card
            className={`${userSettings?.darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"} backdrop-blur-sm`}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {stats.isRunning ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="text-sm font-medium">{text.status}</div>
              <div className={`text-xs ${stats.isRunning ? "text-green-600" : "text-gray-500"}`}>
                {stats.isRunning ? text.running : text.stopped}
              </div>
            </CardContent>
          </Card>

          <Card
            className={`${userSettings?.darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"} backdrop-blur-sm`}
          >
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-lg font-bold text-blue-600">{stats.totalPosts}</div>
              <div className="text-xs text-gray-500">{text.totalPosts}</div>
            </CardContent>
          </Card>

          <Card
            className={`${userSettings?.darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"} backdrop-blur-sm`}
          >
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-lg font-bold text-green-600">{stats.totalUsers}</div>
              <div className="text-xs text-gray-500">{text.totalUsers}</div>
            </CardContent>
          </Card>

          <Card
            className={`${userSettings?.darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"} backdrop-blur-sm`}
          >
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <div className="text-lg font-bold text-purple-600">{stats.totalComments}</div>
              <div className="text-xs text-gray-500">{text.totalComments}</div>
            </CardContent>
          </Card>

          <Card
            className={`${userSettings?.darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"} backdrop-blur-sm`}
          >
            <CardContent className="p-4 text-center">
              <Phone className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <div className="text-lg font-bold text-orange-600">{stats.phoneNumbersFound}</div>
              <div className="text-xs text-gray-500">{text.phoneNumbersFound}</div>
            </CardContent>
          </Card>

          <Card
            className={`${userSettings?.darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"} backdrop-blur-sm`}
          >
            <CardContent className="p-4 text-center">
              <RefreshCw className="w-6 h-6 mx-auto mb-2 text-gray-500" />
              <div className="text-xs font-medium">{text.lastUpdate}</div>
              <div className="text-xs text-gray-500">
                {stats.lastUpdate.toLocaleTimeString(userSettings?.language === "ar" ? "ar-EG" : "en-US")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel
            settings={userSettings || {}}
            onSettingsChange={updateSettings}
            onClose={() => setShowSettings(false)}
            darkMode={userSettings?.darkMode || false}
            language={userSettings?.language || "ar"}
          />
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">{text.posts}</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">{text.users}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">{text.analytics}</span>
            </TabsTrigger>
            <TabsTrigger value="phone-database" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">{text.phoneDatabase}</span>
            </TabsTrigger>
            <TabsTrigger value="enhanced-data" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">{text.enhancedData}</span>
            </TabsTrigger>
            <TabsTrigger value="auto-collection" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">{text.autoCollection}</span>
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">{text.documentation}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <EnhancedPostsList
              posts={posts}
              loading={loading}
              loadingOlder={loadingOlder}
              hasMorePosts={hasMorePosts}
              onLoadOlderPosts={() => loadPosts(true)}
              darkMode={userSettings?.darkMode || false}
              language={userSettings?.language || "ar"}
              accessToken={userSettings?.accessToken || ""}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserTable
              users={users}
              darkMode={userSettings?.darkMode || false}
              language={userSettings?.language || "ar"}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsDashboard
              posts={posts}
              users={users}
              darkMode={userSettings?.darkMode || false}
              language={userSettings?.language || "ar"}
            />
          </TabsContent>

          <TabsContent value="phone-database" className="space-y-4">
            <PhoneDatabaseManager
              darkMode={userSettings?.darkMode || false}
              language={userSettings?.language || "ar"}
            />
          </TabsContent>

          <TabsContent value="enhanced-data" className="space-y-4">
            <EnhancedDataViewer darkMode={userSettings?.darkMode || false} language={userSettings?.language || "ar"} />
          </TabsContent>

          <TabsContent value="auto-collection" className="space-y-4">
            <AutoCollectionControl
              darkMode={userSettings?.darkMode || false}
              language={userSettings?.language || "ar"}
              settings={userSettings || {}}
              onSettingsChange={updateSettings}
            />
          </TabsContent>

          <TabsContent value="documentation" className="space-y-4">
            <DocumentationExport darkMode={userSettings?.darkMode || false} language={userSettings?.language || "ar"} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
