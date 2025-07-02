"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BarChart3,
  TrendingUp,
  MessageSquare,
  Heart,
  Users,
  Calendar,
  Clock,
  Activity,
  ArrowLeft,
  ExternalLink,
  FileText,
  Star,
  Phone,
  Copy
} from "lucide-react"
import type { FacebookPost } from "@/lib/facebook-api-service"

interface UserAnalyticsViewerProps {
  userId: string
  posts: Array<FacebookPost & { source_id: string; source_name: string; source_type: string }>
  darkMode: boolean
  language: "ar" | "en"
  onClose: () => void
}

interface UserStats {
  totalPosts: number
  totalComments: number
  totalLikes: number
  avgPostLength: number
  mostActiveDay: string
  mostActiveHour: string
  engagementRate: number
  sources: string[]
  activityTimeline: Array<{ date: string; posts: number; comments: number }>
}

export function UserAnalyticsViewer({
  userId,
  posts,
  darkMode,
  language,
  onClose,
}: UserAnalyticsViewerProps) {
  const [selectedTab, setSelectedTab] = useState("overview")

  const t = {
    ar: {
      userAnalytics: "تحليلات المستخدم",
      overview: "نظرة عامة",
      activity: "النشاط",
      engagement: "التفاعل",
      timeline: "الخط الزمني",
      back: "رجوع",
      totalPosts: "إجمالي المنشورات",
      totalComments: "إجمالي التعليقات",
      totalLikes: "إجمالي الإعجابات",
      avgPostLength: "متوسط طول المنشور",
      mostActiveDay: "أكثر الأيام نشاطاً",
      mostActiveHour: "أكثر الساعات نشاطاً",
      engagementRate: "معدل التفاعل",
      activeSources: "المصادر النشطة",
      recentPosts: "المنشورات الأخيرة",
      recentComments: "التعليقات الأخيرة",
      noData: "لا توجد بيانات",
      viewProfile: "عرض الملف الشخصي",
      copyUserId: "نسخ معرف المستخدم",
      high: "عالي",
      medium: "متوسط",
      low: "منخفض",
      posts: "منشورات",
      comments: "تعليقات",
      sunday: "الأحد",
      monday: "الاثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
      saturday: "السبت",
    },
    en: {
      userAnalytics: "User Analytics",
      overview: "Overview",
      activity: "Activity",
      engagement: "Engagement",
      timeline: "Timeline",
      back: "Back",
      totalPosts: "Total Posts",
      totalComments: "Total Comments",
      totalLikes: "Total Likes",
      avgPostLength: "Avg Post Length",
      mostActiveDay: "Most Active Day",
      mostActiveHour: "Most Active Hour",
      engagementRate: "Engagement Rate",
      activeSources: "Active Sources",
      recentPosts: "Recent Posts",
      recentComments: "Recent Comments",
      noData: "No data available",
      viewProfile: "View Profile",
      copyUserId: "Copy User ID",
      high: "High",
      medium: "Medium",
      low: "Low",
      posts: "Posts",
      comments: "Comments",
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
    },
  }

  const text = t[language]

  // حساب إحصائيات المستخدم
  const userStats = useMemo((): UserStats => {
    const userPosts = posts.filter(post => post.from?.id === userId)
    const userComments = posts.flatMap(post => 
      post.comments?.data?.filter(comment => comment.from?.id === userId) || []
    )

    const totalLikes = userPosts.reduce((sum, post) => 
      sum + (post.reactions?.summary?.total_count || 0), 0
    )

    const avgPostLength = userPosts.length > 0 
      ? Math.round(userPosts.reduce((sum, post) => sum + (post.message?.length || 0), 0) / userPosts.length)
      : 0

    // تحليل أيام النشاط
    const dayActivity = userPosts.reduce((acc, post) => {
      if (post.created_time) {
        const day = new Date(post.created_time).getDay()
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        const dayName = dayNames[day]
        acc[dayName] = (acc[dayName] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const mostActiveDay = Object.entries(dayActivity).reduce((a, b) => 
      dayActivity[a[0]] > dayActivity[b[0]] ? a : b, ['sunday', 0]
    )[0]

    // تحليل ساعات النشاط
    const hourActivity = userPosts.reduce((acc, post) => {
      if (post.created_time) {
        const hour = new Date(post.created_time).getHours()
        acc[hour] = (acc[hour] || 0) + 1
      }
      return acc
    }, {} as Record<number, number>)

    const mostActiveHour = Object.entries(hourActivity).reduce((a, b) => 
      hourActivity[parseInt(a[0])] > hourActivity[parseInt(b[0])] ? a : b, ['0', 0]
    )[0]

    // معدل التفاعل
    const engagementRate = userPosts.length > 0 
      ? Math.round((totalLikes + userComments.length) / userPosts.length * 100) / 100
      : 0

    // المصادر النشطة
    const sources = Array.from(new Set(userPosts.map(post => post.source_name)))

    // الخط الزمني
    const activityTimeline = userPosts.reduce((acc, post) => {
      if (post.created_time) {
        const date = new Date(post.created_time).toDateString()
        const existing = acc.find(item => item.date === date)
        if (existing) {
          existing.posts += 1
        } else {
          acc.push({ date, posts: 1, comments: 0 })
        }
      }
      return acc
    }, [] as Array<{ date: string; posts: number; comments: number }>)

    // إضافة التعليقات للخط الزمني
    userComments.forEach(comment => {
      const date = new Date(comment.created_time).toDateString()
      const existing = activityTimeline.find(item => item.date === date)
      if (existing) {
        existing.comments += 1
      } else {
        activityTimeline.push({ date, posts: 0, comments: 1 })
      }
    })

    return {
      totalPosts: userPosts.length,
      totalComments: userComments.length,
      totalLikes,
      avgPostLength,
      mostActiveDay,
      mostActiveHour: `${mostActiveHour}:00`,
      engagementRate,
      sources,
      activityTimeline: activityTimeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  }, [userId, posts])

  const userInfo = useMemo(() => {
    const userPost = posts.find(post => post.from?.id === userId)
    return userPost?.from || null
  }, [userId, posts])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getEngagementLevel = (rate: number) => {
    if (rate > 10) return { label: text.high, color: "bg-green-100 text-green-800" }
    if (rate > 5) return { label: text.medium, color: "bg-yellow-100 text-yellow-800" }
    return { label: text.low, color: "bg-red-100 text-red-800" }
  }

  if (!userInfo) {
    return (
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} w-full max-w-4xl mx-auto`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{text.userAnalytics}</span>
            <Button variant="outline" onClick={onClose} size="sm">
              <ArrowLeft className="w-4 h-4 ml-2" />
              {text.back}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">{text.noData}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6 p-2 sm:p-4">
      {/* Header */}
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                <AvatarImage src={userInfo.picture?.data?.url} alt={userInfo.name} />
                <AvatarFallback>{userInfo.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg sm:text-xl">{userInfo.name}</CardTitle>
                <CardDescription className="text-sm">معرف المستخدم: {userId}</CardDescription>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://facebook.com/${userId}`, "_blank")}
                className="text-xs sm:text-sm"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                {text.viewProfile}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(userId)}
                className="text-xs sm:text-sm"
              >
                <Copy className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                {text.copyUserId}
              </Button>
              <Button variant="outline" onClick={onClose} size="sm" className="text-xs sm:text-sm">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                {text.back}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
              {userStats.totalPosts}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">{text.totalPosts}</div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
              {userStats.totalComments}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">{text.totalComments}</div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-red-600 mb-1">
              {userStats.totalLikes}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">{text.totalLikes}</div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">
              {userStats.engagementRate}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">{text.engagementRate}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm p-2 sm:p-3">
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            {text.overview}
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs sm:text-sm p-2 sm:p-3">
            <Activity className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            {text.activity}
          </TabsTrigger>
          <TabsTrigger value="engagement" className="text-xs sm:text-sm p-2 sm:p-3">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            {text.engagement}
          </TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs sm:text-sm p-2 sm:p-3">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            {text.timeline}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">معلومات النشاط</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{text.avgPostLength}</span>
                  <Badge variant="outline" className="text-xs">{userStats.avgPostLength} حرف</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{text.mostActiveDay}</span>
                  <Badge variant="outline" className="text-xs">{text[userStats.mostActiveDay as keyof typeof text] || userStats.mostActiveDay}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{text.mostActiveHour}</span>
                  <Badge variant="outline" className="text-xs">{userStats.mostActiveHour}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{text.engagementRate}</span>
                  <Badge className={`text-xs ${getEngagementLevel(userStats.engagementRate).color}`}>
                    {getEngagementLevel(userStats.engagementRate).label}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">{text.activeSources}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userStats.sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm truncate">{source}</span>
                      <Badge variant="secondary" className="text-xs">
                        {posts.filter(p => p.from?.id === userId && p.source_name === source).length}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">نشاط المستخدم التفصيلي</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 sm:h-96">
                <div className="space-y-3">
                  {posts
                    .filter(post => post.from?.id === userId)
                    .slice(0, 10)
                    .map((post) => (
                      <div key={post.id} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <FileText className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">منشور في {post.source_name}</p>
                          <p className="text-xs text-gray-500 mb-2">
                            {new Date(post.created_time || '').toLocaleDateString("ar-EG")}
                          </p>
                          {post.message && (
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {post.message.substring(0, 100)}...
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              <Heart className="w-3 h-3 mr-1" />
                              {post.reactions?.summary?.total_count || 0}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              {post.comments?.data?.length || 0}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">تحليل التفاعل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(userStats.totalLikes / Math.max(userStats.totalPosts, 1))}
                    </div>
                    <div className="text-sm text-gray-600">متوسط الإعجابات/منشور</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(userStats.totalComments / Math.max(userStats.totalPosts, 1))}
                    </div>
                    <div className="text-sm text-gray-600">متوسط التعليقات/منشور</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((userStats.totalPosts + userStats.totalComments) / Math.max(userStats.sources.length, 1))}
                    </div>
                    <div className="text-sm text-gray-600">متوسط النشاط/مصدر</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">الخط الزمني للنشاط</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 sm:h-96">
                <div className="space-y-3">
                  {userStats.activityTimeline.slice(0, 30).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {new Date(item.date).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.posts > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="w-3 h-3 mr-1" />
                            {item.posts} {text.posts}
                          </Badge>
                        )}
                        {item.comments > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {item.comments} {text.comments}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}