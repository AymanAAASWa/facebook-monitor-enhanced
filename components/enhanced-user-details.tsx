"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
} from "lucide-react"
import { enhancedFacebookService } from "@/lib/enhanced-facebook-service"

interface EnhancedUserDetailsProps {
  userId: string
  darkMode: boolean
  language: "ar" | "en"
  onClose: () => void
}

export function EnhancedUserDetails({ userId, darkMode, language, onClose }: EnhancedUserDetailsProps) {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("profile")

  const t = {
    ar: {
      profile: "الملف الشخصي",
      posts: "المنشورات",
      photos: "الصور",
      videos: "الفيديوهات",
      friends: "الأصدقاء",
      events: "الأحداث",
      analytics: "التحليلات",
      personalInfo: "المعلومات الشخصية",
      workEducation: "العمل والتعليم",
      contactInfo: "معلومات الاتصال",
      socialActivity: "النشاط الاجتماعي",
      birthday: "تاريخ الميلاد",
      hometown: "المدينة الأصلية",
      currentLocation: "الموقع الحالي",
      relationship: "الحالة الاجتماعية",
      religion: "الديانة",
      political: "الآراء السياسية",
      website: "الموقع الإلكتروني",
      about: "نبذة عني",
      work: "العمل",
      education: "التعليم",
      totalPosts: "إجمالي المنشورات",
      totalPhotos: "إجمالي الصور",
      totalVideos: "إجمالي الفيديوهات",
      totalFriends: "إجمالي الأصدقاء",
      engagementRate: "معدل التفاعل",
      averageLikes: "متوسط الإعجابات",
      averageComments: "متوسط التعليقات",
      mostActiveDay: "أكثر الأيام نشاطاً",
      recentActivity: "النشاط الأخير",
      topPosts: "أفضل المنشورات",
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      close: "إغلاق",
      noData: "لا توجد بيانات",
      viewAll: "عرض الكل",
      likes: "إعجاب",
      comments: "تعليق",
      shares: "مشاركة",
      views: "مشاهدة",
    },
    en: {
      profile: "Profile",
      posts: "Posts",
      photos: "Photos",
      videos: "Videos",
      friends: "Friends",
      events: "Events",
      analytics: "Analytics",
      personalInfo: "Personal Information",
      workEducation: "Work & Education",
      contactInfo: "Contact Information",
      socialActivity: "Social Activity",
      birthday: "Birthday",
      hometown: "Hometown",
      currentLocation: "Current Location",
      relationship: "Relationship Status",
      religion: "Religion",
      political: "Political Views",
      website: "Website",
      about: "About",
      work: "Work",
      education: "Education",
      totalPosts: "Total Posts",
      totalPhotos: "Total Photos",
      totalVideos: "Total Videos",
      totalFriends: "Total Friends",
      engagementRate: "Engagement Rate",
      averageLikes: "Average Likes",
      averageComments: "Average Comments",
      mostActiveDay: "Most Active Day",
      recentActivity: "Recent Activity",
      topPosts: "Top Posts",
      loading: "Loading...",
      error: "Error occurred",
      close: "Close",
      noData: "No data available",
      viewAll: "View All",
      likes: "Likes",
      comments: "Comments",
      shares: "Shares",
      views: "Views",
    },
  }

  const text = t[language]

  useEffect(() => {
    loadUserData()
  }, [userId])

  const loadUserData = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await enhancedFacebookService.getEnhancedUserInfo(userId)
      if (result.error) {
        setError(result.error)
      } else {
        setUserInfo(result.data)
      }
    } catch (error) {
      setError("Failed to load user data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} w-full max-w-4xl mx-auto`}>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{text.loading}</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} w-full max-w-4xl mx-auto`}>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">
            {text.error}: {error}
          </p>
          <Button onClick={onClose} variant="outline">
            {text.close}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!userInfo) {
    return (
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} w-full max-w-4xl mx-auto`}>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">{text.noData}</p>
          <Button onClick={onClose} variant="outline">
            {text.close}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // حساب الإحصائيات
  const stats = {
    totalPosts: userInfo.posts?.data?.length || 0,
    totalPhotos: userInfo.photos?.data?.length || 0,
    totalVideos: userInfo.videos?.data?.length || 0,
    totalFriends: userInfo.friends?.data?.length || 0,
    totalLikes:
      userInfo.posts?.data?.reduce((sum: number, post: any) => sum + (post.likes?.summary?.total_count || 0), 0) || 0,
    totalComments:
      userInfo.posts?.data?.reduce((sum: number, post: any) => sum + (post.comments?.summary?.total_count || 0), 0) ||
      0,
  }

  const engagementRate = stats.totalPosts > 0 ? (stats.totalLikes + stats.totalComments) / stats.totalPosts : 0
  const averageLikes = stats.totalPosts > 0 ? stats.totalLikes / stats.totalPosts : 0
  const averageComments = stats.totalPosts > 0 ? stats.totalComments / stats.totalPosts : 0

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={userInfo.picture?.data?.url || "/placeholder.svg"} />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{userInfo.name}</h1>
                <p className="text-gray-500">ID: {userInfo.id}</p>
                {userInfo.about && <p className="text-sm text-gray-600 mt-1">{userInfo.about}</p>}
              </div>
            </div>
            <Button onClick={onClose} variant="outline">
              {text.close}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{stats.totalPosts}</p>
            <p className="text-sm text-gray-500">{text.totalPosts}</p>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <Camera className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{stats.totalPhotos}</p>
            <p className="text-sm text-gray-500">{text.totalPhotos}</p>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{stats.totalFriends}</p>
            <p className="text-sm text-gray-500">{text.totalFriends}</p>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{engagementRate.toFixed(1)}</p>
            <p className="text-sm text-gray-500">{text.engagementRate}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">{text.profile}</TabsTrigger>
          <TabsTrigger value="posts">{text.posts}</TabsTrigger>
          <TabsTrigger value="photos">{text.photos}</TabsTrigger>
          <TabsTrigger value="friends">{text.friends}</TabsTrigger>
          <TabsTrigger value="events">{text.events}</TabsTrigger>
          <TabsTrigger value="analytics">{text.analytics}</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {text.personalInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{userInfo.email}</span>
                  </div>
                )}
                {userInfo.birthday && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>
                      {text.birthday}: {userInfo.birthday}
                    </span>
                  </div>
                )}
                {userInfo.hometown && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>
                      {text.hometown}: {userInfo.hometown.name}
                    </span>
                  </div>
                )}
                {userInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>
                      {text.currentLocation}: {userInfo.location.name}
                    </span>
                  </div>
                )}
                {userInfo.relationship_status && (
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-gray-500" />
                    <span>
                      {text.relationship}: {userInfo.relationship_status}
                    </span>
                  </div>
                )}
                {userInfo.religion && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-500" />
                    <span>
                      {text.religion}: {userInfo.religion}
                    </span>
                  </div>
                )}
                {userInfo.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a
                      href={userInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {userInfo.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Work & Education */}
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  {text.workEducation}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userInfo.work && userInfo.work.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {text.work}
                    </h4>
                    {userInfo.work.map((job: any, index: number) => (
                      <div key={index} className="ml-6 mb-2">
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

                {userInfo.education && userInfo.education.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      {text.education}
                    </h4>
                    {userInfo.education.map((edu: any, index: number) => (
                      <div key={index} className="ml-6 mb-2">
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
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {text.posts} ({stats.totalPosts})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userInfo.posts?.data && userInfo.posts.data.length > 0 ? (
                <div className="space-y-4">
                  {userInfo.posts.data.slice(0, 5).map((post: any) => (
                    <div key={post.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">
                          {new Date(post.created_time).toLocaleDateString("ar-EG")}
                        </span>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {post.likes?.summary?.total_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {post.comments?.summary?.total_count || 0}
                          </span>
                          {post.shares && (
                            <span className="flex items-center gap-1">
                              <Share2 className="w-3 h-3" />
                              {post.shares.count}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm">{post.message || "منشور بدون نص"}</p>
                      {post.picture && (
                        <img
                          src={post.picture || "/placeholder.svg"}
                          alt="Post image"
                          className="mt-2 rounded-lg max-w-full h-auto"
                          style={{ maxHeight: "200px" }}
                        />
                      )}
                    </div>
                  ))}
                  {userInfo.posts.data.length > 5 && (
                    <Button variant="outline" className="w-full bg-transparent">
                      {text.viewAll} ({userInfo.posts.data.length - 5} أكثر)
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">{text.noData}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value="photos" className="space-y-4">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                {text.photos} ({stats.totalPhotos})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userInfo.photos?.data && userInfo.photos.data.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {userInfo.photos.data.slice(0, 12).map((photo: any) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.source || "/placeholder.svg"}
                        alt={photo.name || "Photo"}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="text-white text-center text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <ThumbsUp className="w-3 h-3" />
                            {photo.likes?.summary?.total_count || 0}
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-3 h-3" />
                            {photo.comments?.summary?.total_count || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">{text.noData}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Friends Tab */}
        <TabsContent value="friends" className="space-y-4">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {text.friends} ({stats.totalFriends})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userInfo.friends?.data && userInfo.friends.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userInfo.friends.data.slice(0, 10).map((friend: any) => (
                    <div key={friend.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={friend.picture?.data?.url || "/placeholder.svg"} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{friend.name}</p>
                        <p className="text-sm text-gray-500">ID: {friend.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">{text.noData}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {text.events}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userInfo.events?.data && userInfo.events.data.length > 0 ? (
                <div className="space-y-4">
                  {userInfo.events.data.map((event: any) => (
                    <div key={event.id} className="border-b pb-4 last:border-b-0">
                      <h4 className="font-medium">{event.name}</h4>
                      <p className="text-sm text-gray-500">{new Date(event.start_time).toLocaleDateString("ar-EG")}</p>
                      {event.place && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.place.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">{text.noData}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {text.socialActivity}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>{text.averageLikes}</span>
                  <span className="font-bold">{averageLikes.toFixed(1)}</span>
                </div>
                <Progress value={Math.min((averageLikes / 100) * 100, 100)} className="w-full" />

                <div className="flex items-center justify-between">
                  <span>{text.averageComments}</span>
                  <span className="font-bold">{averageComments.toFixed(1)}</span>
                </div>
                <Progress value={Math.min((averageComments / 20) * 100, 100)} className="w-full" />

                <div className="flex items-center justify-between">
                  <span>{text.engagementRate}</span>
                  <span className="font-bold">{engagementRate.toFixed(1)}</span>
                </div>
                <Progress value={Math.min((engagementRate / 50) * 100, 100)} className="w-full" />
              </CardContent>
            </Card>

            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {text.topPosts}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userInfo.posts?.data && userInfo.posts.data.length > 0 ? (
                  <div className="space-y-3">
                    {userInfo.posts.data
                      .sort((a: any, b: any) => {
                        const aEngagement =
                          (a.likes?.summary?.total_count || 0) + (a.comments?.summary?.total_count || 0)
                        const bEngagement =
                          (b.likes?.summary?.total_count || 0) + (b.comments?.summary?.total_count || 0)
                        return bEngagement - aEngagement
                      })
                      .slice(0, 3)
                      .map((post: any) => (
                        <div key={post.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm mb-2">{post.message?.substring(0, 100) || "منشور بدون نص"}...</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              {post.likes?.summary?.total_count || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {post.comments?.summary?.total_count || 0}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">{text.noData}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
