"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Facebook,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Users,
  ImageIcon,
  FileText,
  BarChart3,
  MessageSquare,
  Camera,
  Globe,
  Briefcase,
  GraduationCap,
  Heart,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  TestTube,
} from "lucide-react"
import { facebookOAuthService, type FacebookUser, type FacebookLoginResult } from "@/lib/facebook-oauth-service"

interface FacebookLoginFormProps {
  darkMode: boolean
  language: "ar" | "en"
  onLoginSuccess: (user: FacebookUser, accessToken: string) => void
  onLoginError: (error: string) => void
}

export function FacebookLoginForm({ darkMode, language, onLoginSuccess, onLoginError }: FacebookLoginFormProps) {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<FacebookUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [grantedPermissions, setGrantedPermissions] = useState<string[]>([])
  const [loginProgress, setLoginProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const t = {
    ar: {
      title: "FB Tracker Pro - دخول Facebook",
      subtitle: "استخدم حسابك على Facebook للدخول إلى FB Tracker Pro",
      loginButton: "تسجيل الدخول بـ Facebook",
      testLoginButton: "تسجيل دخول تجريبي",
      logoutButton: "تسجيل الخروج",
      connecting: "جاري الاتصال...",
      fetchingData: "جاري جلب البيانات...",
      success: "تم تسجيل الدخول بنجاح",
      error: "خطأ في تسجيل الدخول",
      userInfo: "معلومات المستخدم",
      permissions: "الصلاحيات الممنوحة",
      availablePermissions: "الصلاحيات المتاحة",
      basicInfo: "المعلومات الأساسية",
      personalInfo: "المعلومات الشخصية",
      professionalInfo: "التعليم والعمل",
      socialInfo: "الأصدقاء والمحتوى",
      pagesGroups: "الصفحات والمجموعات",
      businessAds: "الأعمال والإعلانات",
      instagram: "Instagram",
      whatsapp: "WhatsApp Business",
      other: "أخرى",
      appId: "معرف التطبيق",
      totalPermissions: "إجمالي الصلاحيات",
      grantedPermissions: "الصلاحيات الممنوحة",
      name: "الاسم",
      email: "البريد الإلكتروني",
      birthday: "تاريخ الميلاد",
      location: "الموقع الحالي",
      hometown: "المدينة الأصلية",
      relationship: "الحالة الاجتماعية",
      religion: "الديانة",
      website: "الموقع الإلكتروني",
      about: "نبذة عني",
      education: "التعليم",
      work: "العمل",
      testDataNote: "هذه بيانات تجريبية للاختبار",
      loginSuccessful: "تم تسجيل الدخول بنجاح! يمكنك الآن استخدام جميع الميزات.",
    },
    en: {
      title: "FB Tracker Pro - Facebook Login",
      subtitle: "Use your Facebook account to access FB Tracker Pro",
      loginButton: "Login with Facebook",
      testLoginButton: "Test Login",
      logoutButton: "Logout",
      connecting: "Connecting...",
      fetchingData: "Fetching data...",
      success: "Login successful",
      error: "Login error",
      userInfo: "User Information",
      permissions: "Granted Permissions",
      availablePermissions: "Available Permissions",
      basicInfo: "Basic Information",
      personalInfo: "Personal Information",
      professionalInfo: "Education & Work",
      socialInfo: "Friends & Content",
      pagesGroups: "Pages & Groups",
      businessAds: "Business & Ads",
      instagram: "Instagram",
      whatsapp: "WhatsApp Business",
      other: "Other",
      appId: "App ID",
      totalPermissions: "Total Permissions",
      grantedPermissions: "Granted Permissions",
      name: "Name",
      email: "Email",
      birthday: "Birthday",
      location: "Current Location",
      hometown: "Hometown",
      relationship: "Relationship Status",
      religion: "Religion",
      website: "Website",
      about: "About",
      education: "Education",
      work: "Work",
      testDataNote: "This is test data for testing purposes",
      loginSuccessful: "Login successful! You can now use all features.",
    },
  }

  const text = t[language]

  useEffect(() => {
    // تحقق من حالة تسجيل الدخول عند تحميل المكون
    if (facebookOAuthService.isLoggedIn()) {
      const currentUser = facebookOAuthService.getCurrentUser()
      const currentToken = facebookOAuthService.getAccessToken()

      if (currentUser && currentToken) {
        setUser(currentUser)
        setAccessToken(currentToken)
      }
    }
  }, [])

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    setLoginProgress(0)

    try {
      // محاكاة تقدم تسجيل الدخول
      const progressInterval = setInterval(() => {
        setLoginProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      const result: FacebookLoginResult = await facebookOAuthService.login()

      clearInterval(progressInterval)
      setLoginProgress(100)

      if (result.success && result.user && result.accessToken) {
        setUser(result.user)
        setAccessToken(result.accessToken)
        setGrantedPermissions(result.permissions || [])
        setSuccess(text.loginSuccessful)
        onLoginSuccess(result.user, result.accessToken)
      } else {
        setError(result.error || "فشل في تسجيل الدخول")
        onLoginError(result.error || "فشل في تسجيل الدخول")
      }
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء تسجيل الدخول")
      onLoginError(error.message || "حدث خطأ أثناء تسجيل الدخول")
    } finally {
      setLoading(false)
      setTimeout(() => setLoginProgress(0), 2000)
    }
  }

  const handleTestLogin = () => {
    setLoading(true)
    setError("")

    // محاكاة تأخير تسجيل الدخول التجريبي
    setTimeout(() => {
      const result = facebookOAuthService.getTestLoginData()

      if (result.success && result.user && result.accessToken) {
        setUser(result.user)
        setAccessToken(result.accessToken)
        setGrantedPermissions(result.permissions || [])
        setSuccess(text.loginSuccessful)
        onLoginSuccess(result.user, result.accessToken)
      }

      setLoading(false)
    }, 1500)
  }

  const handleLogout = async () => {
    setLoading(true)

    try {
      await facebookOAuthService.logout()
      setUser(null)
      setAccessToken(null)
      setGrantedPermissions([])
      setSuccess("")
      setError("")
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء تسجيل الخروج")
    } finally {
      setLoading(false)
    }
  }

  const getPermissionIcon = (permission: string) => {
    if (permission.includes("user_posts") || permission.includes("publish")) return <FileText className="w-4 h-4" />
    if (permission.includes("user_photos") || permission.includes("user_videos")) return <Camera className="w-4 h-4" />
    if (permission.includes("user_friends")) return <Users className="w-4 h-4" />
    if (permission.includes("pages") || permission.includes("manage")) return <Globe className="w-4 h-4" />
    if (permission.includes("ads") || permission.includes("business")) return <BarChart3 className="w-4 h-4" />
    if (permission.includes("messaging")) return <MessageSquare className="w-4 h-4" />
    if (permission.includes("instagram")) return <ImageIcon className="w-4 h-4" />
    if (permission.includes("education") || permission.includes("work")) return <Briefcase className="w-4 h-4" />
    return <Shield className="w-4 h-4" />
  }

  const permissionCategories = facebookOAuthService.getPermissionsByCategory()
  const allPermissions = facebookOAuthService.getAllPermissions()

  if (user && accessToken) {
    return (
      <div className="space-y-6">
        {/* Success Message */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4" />
            <AlertDescription className="text-green-700">
              {success}
              <Button variant="link" onClick={() => setSuccess("")} className="text-green-700 p-0 h-auto ml-2">
                ✕
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* User Info Header */}
        <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={user.picture?.data?.url || "/placeholder.svg?height=60&width=60&query=user+avatar"}
                    alt={user.name}
                    className="w-16 h-16 rounded-full border-2 border-blue-200"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                      <Facebook className="w-3 h-3 mr-1" />
                      Facebook
                    </Badge>
                    {user.id === "test_user_123" && (
                      <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                        <TestTube className="w-3 h-3 mr-1" />
                        {text.testDataNote}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button onClick={handleLogout} disabled={loading} variant="outline" className="bg-transparent">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {text.logoutButton}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Detailed Information */}
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {text.userInfo}
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {text.permissions}
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {text.availablePermissions}
            </TabsTrigger>
          </TabsList>

          {/* User Information Tab */}
          <TabsContent value="info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {text.basicInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-500">{text.name}:</span>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    {user.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-500">{text.email}:</span>
                        <span className="font-medium">{user.email}</span>
                      </div>
                    )}
                    {user.birthday && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-gray-500">{text.birthday}:</span>
                        <span className="font-medium">{user.birthday}</span>
                      </div>
                    )}
                    {user.website && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-500">{text.website}:</span>
                        <a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {user.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {text.personalInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {user.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-gray-500">{text.location}:</span>
                        <span className="font-medium">{user.location.name}</span>
                      </div>
                    )}
                    {user.hometown && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-500">{text.hometown}:</span>
                        <span className="font-medium">{user.hometown.name}</span>
                      </div>
                    )}
                    {user.relationship_status && (
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span className="text-sm text-gray-500">{text.relationship}:</span>
                        <span className="font-medium">{user.relationship_status}</span>
                      </div>
                    )}
                    {user.religion && (
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-500">{text.religion}:</span>
                        <span className="font-medium">{user.religion}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              {user.education && user.education.length > 0 && (
                <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      {text.education}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {user.education.map((edu, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="font-medium">{edu.school.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {edu.type} {edu.year && `- ${edu.year.name}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Work */}
              {user.work && user.work.length > 0 && (
                <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      {text.work}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {user.work.map((job, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="font-medium">{job.employer.name}</div>
                          {job.position && (
                            <div className="text-sm text-gray-600 dark:text-gray-300">{job.position.name}</div>
                          )}
                          {job.start_date && (
                            <div className="text-xs text-gray-500">
                              {job.start_date} {job.end_date && `- ${job.end_date}`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* About */}
              {user.about && (
                <Card
                  className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm md:col-span-2`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {text.about}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{user.about}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Granted Permissions Tab */}
          <TabsContent value="permissions">
            <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    {text.grantedPermissions}
                  </div>
                  <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                    {grantedPermissions.length} / {allPermissions.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {grantedPermissions.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      {getPermissionIcon(permission)}
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">{permission}</span>
                      <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Available Permissions Tab */}
          <TabsContent value="available">
            <div className="space-y-6">
              {/* App Information */}
              <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    معلومات التطبيق
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{text.appId}:</span>
                      <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                        419003153920534
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{text.totalPermissions}:</span>
                      <Badge variant="outline">{allPermissions.length}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{text.grantedPermissions}:</span>
                      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                        {grantedPermissions.length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Permission Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(permissionCategories).map(([category, permissions]) => (
                  <Card
                    key={category}
                    className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {category === "basic" && <User className="w-5 h-5 text-blue-500" />}
                        {category === "personal" && <Heart className="w-5 h-5 text-pink-500" />}
                        {category === "professional" && <Briefcase className="w-5 h-5 text-purple-500" />}
                        {category === "social" && <Users className="w-5 h-5 text-green-500" />}
                        {category === "pages" && <Globe className="w-5 h-5 text-blue-500" />}
                        {category === "groups" && <Users className="w-5 h-5 text-orange-500" />}
                        {category === "business" && <BarChart3 className="w-5 h-5 text-red-500" />}
                        {category === "instagram" && <ImageIcon className="w-5 h-5 text-pink-500" />}
                        {category === "whatsapp" && <Phone className="w-5 h-5 text-green-500" />}
                        {category === "other" && <Shield className="w-5 h-5 text-gray-500" />}
                        {text[category as keyof typeof text] || category}
                        <Badge variant="outline" className="ml-auto">
                          {permissions.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {permissions.map((permission) => (
                          <div
                            key={permission}
                            className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                          >
                            {getPermissionIcon(permission)}
                            <span className="text-sm">{permission}</span>
                            {grantedPermissions.includes(permission) ? (
                              <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                            ) : (
                              <div className="w-4 h-4 border border-gray-300 rounded-full ml-auto" />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Facebook className="w-6 h-6 text-blue-600" />
          {text.title}
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-300">{text.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error Message */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-red-700">
              {error}
              <Button variant="link" onClick={() => setError("")} className="text-red-700 p-0 h-auto ml-2">
                ✕
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* App Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Facebook className="w-5 h-5 text-blue-600" />
            <span className="font-medium">معلومات التطبيق</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">{text.appId}: </span>
              <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">419003153920534</code>
            </div>
            <div>
              <span className="text-gray-600">{text.totalPermissions}: </span>
              <Badge variant="outline">{allPermissions.length}</Badge>
            </div>
          </div>
        </div>

        {/* Login Progress */}
        {loading && loginProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{loginProgress < 50 ? text.connecting : text.fetchingData}</span>
              <span>{loginProgress}%</span>
            </div>
            <Progress value={loginProgress} className="w-full" />
          </div>
        )}

        {/* Login Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {text.connecting}
              </>
            ) : (
              <>
                <Facebook className="w-5 h-5 mr-2" />
                {text.loginButton}
              </>
            )}
          </Button>

          <Button
            onClick={handleTestLogin}
            disabled={loading}
            variant="outline"
            className="w-full h-12 border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {text.connecting}
              </>
            ) : (
              <>
                <TestTube className="w-5 h-5 mr-2" />
                {text.testLoginButton}
              </>
            )}
          </Button>
        </div>

        {/* Available Permissions Preview */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {text.availablePermissions}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(permissionCategories).map(([category, permissions]) => (
              <div key={category} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                <div className="text-sm font-medium mb-1">{text[category as keyof typeof text] || category}</div>
                <Badge variant="outline" className="text-xs">
                  {permissions.length}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}