
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Calendar,
  Globe,
  Users,
  Camera,
  MessageCircle,
  Mail,
  Star,
  TrendingUp,
  Activity,
  ThumbsUp,
  Share2,
  Clock,
  BarChart3,
  Network,
  Download,
  Eye
} from "lucide-react"
import { facebookUserAnalyticsService } from "@/lib/facebook-user-analytics-service"

interface UserAnalyticsViewerProps {
  userId: string
  posts: any[]
  darkMode: boolean
  language: "ar" | "en"
  onClose: () => void
}

export function UserAnalyticsViewer({ 
  userId, 
  posts, 
  darkMode, 
  language, 
  onClose 
}: UserAnalyticsViewerProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("profile")

  const t = {
    ar: {
      userAnalytics: "تحليلات المستخدم",
      profile: "الملف الشخصي",
      comments: "التعليقات",
      activity: "النشاط",
      interactions: "التفاعلات",
      insights: "الإحصائيات",
      personalInfo: "المعلومات الشخصية",
      contactInfo: "معلومات الاتصال",
      workEducation: "العمل والتعليم",
      socialActivity: "النشاط الاجتماعي",
      totalComments: "إجمالي التعليقات",
      totalLikes: "إجمالي الإعجابات",
      avgLikes: "متوسط الإعجابات",
      mostActiveHours: "ساعات النشاط الأكثر",
      mostUsedWords: "الكلمات الأكثر استخداماً",
      activityTimeline: "الخط الزمني للنشاط",
      interactionNetwork: "شبكة التفاعل",
      recentComments: "التعليقات الأخيرة",
      userDetails: "تفاصيل المستخدم",
      exportData: "تصدير البيانات",
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      close: "إغلاق",
      noData: "لا توجد بيانات",
      birthday: "تاريخ الميلاد",
      hometown: "المدينة الأصلية",
      location: "الموقع الحالي",
      relationship: "الحالة الاجتماعية",
      religion: "الديانة",
      political: "الآراء السياسية",
      website: "الموقع الإلكتروني",
      about: "نبذة عني",
      work: "العمل",
      education: "التعليم",
      friends: "الأصدقاء",
      photos: "الصور",
      videos: "الفيديوهات",
      events: "الأحداث",
      pages: "الصفحات",
      groups: "المجموعات"
    },
    en: {
      userAnalytics: "User Analytics", 
      profile: "Profile",
      comments: "Comments",
      activity: "Activity", 
      interactions: "Interactions",
      insights: "Insights",
      personalInfo: "Personal Information",
      contactInfo: "Contact Information",
      workEducation: "Work & Education",
      socialActivity: "Social Activity",
      totalComments: "Total Comments",
      totalLikes: "Total Likes", 
      avgLikes: "Average Likes",
      mostActiveHours: "Most Active Hours",
      mostUsedWords: "Most Used Words",
      activityTimeline: "Activity Timeline",
      interactionNetwork: "Interaction Network",
      recentComments: "Recent Comments",
      userDetails: "User Details",
      exportData: "Export Data",
      loading: "Loading...",
      error: "Error occurred",
      close: "Close",
      noData: "No data available",
      birthday: "Birthday",
      hometown: "Hometown", 
      location: "Current Location",
      relationship: "Relationship Status",
      religion: "Religion",
      political: "Political Views",
      website: "Website",
      about: "About",
      work: "Work",
      education: "Education",
      friends: "Friends",
      photos: "Photos",
      videos: "Videos", 
      events: "Events",
      pages: "Pages",
      groups: "Groups"
    }
  }

  const text = t[language]

  useEffect(() => {
    loadUserAnalytics()
  }, [userId])

  const loadUserAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      // Set access token from localStorage
      const settings = JSON.parse(localStorage.getItem("facebook_settings") || "{}")
      if (settings.accessToken) {
        facebookUserAnalyticsService.setAccessToken(settings.accessToken)
      }

      const result = await facebookUserAnalyticsService.getUserAnalytics(userId, posts)
      if (result.error) {
        setError(result.error)
      } else {
        setAnalytics(result.data)
      }
    } catch (error) {
      setError("Failed to load user analytics")
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      const result = await facebookUserAnalyticsService.exportUserData(userId, posts)
      if (result.data) {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `user_analytics_${userId}_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  if (loading) {
    return (
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} w-full max-w-6xl mx-auto`}>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{text.loading}</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} w-full max-w-6xl mx-auto`}>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">{text.error}: {error}</p>
          <Button onClick={onClose} variant="outline">{text.close}</Button>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) {
    return (
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} w-full max-w-6xl mx-auto`}>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">{text.noData}</p>
          <Button onClick={onClose} variant="outline">{text.close}</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={analytics.user.picture?.data?.url || "/placeholder.svg"} />
                <AvatarFallback><User className="w-8 h-8" /></AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{analytics.user.name}</h1>
                <p className="text-gray-500">ID: {analytics.user.id}</p>
                {analytics.user.about && (
                  <p className="text-sm text-gray-600 mt-1">{analytics.user.about}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleExportData} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                {text.exportData}
              </Button>
              <Button onClick={onClose} variant="outline">{text.close}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{analytics.totalComments}</p>
            <p className="text-sm text-gray-500">{text.totalComments}</p>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <ThumbsUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{analytics.totalLikes}</p>
            <p className="text-sm text-gray-500">{text.totalLikes}</p>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{analytics.avgLikesPerComment.toFixed(1)}</p>
            <p className="text-sm text-gray-500">{text.avgLikes}</p>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <Network className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{analytics.interactionNetwork.length}</p>
            <p className="text-sm text-gray-500">{text.interactions}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">{text.profile}</TabsTrigger>
          <TabsTrigger value="comments">{text.comments}</TabsTrigger>
          <TabsTrigger value="activity">{text.activity}</TabsTrigger>
          <TabsTrigger value="interactions">{text.interactions}</TabsTrigger>
          <TabsTrigger value="insights">{text.insights}</TabsTrigger>
        </Tabs>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {text.personalInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.user.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{analytics.user.email}</span>
                  </div>
                )}
                {analytics.user.birthday && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{text.birthday}: {analytics.user.birthday}</span>
                  </div>
                )}
                {analytics.user.hometown && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{text.hometown}: {analytics.user.hometown.name}</span>
                  </div>
                )}
                {analytics.user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{text.location}: {analytics.user.location.name}</span>
                  </div>
                )}
                {analytics.user.relationship_status && (
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-gray-500" />
                    <span>{text.relationship}: {analytics.user.relationship_status}</span>
                  </div>
                )}
                {analytics.user.religion && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-500" />
                    <span>{text.religion}: {analytics.user.religion}</span>
                  </div>
                )}
                {analytics.user.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a href={analytics.user.website} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-500 hover:underline">
                      {analytics.user.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  {text.workEducation}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.user.work && analytics.user.work.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">{text.work}</h4>
                    {analytics.user.work.map((job: any, index: number) => (
                      <div key={index} className="ml-4 mb-2">
                        <p className="font-medium">{job.position?.name || "موظف"}</p>
                        <p className="text-sm text-gray-500">{job.employer?.name}</p>
                        {job.start_date && (
                          <p className="text-xs text-gray-400">
                            {job.start_date} - {job.end_date || "الآن"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {analytics.user.education && analytics.user.education.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">{text.education}</h4>
                    {analytics.user.education.map((edu: any, index: number) => (
                      <div key={index} className="ml-4 mb-2">
                        <p className="font-medium">{edu.school?.name}</p>
                        <p className="text-sm text-gray-500">{edu.type}</p>
                        {edu.year && <p className="text-xs text-gray-400">تخرج: {edu.year.name}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analytics.user.friends?.data && (
              <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="font-bold">{analytics.user.friends.data.length}</p>
                  <p className="text-sm text-gray-500">{text.friends}</p>
                </CardContent>
              </Card>
            )}

            {analytics.user.photos?.data && (
              <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
                <CardContent className="p-4 text-center">
                  <Camera className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <p className="font-bold">{analytics.user.photos.data.length}</p>
                  <p className="text-sm text-gray-500">{text.photos}</p>
                </CardContent>
              </Card>
            )}

            {analytics.user.events?.data && (
              <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
                <CardContent className="p-4 text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <p className="font-bold">{analytics.user.events.data.length}</p>
                  <p className="text-sm text-gray-500">{text.events}</p>
                </CardContent>
              </Card>
            )}

            {analytics.user.pages?.data && (
              <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
                <CardContent className="p-4 text-center">
                  <Star className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <p className="font-bold">{analytics.user.pages.data.length}</p>
                  <p className="text-sm text-gray-500">{text.pages}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-4">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle>{text.recentComments} ({analytics.comments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {analytics.comments.slice(0, 20).map((comment: any) => (
                  <div key={comment.id} className="border-b pb-3 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_time).toLocaleString("ar-EG")}
                      </span>
                      <div className="flex items-center gap-2">
                        {comment.like_count > 0 && (
                          <Badge variant="secondary">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {comment.like_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm mb-2">{comment.message}</p>
                    <p className="text-xs text-gray-400">
                      على منشور: {comment.post_message}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {text.mostActiveHours}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.mostActiveHours.map((hour: number) => (
                    <div key={hour} className="flex items-center justify-between">
                      <span>{hour}:00 - {hour + 1}:00</span>
                      <Progress value={(hour / 23) * 100} className="w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {text.mostUsedWords}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.mostUsedWords.map((word: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{word.word}</span>
                      <Badge variant="outline">{word.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Interactions Tab */}  
        <TabsContent value="interactions" className="space-y-4">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                {text.interactionNetwork}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.interactionNetwork.map((interaction: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">{interaction.name}</span>
                    </div>
                    <Badge variant="secondary">{interaction.interactions} تفاعل</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {text.activityTimeline}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {analytics.activityTimeline.slice(-30).map((day: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 border-b">
                    <span className="text-sm">{new Date(day.date).toLocaleDateString("ar-EG")}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {day.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {day.likes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
