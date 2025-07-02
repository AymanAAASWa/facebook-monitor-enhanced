
"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Users, 
  Phone, 
  Search, 
  FileText, 
  MessageCircle, 
  Share2, 
  Heart, 
  Calendar,
  TrendingUp,
  Activity,
  MapPin,
  Briefcase,
  Star,
  ExternalLink,
  Eye,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  Gift
} from "lucide-react"
import { UserAnalyticsViewer } from "./user-analytics-viewer"
import { facebookUserAnalyticsService } from "@/lib/facebook-user-analytics-service"
import type { FacebookPost } from "@/lib/facebook-api-service"

interface ProcessedUser {
  id: string
  name: string
  picture?: string
  postCount: number
  commentCount: number
  likeCount: number
  shareCount: number
  totalEngagement: number
  lastActivity: string
  sources: string[]
  avgPostLength: number
  activityScore: number
  influenceScore: number
  birthDate?: string
  location?: string
  work?: string
  age?: number
  education?: string
  hometown?: string
  isSpecialUser?: boolean
  nextBirthday?: string
  engagementRate: number
  recentActivity: Array<{
    type: 'post' | 'comment' | 'like' | 'share'
    date: string
    content?: string
  }>
}

interface UserTableProps {
  users: Array<{
    id: string
    name: string
    picture?: string
    postCount: number
    commentCount: number
    lastActivity: string
    sources: string[]
  }>
  posts: Array<FacebookPost & { source_id: string; source_name: string; source_type: string }>
  phoneSearchResults: { [key: string]: string }
  onPhoneSearch: (userId: string, userName: string, source: string) => void
  searchingPhones: Set<string>
  darkMode: boolean
  language: "ar" | "en"
}

