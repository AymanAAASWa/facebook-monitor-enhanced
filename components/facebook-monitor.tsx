"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PostsList } from "@/components/posts-list"
import { UserTable } from "@/components/user-table"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { EnhancedDataViewer } from "@/components/enhanced-data-viewer"
import { AdvancedAnalyticsDashboard } from "@/components/advanced-analytics-dashboard"
import { SettingsPanel } from "@/components/settings-panel"
import { PhoneDatabaseManager } from "@/components/phone-database-manager"
import { NotificationsPanel } from "@/components/notifications-panel"
import { AutoCollectionControl } from "@/components/auto-collection-control"
import { BulkDataLoaderDialog } from "@/components/bulk-data-loader-dialog"
import { ReportGenerator } from "@/components/report-generator"
import { DocumentationExport } from "@/components/documentation-export"
import { SiteMapViewer } from "@/components/site-map-viewer"
import { FileStructureViewer } from "@/components/file-structure-viewer"
import { FacebookService } from "@/lib/facebook-service"
import { useAppContext } from "@/lib/app-context"
import { 
  Activity,
  BarChart3, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Database,
  Settings,
  BookOpen,
  FolderTree,
  Bell,
  Play,
  FileText,
  Globe,
  Home,
  Shield,
  Upload,
  Download,
  Search,
  Filter,
  RefreshCw,
  Menu,
  X
} from "lucide-react"

interface Post {
  id: string
  message?: string
  created_time: string
  likes?: { data: any[] }
  comments?: { data: any[] }
  shares?: { count: number }
  from?: { name: string; id: string }
  source?: string
}

export function FacebookMonitor() {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { darkMode, language } = useAppContext()

  const navigationItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: Home, color: "text-blue-500" },
    { id: "posts", label: "المنشورات", icon: FileText, color: "text-green-500", badge: posts.length },
    { id: "users", label: "المستخدمون", icon: Users, color: "text-purple-500", badge: users.length },
    { id: "analytics", label: "التحليلات", icon: BarChart3, color: "text-orange-500" },
    { id: "enhanced-data", label: "البيانات المحسنة", icon: Database, color: "text-cyan-500" },
    { id: "advanced-analytics", label: "التحليلات المتقدمة", icon: TrendingUp, color: "text-pink-500" },
    { id: "notifications", label: "الإشعارات", icon: Bell, color: "text-red-500" },
    { id: "auto-collection", label: "التجميع التلقائي", icon: Play, color: "text-indigo-500" },
    { id: "phone-database", label: "قاعدة الأرقام", icon: Shield, color: "text-yellow-500" },
    { id: "reports", label: "التقارير", icon: FileText, color: "text-emerald-500" },
    { id: "settings", label: "الإعدادات", icon: Settings, color: "text-gray-500" }
  ]

  const fetchData = async () => {
    setLoading(true)
    try {
      const facebookService = new FacebookService()
      // جلب المنشورات من مصدر افتراضي أو من الإعدادات
      const settings = JSON.parse(localStorage.getItem("facebook_settings") || "{}")
      const sources = settings.sources || []

      if (sources.length > 0) {
        const allPosts: Post[] = []
        for (const source of sources) {
          try {
            const result = await facebookService.getPosts(source.id, source.type, 25)
            if (result.data) {
              const postsWithSource = result.data.map((p: any) => ({
                ...p,
                source: source.name
              }))
              allPosts.push(...postsWithSource)
            }
          } catch (error) {
            console.error(`خطأ في جلب البيانات من ${source.name}:`, error)
          }
        }
        setPosts(allPosts)
      }

      // يمكن إضافة جلب المستخدمين هنا إذا كان متاحاً
      setUsers([])
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent posts={posts} users={users} loading={loading} />
      case "posts":
        return <PostsList posts={posts} />
      case "users":
        return <UserTable users={users} />
      case "analytics":
        return <AnalyticsDashboard />
      case "enhanced-data":
        return <EnhancedDataViewer />
      case "advanced-analytics":
        return <AdvancedAnalyticsDashboard />
      case "notifications":
        return <NotificationsPanel />
      case "auto-collection":
        return <AutoCollectionControl />
      case "phone-database":
        return <PhoneDatabaseManager />
      case "reports":
        return <ReportGenerator />
      case "settings":
        return <SettingsPanel />
      default:
        return <DashboardContent posts={posts} users={users} loading={loading} />
    }
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-16'} transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-blue-600">FB Tracker Pro</h1>
                <p className="text-sm text-gray-500">مراقب فيسبوك المحترف</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-10 ${!sidebarOpen && 'px-2'}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
                  {sidebarOpen && (
                    <>
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              )
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {sidebarOpen ? (
            <div className="space-y-2">
              <BulkDataLoaderDialog 
                onStartLoad={() => {
                  setIsLoadingBulk(true)
                  console.log("بدء تحميل البيانات المجمعة...")
                }}
              />
              <Button
                onClick={fetchData}
                disabled={loading}
                className="w-full gap-2"
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                تحديث البيانات
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button size="sm" className="w-full p-2">
                <Upload className="w-4 h-4" />
              </Button>
              <Button
                onClick={fetchData}
                disabled={loading}
                size="sm"
                className="w-full p-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {navigationItems.find(item => item.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                إدارة ومراقبة حسابات فيسبوك بكفاءة عالية
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Search className="w-4 h-4" />
                بحث
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                فلترة
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                تصدير
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard Content Component
function DashboardContent({ posts, users, loading }: { posts: Post[], users: any[], loading: boolean }) {
  const stats = [
    { title: "إجمالي المنشورات", value: posts.length, icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "المستخدمون", value: users.length, icon: Users, color: "text-green-500", bg: "bg-green-50" },
    { title: "التعليقات", value: posts.reduce((acc, post) => acc + (post.comments?.data?.length || 0), 0), icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "الإعجابات", value: posts.reduce((acc, post) => acc + (post.likes?.data?.length || 0), 0), icon: Activity, color: "text-orange-500", bg: "bg-orange-50" }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value.toLocaleString()}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                آخر المنشورات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <PostsList posts={posts.slice(0, 5)} compact />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                إحصائيات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">معدل التفاعل</span>
                <Badge variant="secondary">85%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">المنشورات اليوم</span>
                <Badge variant="secondary">{posts.filter(p => new Date(p.created_time).toDateString() === new Date().toDateString()).length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">أكثر المستخدمين نشاطاً</span>
                <Badge variant="secondary">12</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-500" />
                الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">منشور جديد</p>
                  <p className="text-xs text-gray-600">تم إضافة منشور جديد منذ 5 دقائق</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium">تعليق جديد</p>
                  <p className="text-xs text-gray-600">تعليق جديد على منشور شائع</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}