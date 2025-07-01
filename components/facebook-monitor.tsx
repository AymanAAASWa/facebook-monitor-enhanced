أقوم بتحديث وظيفة جلب المنشورات لإضافة تسجيل تصحيح الأخطاء للتعليقات.
```
```replit_final_file
"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "./auth/login-form"
import { FacebookLoginForm } from "./auth/facebook-login-form"
import { useAppContext } from "@/lib/app-context"
import { EnhancedPostsList } from "./enhanced-posts-list"
import { SettingsPanel } from "./settings-panel"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { AdvancedAnalyticsDashboard } from "./advanced-analytics-dashboard"
import { UserTable } from "./user-table"
import { PhoneDatabaseManager } from "./phone-database-manager"
import { CommentsManager } from "./comments-manager"
import { MessagesManager } from "./messages-manager"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Settings,
  BarChart3,
  Users,
  FileText,
  RefreshCw,
  Moon,
  Sun,
  AlertCircle,
  Database,
  Phone,
  LogOut,
  UserIcon,
  Cloud,
  CheckCircle,
  Info,
  MessageCircle,
  Mail,
  Facebook,
  Brain,
  Activity,
} from "lucide-react"
import { firebaseService } from "@/lib/firebase-service"
import { phoneDatabaseService } from "@/lib/phone-database-service"
import { advancedAnalyticsService } from "@/lib/advanced-analytics-service"
import { facebookOAuthService, type FacebookLoginResponse } from "@/lib/facebook-oauth-service"
import type { AutoReplyRule } from "@/lib/facebook-comments-service"
import { EnhancedDataViewer } from "./enhanced-data-viewer"
import { AutoCollectionControl } from "./auto-collection-control"