export function UserTable({
  users = [],
  posts = [],
  phoneSearchResults = {},
  onPhoneSearch,
  searchingPhones = new Set(),
  darkMode = false,
  language = "ar",
}: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "posts" | "comments" | "engagement" | "lastActivity" | "influence">("engagement")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterSource, setFilterSource] = useState<string>("all")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [showUserAnalytics, setShowUserAnalytics] = useState(false)
  const [selectedTab, setSelectedTab] = useState("overview")
  const [userDetails, setUserDetails] = useState<any>(null)
  const [loadingUserDetails, setLoadingUserDetails] = useState(false)

  const t = {
    ar: {
      users: "المستخدمون",
      totalUsers: "إجمالي المستخدمين",
      search: "البحث في المستخدمين...",
      sortBy: "ترتيب حسب",
      filterBySource: "تصفية حسب المصدر",
      name: "الاسم",
      posts: "المنشورات",
      comments: "التعليقات",
      likes: "الإعجابات",
      shares: "المشاركات",
      engagement: "التفاعل",
      lastActivity: "آخر نشاط",
      sources: "المصادر",
      noUsers: "لا يوجد مستخدمون",
      searchPhone: "البحث عن رقم",
      searching: "جاري البحث...",
      viewAnalytics: "عرض التحليلات",
      overview: "نظرة عامة",
      details: "التفاصيل",
      activity: "النشاط",
      demographics: "الديموغرافيا",
      totalEngagement: "إجمالي التفاعل",
      avgPostLength: "متوسط طول المنشور",
      activityScore: "نقاط النشاط",
      influenceScore: "نقاط التأثير",
      location: "الموقع",
      work: "العمل",
      birthDate: "تاريخ الميلاد",
      nextBirthday: "عيد الميلاد القادم",
      specialUser: "مستخدم مميز",
      recentActivity: "النشاط الأخير",
      high: "عالي",
      medium: "متوسط",
      low: "منخفض",
      exportData: "تصدير البيانات",
      viewProfile: "عرض الملف الشخصي",
      all: "الكل",
      influence: "التأثير",
      engagementRate: "معدل التفاعل",
      activeUsers: "المستخدمون النشطون",
      topInfluencers: "الأكثر تأثيراً",
      birthdayToday: "عيد ميلاد اليوم",
      birthdayThisWeek: "عيد ميلاد هذا الأسبوع",
      days: "أيام"
    },
    en: {
      users: "Users",
      totalUsers: "Total Users",
      search: "Search users...",
      sortBy: "Sort by",
      filterBySource: "Filter by source",
      name: "Name",
      posts: "Posts",
      comments: "Comments",
      likes: "Likes",
      shares: "Shares",
      engagement: "Engagement",
      lastActivity: "Last Activity",
      sources: "Sources",
      noUsers: "No users found",
      searchPhone: "Search Phone",
      searching: "Searching...",
      viewAnalytics: "View Analytics",
      overview: "Overview",
      details: "Details",
      activity: "Activity",
      demographics: "Demographics",
      totalEngagement: "Total Engagement",
      avgPostLength: "Avg Post Length",
      activityScore: "Activity Score",
      influenceScore: "Influence Score",
      location: "Location",
      work: "Work",
      birthDate: "Birth Date",
      nextBirthday: "Next Birthday",
      specialUser: "Special User",
      recentActivity: "Recent Activity",
      high: "High",
      medium: "Medium",
      low: "Low",
      exportData: "Export Data",
      viewProfile: "View Profile",
      all: "All",
      influence: "Influence",
      engagementRate: "Engagement Rate",
      activeUsers: "Active Users",
      topInfluencers: "Top Influencers",
      birthdayToday: "Birthday Today",
      birthdayThisWeek: "Birthday This Week",
      days: "days"
    }
  }

  const text = t[language]

  // معالجة البيانات المحسنة للمستخدمين
  const processedUsers = useMemo((): ProcessedUser[] => {
    if (!posts || posts.length === 0) return []

    const userMap = new Map<string, ProcessedUser>()

    // دالة مساعدة لإنشاء مستخدم جديد
    const createUser = (userData: any, defaultActivity: string = ""): ProcessedUser => {
      let age: number | undefined
      let location: string | undefined
      let work: string | undefined

      // البحث في البيانات الإضافية للمستخدم
      if (userData.age_range) {
        age = userData.age_range.min
      }
      if (userData.location) {
        location = userData.location.name
      }
      if (userData.work && userData.work.length > 0) {
        work = userData.work[0].employer?.name
      }

      return {
        id: userData.id,
        name: userData.name || "Unknown User",
        picture: userData.picture?.data?.url,
        age,
        location,
        work,
        postCount: 0,
        commentCount: 0,
        likeCount: 0,
        shareCount: 0,
        totalEngagement: 0,
        lastActivity: defaultActivity,
        sources: [],
        avgPostLength: 0,
        activityScore: 0,
        influenceScore: 0,
        engagementRate: 0,
        recentActivity: []
      }
    }

    // معالجة المنشورات
    posts.forEach(post => {
      if (post.from?.id) {
        const userId = post.from.id
        if (!userMap.has(userId)) {
          userMap.set(userId, createUser(post.from, post.created_time || ""))
        }

        const user = userMap.get(userId)!
        user.postCount++
        user.likeCount += post.reactions?.summary?.total_count || 0
        user.shareCount += post.shares?.count || 0

        if (post.message) {
          user.avgPostLength = (user.avgPostLength * (user.postCount - 1) + post.message.length) / user.postCount
        }

        if (post.source_name && !user.sources.includes(post.source_name)) {
          user.sources.push(post.source_name)
        }

        // إضافة للنشاط الأخير
        user.recentActivity.push({
          type: 'post',
          date: post.created_time || "",
          content: post.message?.substring(0, 100)
        })

        // تحديث آخر نشاط
        if (new Date(post.created_time || "") > new Date(user.lastActivity)) {
          user.lastActivity = post.created_time || ""
        }
      }

      // معالجة التعليقات
      if (post.comments?.data) {
        post.comments.data.forEach(comment => {
          if (comment.from?.id) {
            const userId = comment.from.id
            if (!userMap.has(userId)) {
              userMap.set(userId, createUser(comment.from, comment.created_time || ""))
            }

            const user = userMap.get(userId)!
            user.commentCount++
            user.likeCount += comment.like_count || 0

            // إضافة للنشاط الأخير
            user.recentActivity.push({
              type: 'comment',
              date: comment.created_time || "",
              content: comment.message?.substring(0, 100)
            })

            // تحديث آخر نشاط
            if (new Date(comment.created_time || "") > new Date(user.lastActivity)) {
              user.lastActivity = comment.created_time || ""
            }
          }
        })
      }
    })

    // حساب الإحصائيات النهائية
    return Array.from(userMap.values()).map(user => {
      user.totalEngagement = user.likeCount + user.commentCount + user.shareCount
      user.activityScore = (user.postCount * 10) + (user.commentCount * 5) + (user.likeCount * 2) + (user.shareCount * 15)
      user.influenceScore = user.postCount > 0 ? Math.round(((user.likeCount + user.shareCount) / user.postCount) * 10) / 10 : 0
      user.engagementRate = user.postCount > 0 ? Math.round((user.totalEngagement / user.postCount) * 100) / 100 : 0
      user.isSpecialUser = user.activityScore > 100 || user.influenceScore > 10

      // ترتيب النشاط الأخير
      user.recentActivity = user.recentActivity
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)

      return user
    })
  }, [posts])

  // تصفية وترتيب المستخدمين
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = processedUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSource = filterSource === "all" || user.sources.includes(filterSource)
      return matchesSearch && matchesSource
    })

    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "posts":
          aValue = a.postCount
          bValue = b.postCount
          break
        case "comments":
          aValue = a.commentCount
          bValue = b.commentCount
          break
        case "engagement":
          aValue = a.totalEngagement
          bValue = b.totalEngagement
          break
        case "lastActivity":
          aValue = new Date(a.lastActivity).getTime()
          bValue = new Date(b.lastActivity).getTime()
          break
        case "influence":
          aValue = a.influenceScore
          bValue = b.influenceScore
          break
        default:
          aValue = a.totalEngagement
          bValue = b.totalEngagement
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [processedUsers, searchTerm, filterSource, sortBy, sortOrder])

  // احصائيات سريعة
  const stats = useMemo(() => {
    const activeUsers = processedUsers.filter(user => 
      new Date().getTime() - new Date(user.lastActivity).getTime() < 7 * 24 * 60 * 60 * 1000
    ).length

    const topInfluencers = processedUsers
      .sort((a, b) => b.influenceScore - a.influenceScore)
      .slice(0, 5)

    return {
      totalUsers: processedUsers.length,
      activeUsers,
      topInfluencers,
      specialUsers: processedUsers.filter(user => user.isSpecialUser).length
    }
  }, [processedUsers])

  // الحصول على المصادر المتاحة
  const availableSources = useMemo(() => {
    const sources = new Set<string>()
    processedUsers.forEach(user => {
      user.sources.forEach(source => sources.add(source))
    })
    return Array.from(sources)
  }, [processedUsers])

  // تحميل تفاصيل المستخدم
  const loadUserDetails = async (userId: string) => {
    setLoadingUserDetails(true)
    try {
      const result = await facebookUserAnalyticsService.getUserAnalytics(userId, posts)
      if (result.data) {
        setUserDetails(result.data)
      }
    } catch (error) {
      console.error("Error loading user details:", error)
    } finally {
      setLoadingUserDetails(false)
    }
  }

  // تصدير بيانات المستخدم
  const exportUserData = (user: ProcessedUser) => {
    const data = {
      user_info: user,
      export_date: new Date().toISOString(),
      export_source: "Facebook Monitor - User Table"
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `user-${user.id}-data.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // إذا كان هناك مستخدم محدد لعرض التحليلات
  if (showUserAnalytics && selectedUserId) {
    return (
      <UserAnalyticsViewer
        userId={selectedUserId}
        posts={posts}
        darkMode={darkMode}
        language={language}
        onClose={() => {
          setShowUserAnalytics(false)
          setSelectedUserId(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardContent className="p-3 sm:p-4 text-center">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-xl sm:text-2xl font-bold">{stats.totalUsers}</div>
            <div className="text-xs sm:text-sm text-gray-500">{text.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardContent className="p-3 sm:p-4 text-center">
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-500" />
            <div className="text-xl sm:text-2xl font-bold">{stats.activeUsers}</div>
            <div className="text-xs sm:text-sm text-gray-500">{text.activeUsers}</div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardContent className="p-3 sm:p-4 text-center">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-xl sm:text-2xl font-bold">{stats.topInfluencers.length}</div>
            <div className="text-xs sm:text-sm text-gray-500">{text.topInfluencers}</div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardContent className="p-3 sm:p-4 text-center">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-xl sm:text-2xl font-bold">{stats.specialUsers}</div>
            <div className="text-xs sm:text-sm text-gray-500">{text.specialUser}</div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات التحكم */}
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* البحث */}
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={text.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* الترتيب */}
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={text.sortBy} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engagement">{text.engagement}</SelectItem>
                <SelectItem value="influence">{text.influence}</SelectItem>
                <SelectItem value="posts">{text.posts}</SelectItem>
                <SelectItem value="comments">{text.comments}</SelectItem>
                <SelectItem value="lastActivity">{text.lastActivity}</SelectItem>
                <SelectItem value="name">{text.name}</SelectItem>
              </SelectContent>
            </Select>

            {/* اتجاه الترتيب */}
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2"
            >
              {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>

            {/* تصفية المصدر */}
            {availableSources.length > 0 && (
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder={text.filterBySource} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{text.all}</SelectItem>
                  {availableSources.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* قائمة المستخدمين */}
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {text.users} ({filteredAndSortedUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAndSortedUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">{text.noUsers}</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-3 sm:space-y-4">
                {filteredAndSortedUsers.map((user) => (
                  <Card key={user.id} className={`${darkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50"} p-3 sm:p-4`}>
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* الصورة الرمزية */}
                      <div className="relative">
                        <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                          <AvatarImage src={user.picture} alt={user.name} />
                          <AvatarFallback>
                            <Users className="w-4 h-4 sm:w-6 sm:h-6" />
                          </AvatarFallback>
                        </Avatar>
                        {user.isSpecialUser && (
                          <Star className="absolute -top-1 -right-1 w-4 h-4 text-orange-500 fill-current" />
                        )}
                      </div>

                      {/* معلومات المستخدم */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <div>
                            <h4 className="font-semibold text-base sm:text-lg truncate">{user.name}</h4>
                            <div className="space-y-1">
                              <p className="text-xs sm:text-sm text-gray-500">ID: {user.id.substring(0, 15)}...</p>
                              {user.age && (
                                <div className="flex items-center gap-1 text-xs text-blue-600">
                                  <Calendar className="w-3 h-3" />
                                  <span>{user.age} سنة</span>
                                </div>
                              )}
                              {user.location && (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <MapPin className="w-3 h-3" />
                                  <span>{user.location}</span>
                                </div>
                              )}
                              {user.work && (
                                <div className="flex items-center gap-1 text-xs text-purple-600">
                                  <Briefcase className="w-3 h-3" />
                                  <span>{user.work}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {user.isSpecialUser && (
                              <Badge className="bg-orange-100 text-orange-800 text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                {text.specialUser}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {text.activityScore}: {user.activityScore}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {text.influenceScore}: {user.influenceScore}
                            </Badge>
                          </div>
                        </div>

                        {/* إحصائيات */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-3">
                          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-sm sm:text-lg font-bold text-blue-600">{user.postCount}</div>
                            <div className="text-xs text-gray-600">{text.posts}</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-sm sm:text-lg font-bold text-green-600">{user.commentCount}</div>
                            <div className="text-xs text-gray-600">{text.comments}</div>
                          </div>
                          <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="text-sm sm:text-lg font-bold text-red-600">{user.likeCount}</div>
                            <div className="text-xs text-gray-600">{text.likes}</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="text-sm sm:text-lg font-bold text-purple-600">{user.shareCount}</div>
                            <div className="text-xs text-gray-600">{text.shares}</div>
                          </div>
                        </div>

                        {/* النشاط الأخير */}
                        {user.recentActivity.length > 0 && (
                          <div className="mb-3">
                            <h5 className="text-xs sm:text-sm font-medium mb-2">{text.recentActivity}:</h5>
                            <div className="space-y-1">
                              {user.recentActivity.slice(0, 2).map((activity, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                                  {activity.type === 'post' && <FileText className="w-3 h-3" />}
                                  {activity.type === 'comment' && <MessageCircle className="w-3 h-3" />}
                                  {activity.type === 'like' && <Heart className="w-3 h-3" />}
                                  {activity.type === 'share' && <Share2 className="w-3 h-3" />}
                                  <span>{activity.type === 'post' ? 'نشر' : activity.type === 'comment' ? 'علق' : activity.type === 'like' ? 'أعجب' : 'شارك'}</span>
                                  <span className="text-gray-400">•</span>
                                  <span>{new Date(activity.date).toLocaleDateString("ar-EG")}</span>
                                  {activity.content && (
                                    <>
                                      <span className="text-gray-400">•</span>
                                      <span className="truncate max-w-32">{activity.content}...</span>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* المصادر */}
                        {user.sources.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                              {user.sources.slice(0, 3).map((source, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {source}
                                </Badge>
                              ))}
                              {user.sources.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{user.sources.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* آخر نشاط */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                          <Calendar className="w-3 h-3" />
                          <span>{text.lastActivity}: {new Date(user.lastActivity).toLocaleDateString("ar-EG")}</span>
                        </div>

                        {/* الأزرار */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(user.id)
                              setShowUserAnalytics(true)
                            }}
                            className="text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            {text.viewAnalytics}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://facebook.com/${user.id}`, "_blank")}
                            className="text-xs"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {text.viewProfile}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportUserData(user)}
                            className="text-xs"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            {text.exportData}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPhoneSearch(user.id, user.name, user.sources[0] || "")}
                            disabled={searchingPhones.has(user.id)}
                            className="text-xs"
                          >
                            {searchingPhones.has(user.id) ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-1"></div>
                                {text.searching}
                              </>
                            ) : (
                              <>
                                <Phone className="w-3 h-3 mr-1" />
                                {text.searchPhone}
                              </>
                            )}
                          </Button>

                          {phoneSearchResults[user.id] && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              {phoneSearchResults[user.id]}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