export function FacebookMonitor() {
  const { data, loading, error, user, userSettings, fetchData, setUser, loadUserSettings } = useAppContext()
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState<"ar" | "en">("ar")
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const [phoneDbLoaded, setPhoneDbLoaded] = useState(false)
  const [savedRecords, setSavedRecords] = useState<any[]>([])
  const [autoReplyRules, setAutoReplyRules] = useState<AutoReplyRule[]>([])
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"firebase" | "facebook">("firebase")
  const [facebookUser, setFacebookUser] = useState<any>(null)
  const [advancedAnalytics, setAdvancedAnalytics] = useState<any>(null)
  const [analyticsView, setAnalyticsView] = useState<"basic" | "advanced">("basic")

  useEffect(() => {
    if (user) {
      loadSavedRecords()
      phoneDatabaseService.loadFromFirebase(user.uid).then((result) => {
        if (result.success) {
          setPhoneDbLoaded(true)
        }
      })
    }
  }, [user])

  useEffect(() => {
    // حساب التحليلات المتقدمة عند تحديث البيانات
    if (data.posts && data.posts.length > 0) {
      const advanced = advancedAnalyticsService.processAdvancedAnalytics(data.posts)
      setAdvancedAnalytics(advanced)
    }
  }, [data.posts])

  const loadSavedRecords = async () => {
    if (!user) return
    try {
      const result = await firebaseService.getPhoneRecords(user.uid)
      if (result.success && result.data) {
        setSavedRecords(result.data)
      }
    } catch (error) {
      console.error("Error loading saved records:", error)
    }
  }

  const handleFirebaseSignOut = async () => {
    try {
      await firebaseService.signOut()
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleFacebookSignOut = async () => {
    try {
      await facebookOAuthService.logout()
      setFacebookUser(null)
    } catch (error) {
      console.error("Error signing out from Facebook:", error)
    }
  }

  const handleFacebookLogin = async (response: FacebookLoginResponse) => {
    if (response.success) {
      setFacebookUser({
        ...response.userInfo,
        accessToken: response.accessToken,
        permissions: response.permissions,
      })

      // يمكن أيضاً حفظ البيانات في Firebase إذا أردت
      if (user) {
        const updatedSettings = {
          ...userSettings,
          accessToken: response.accessToken || "",
          facebookUser: response.userInfo,
        }
        await firebaseService.saveUserSettings(user.uid, updatedSettings)
        loadUserSettings()
      }
    }
  }

  const handleLoadOlderPosts = async () => {
    setLoadingOlder(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setHasMorePosts(false)
    } catch (error) {
      console.error("Error loading older posts:", error)
    } finally {
      setLoadingOlder(false)
    }
  }

  const t = {
    ar: {
      title: "مراقب فيسبوك المتقدم",
      posts: "المنشورات",
      analytics: "التحليلات",
      advancedAnalytics: "التحليلات المتقدمة",
      users: "المستخدمين",
      settings: "الإعدادات",
      phoneDb: "قاعدة الأرقام",
      comments: "التعليقات",
      messages: "الرسائل",
      refresh: "تحديث البيانات",
      darkMode: "الوضع المظلم",
      lightMode: "الوضع المضيء",
      language: "English",
      totalPosts: "إجمالي المنشورات",
      foundNumbers: "الأرقام المكتشفة",
      activeUsers: "المستخدمين النشطين",
      error: "خطأ",
      phoneDbStatus: "حالة قاعدة الأرقام",
      loaded: "محملة",
      notLoaded: "غير محملة",
      signOut: "تسجيل الخروج",
      welcome: "مرحباً",
      cloudSync: "متزامن مع السحابة",
      facebookConnected: "متصل بـ Facebook",
      setupRequired: "يتطلب إعداد",
      setupMessage: "يرجى إعداد رمز الوصول والمصادر في تبويب الإعدادات",
      noData: "لا توجد بيانات",
      loadingSettings: "جاري تحميل الإعدادات...",
      socialManagement: "إدارة التفاعل الاجتماعي",
      loginMethod: "طريقة تسجيل الدخول",
      firebase: "Firebase",
      facebook: "Facebook",
      switchLogin: "تغيير طريقة الدخول",
      analyticsView: "عرض التحليلات",
      basicAnalytics: "تحليلات أساسية",
      advancedAnalyticsTitle: "تحليلات متقدمة",
    },
    en: {
      title: "Advanced Facebook Monitor",
      posts: "Posts",
      analytics: "Analytics",
      advancedAnalytics: "Advanced Analytics",
      users: "Users",
      settings: "Settings",
      phoneDb: "Phone Database",
      comments: "Comments",
      messages: "Messages",
      refresh: "Refresh Data",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      language: "العربية",
      totalPosts: "Total Posts",
      foundNumbers: "Found Numbers",
      activeUsers: "Active Users",
      error: "Error",
      phoneDbStatus: "Phone DB Status",
      loaded: "Loaded",
      notLoaded: "Not Loaded",
      signOut: "Sign Out",
      welcome: "Welcome",
      cloudSync: "Cloud Synced",
      facebookConnected: "Facebook Connected",
      setupRequired: "Setup Required",
      setupMessage: "Please setup access token and sources in Settings tab",
      noData: "No Data",
      loadingSettings: "Loading settings...",
      socialManagement: "Social Management",
      loginMethod: "Login Method",
      firebase: "Firebase",
      facebook: "Facebook",
      switchLogin: "Switch Login Method",
      analyticsView: "Analytics View",
      basicAnalytics: "Basic Analytics",
      advancedAnalyticsTitle: "Advanced Analytics",
    },
  }

  const text = t[language]

  // إذا لم يكن المستخدم مسجل دخول، عرض نموذج تسجيل الدخول
  if (!user && !facebookUser) {
    return (
      <div className="space-y-4">
        {/* Login Method Selector */}
        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm font-medium">{text.loginMethod}:</span>
              <div className="flex gap-2">
                <Button
                  variant={loginMethod === "firebase" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLoginMethod("firebase")}
                  className="flex items-center gap-2"
                >
                  <Cloud className="w-4 h-4" />
                  {text.firebase}
                </Button>
                <Button
                  variant={loginMethod === "facebook" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLoginMethod("facebook")}
                  className="flex items-center gap-2"
                >
                  <Facebook className="w-4 h-4" />
                  {text.facebook}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login Forms */}
        {loginMethod === "firebase" ? (
          <LoginForm onLogin={setUser} darkMode={darkMode} language={language} />
        ) : (
          <FacebookLoginForm onLogin={handleFacebookLogin} darkMode={darkMode} language={language} />
        )}
      </div>
    )
  }

  // إذا كانت الإعدادات لا تزال تحمل (للمستخدمين Firebase فقط)
  if (user && !userSettings && !facebookUser) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
            : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900"
        }`}
      >
        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">{text.loadingSettings}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // التحقق من الإعداد المطلوب
  const currentUser = facebookUser || user
  const accessToken = facebookUser?.accessToken || userSettings?.accessToken
  const isSetupComplete = accessToken && (userSettings?.sources?.length > 0 || facebookUser)
  const foundNumbers = savedRecords.length

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900"
      }`}
    >
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {text.title}
              </h1>
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                <Cloud className="w-3 h-3 mr-1" />
                {text.cloudSync}
              </Badge>
              {facebookUser && (
                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                  <Facebook className="w-3 h-3 mr-1" />
                  {text.facebookConnected}
                </Badge>
              )}
              {!isSetupComplete && (
                <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {text.setupRequired}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="outline" className="bg-blue-50 border-blue-200">
                {text.totalPosts}: {data.posts?.length || 0}
              </Badge>
              <Badge variant="outline" className="bg-green-50 border-green-200">
                {text.foundNumbers}: {foundNumbers}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 border-purple-200">
                {text.activeUsers}: {data.analytics?.totalUsers || 0}
              </Badge>
              <Badge
                variant="outline"
                className={phoneDbLoaded ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}
              >
                <Database className="w-3 h-3 mr-1" />
                {text.phoneDbStatus}: {phoneDbLoaded ? text.loaded : text.notLoaded}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User Info */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <Avatar className="w-8 h-8">
                {facebookUser?.picture?.data?.url ? (
                  <AvatarImage src={facebookUser.picture.data.url || "/placeholder.svg"} />
                ) : (
                  <AvatarFallback>
                    <UserIcon className="w-4 h-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{text.welcome}</p>
                <p className="text-xs text-gray-500">{facebookUser?.name || user?.email}</p>
              </div>
            </div>

            {/* Controls */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="bg-white/50 backdrop-blur-sm"
            >
              {text.language}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className="bg-white/50 backdrop-blur-sm"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              onClick={fetchData}
              disabled={loading || !isSetupComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              {text.refresh}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={facebookUser ? handleFacebookSignOut : handleFirebaseSignOut}
              className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {text.signOut}
            </Button>
          </div>
        </div>

        {/* Setup Warning */}
        {!isSetupComplete && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-700">
                <Info className="w-5 h-5" />
                <span className="font-medium">{text.setupRequired}:</span>
                <span>{text.setupMessage}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{text.error}:</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {isSetupComplete && data.posts.length > 0 && !error && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">تم تحميل البيانات بنجاح!</span>
                <span>
                  تم العثور على {data.posts.length} منشور من {userSettings?.sources?.length || 1} مصدر
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue={isSetupComplete ? "posts" : "settings"} className="space-y-6">
          <TabsList className="grid w-full grid-cols-9 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {text.posts}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {text.analytics}
              {advancedAnalytics && (
                <Badge variant="outline" className="ml-1 bg-purple-50 border-purple-200 text-purple-700">
                  <Brain className="w-3 h-3 mr-1" />
                  AI
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {text.users}
            </TabsTrigger>
            <TabsTrigger value="enhanced" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              البيانات المحسنة
              <Badge variant="outline" className="ml-1 bg-green-50 border-green-200 text-green-700">
                جديد
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="phonedb" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {text.phoneDb}
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              {text.comments}
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {text.messages}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {text.settings}
              {!isSetupComplete && <AlertCircle className="w-3 h-3 text-orange-500" />}
            </TabsTrigger>
            <TabsTrigger value="auto-collect" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              جمع تلقائي
              <Badge variant="outline" className="ml-1 bg-orange-50 border-orange-200 text-orange-700">
                AI
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <EnhancedPostsList
              posts={data.posts || []}
              loading={loading}
              loadingOlder={loadingOlder}
              hasMorePosts={hasMorePosts}
              onLoadOlderPosts={handleLoadOlderPosts}
              darkMode={darkMode}
              language={language}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Analytics View Selector */}
              {advancedAnalytics && (
                <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{text.analyticsView}:</span>
                      <Select value={analyticsView} onValueChange={(value: any) => setAnalyticsView(value)}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic" className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            {text.basicAnalytics}
                          </SelectItem>
                          <SelectItem value="advanced" className="flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            {text.advancedAnalyticsTitle}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Analytics Content */}
              {analyticsView === "advanced" && advancedAnalytics ? (
                <AdvancedAnalyticsDashboard
                  analytics={advancedAnalytics}
                  darkMode={darkMode}
                  language={language}
                  onExport={() => {
                    // تصدير التحليلات المتقدمة
                    const dataStr = JSON.stringify(advancedAnalytics, null, 2)
                    const dataBlob = new Blob([dataStr], { type: "application/json" })
                    const url = URL.createObjectURL(dataBlob)
                    const link = document.createElement("a")
                    link.href = url
                    link.download = `advanced-analytics-${Date.now()}.json`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(url)
                  }}
                  onRefresh={fetchData}
                />
              ) : (
                <AnalyticsDashboard data={data.analytics} darkMode={darkMode} language={language} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserTable
              users={Array.from(data.users?.values() || [])}
              phoneSearchResults={{}}
              onPhoneSearch={() => {}}
              searchingPhones={new Set()}
              darkMode={darkMode}
              language={language}
            />
          </TabsContent>

          <TabsContent value="enhanced">
            <EnhancedDataViewer darkMode={darkMode} language={language} userId={user?.uid || "facebook_user"} />
          </TabsContent>

          <TabsContent value="phonedb">
            <PhoneDatabaseManager
              darkMode={darkMode}
              language={language}
              userId={user?.uid || "facebook_user"}
              onDatabaseLoaded={() => setPhoneDbLoaded(true)}
            />
          </TabsContent>

          <TabsContent value="comments">
            {isSetupComplete && (userSettings?.sources?.length > 0 || facebookUser) ? (
              <CommentsManager
                pageId={userSettings?.sources?.[0]?.id || facebookUser?.id || ""}
                accessToken={accessToken}
                darkMode={darkMode}
                language={language}
              />
            ) : (
              <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">إعداد مطلوب</h3>
                  <p className="text-gray-500">يرجى إعداد رمز الوصول والمصادر في تبويب الإعدادات أولاً</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="messages">
            {isSetupComplete && (userSettings?.sources?.length > 0 || facebookUser) ? (
              <MessagesManager
                pageId={userSettings?.sources?.[0]?.id || facebookUser?.id || ""}
                accessToken={accessToken}
                autoReplyRules={autoReplyRules}
                autoReplyEnabled={autoReplyEnabled}
                darkMode={darkMode}
                language={language}
              />
            ) : (
              <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
                <CardContent className="p-8 text-center">
                  <Mail className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">إعداد مطلوب</h3>
                  <p className="text-gray-500">يرجى إعداد رمز الوصول والمصادر في تبويب الإعدادات أولاً</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel
              onDataRefresh={() => {
                if (user) {
                  loadUserSettings().then(() => {
                    fetchData()
                  })
                } else {
                  fetchData()
                }
              }}
              darkMode={darkMode}
              language={language}
              userId={user?.uid || "facebook_user"}
            />
          </TabsContent>

          <TabsContent value="auto-collect">
            <AutoCollectionControl darkMode={darkMode} language={language} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

```أقوم بتحديث وظيفة جلب المنشورات لإضافة تسجيل تصحيح الأخطاء للتعليقات.