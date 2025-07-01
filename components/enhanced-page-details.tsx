"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  MessageCircle,
  Star,
  TrendingUp,
  Activity,
  ThumbsUp,
  Share2,
  Clock,
  BarChart3,
  Heart,
} from "lucide-react"
import { enhancedFacebookService } from "@/lib/enhanced-facebook-service"

interface EnhancedPageDetailsProps {
  pageId: string
  darkMode: boolean
  language: "ar" | "en"
  onClose: () => void
}

export function EnhancedPageDetails({ pageId, darkMode, language, onClose }: EnhancedPageDetailsProps) {
  const [pageInfo, setPageInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("info")

  const t = {
    ar: {
      info: "معلومات الصفحة",
      posts: "المنشورات",
      insights: "الإحصائيات",
      messages: "الرسائل",
      reviews: "التقييمات",
      analytics: "التحليلات",
      pageInfo: "معلومات الصفحة",
      contactInfo: "معلومات الاتصال",
      businessHours: "ساعات العمل",
      socialStats: "الإحصائيات الاجتماعية",
      category: "الفئة",
      about: "نبذة عن الصفحة",
      website: "الموقع الإلكتروني",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      address: "العنوان",
      followers: "المتابعون",
      likes: "الإعجابات",
      checkins: "تسجيلات الوصول",
      totalPosts: "إجمالي المنشورات",
      averageEngagement: "متوسط التفاعل",
      topPosts: "أفضل المنشورات",
      recentPosts: "المنشورات الأخيرة",
      pageInsights: "إحصائيات الصفحة",
      impressions: "المشاهدات",
      reach: "الوصول",
      engagement: "التفاعل",
      conversations: "المحادثات",
      customerReviews: "تقييمات العملاء",
      averageRating: "متوسط التقييم",
      totalReviews: "إجمالي التقييمات",
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      close: "إغلاق",
      noData: "لا توجد بيانات",
      viewAll: "عرض الكل",
      comments: "تعليق",
      shares: "مشاركة",
      views: "مشاهدة",
      monday: "الاثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
      saturday: "السبت",
      sunday: "الأحد",
    },
    en: {
      info: "Page Info",
      posts: "Posts",
      insights: "Insights",
      messages: "Messages",
      reviews: "Reviews",
      analytics: "Analytics",
      pageInfo: "Page Information",
      contactInfo: "Contact Information",
      businessHours: "Business Hours",
      socialStats: "Social Statistics",
      category: "Category",
      about: "About",
      website: "Website",
      phone: "Phone",
      email: "Email",
      address: "Address",
      followers: "Followers",
      likes: "Likes",
      checkins: "Check-ins",
      totalPosts: "Total Posts",
      averageEngagement: "Average Engagement",
      topPosts: "Top Posts",
      recentPosts: "Recent Posts",
      pageInsights: "Page Insights",
      impressions: "Impressions",
      reach: "Reach",
      engagement: "Engagement",
      conversations: "Conversations",
      customerReviews: "Customer Reviews",
      averageRating: "Average Rating",
      totalReviews: "Total Reviews",
      loading: "Loading...",
      error: "Error occurred",
      close: "Close",
      noData: "No data available",
      viewAll: "View All",
      comments: "Comments",
      shares: "Shares",
      views: "Views",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    },
  }

  const text = t[language]

  useEffect(() => {
    loadPageData()
  }, [pageId])

  const loadPageData = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await enhancedFacebookService.getEnhancedPageInfo(pageId)
      if (result.error) {
        setError(result.error)
      } else {
        setPageInfo(result.data)
      }
    } catch (error) {
      setError("Failed to load page data")
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

  if (!pageInfo) {
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
    totalPosts: pageInfo.posts?.data?.length || 0,
    totalLikes:
      pageInfo.posts?.data?.reduce((sum: number, post: any) => sum + (post.likes?.summary?.total_count || 0), 0) || 0,
    totalComments:
      pageInfo.posts?.data?.reduce((sum: number, post: any) => sum + (post.comments?.summary?.total_count || 0), 0) ||
      0,
    totalShares: pageInfo.posts?.data?.reduce((sum: number, post: any) => sum + (post.shares?.count || 0), 0) || 0,
    averageRating:
      pageInfo.ratings?.data?.reduce((sum: number, rating: any) => sum + rating.rating, 0) /
        (pageInfo.ratings?.data?.length || 1) || 0,
  }

  const averageEngagement =
    stats.totalPosts > 0 ? (stats.totalLikes + stats.totalComments + stats.totalShares) / stats.totalPosts : 0

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={pageInfo.picture?.data?.url || "/placeholder.svg"} />
                <AvatarFallback>
                  <Building className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{pageInfo.name}</h1>
                <p className="text-gray-500">ID: {pageInfo.id}</p>
                {pageInfo.category && (
                  <Badge variant="outline" className="mt-1">
                    {pageInfo.category}
                  </Badge>
                )}
              </div>
            </div>
            <Button onClick={onClose} variant="outline">
              {text.close}
            </Button>
          </div>
          {pageInfo.cover && (
            <div className="mt-4">
              <img
                src={pageInfo.cover.source || "/placeholder.svg"}
                alt="Page cover"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{pageInfo.fan_count?.toLocaleString() || 0}</p>
            <p className="text-sm text-gray-500">{text.likes}</p>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p className="text-2xl font-bold">{pageInfo.followers_count?.toLocaleString() || 0}</p>
            <p className="text-sm text-gray-500">{text.followers}</p>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{stats.totalPosts}</p>
            <p className="text-sm text-gray-500">{text.totalPosts}</p>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
            <p className="text-sm text-gray-500">{text.averageRating}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="info">{text.info}</TabsTrigger>
          <TabsTrigger value="posts">{text.posts}</TabsTrigger>
          <TabsTrigger value="insights">{text.insights}</TabsTrigger>
          <TabsTrigger value="messages">{text.messages}</TabsTrigger>
          <TabsTrigger value="reviews">{text.reviews}</TabsTrigger>
          <TabsTrigger value="analytics">{text.analytics}</TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Page Information */}
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  {text.pageInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pageInfo.about && (
                  <div>
                    <h4 className="font-medium mb-1">{text.about}</h4>
                    <p className="text-sm text-gray-600">{pageInfo.about}</p>
                  </div>
                )}
                {pageInfo.category && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span>
                      {text.category}: {pageInfo.category}
                    </span>
                  </div>
                )}
                {pageInfo.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a
                      href={pageInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {pageInfo.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {text.contactInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pageInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{pageInfo.phone}</span>
                  </div>
                )}
                {pageInfo.emails && pageInfo.emails.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{pageInfo.emails[0]}</span>
                  </div>
                )}
                {pageInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>
                      {pageInfo.location.street && `${pageInfo.location.street}, `}
                      {pageInfo.location.city && `${pageInfo.location.city}, `}
                      {pageInfo.location.country}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Business Hours */}
          {pageInfo.hours && (
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {text.businessHours}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(pageInfo.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="font-medium">{text[day as keyof typeof text] || day}</span>
                      <span className="text-gray-600">{hours as string}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
              {pageInfo.posts?.data && pageInfo.posts.data.length > 0 ? (
                <div className="space-y-4">
                  {pageInfo.posts.data.slice(0, 5).map((post: any) => (
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
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">{text.noData}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {text.pageInsights}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pageInfo.insights?.data && pageInfo.insights.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pageInfo.insights.data.map((insight: any) => (
                    <div key={insight.name} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2">{insight.title || insight.name}</h4>
                      <div className="space-y-2">
                        {insight.values?.slice(0, 3).map((value: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {new Date(value.end_time).toLocaleDateString("ar-EG")}
                            </span>
                            <span className="font-bold">{value.value?.toLocaleString()}</span>
                          </div>
                        ))}
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

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {text.conversations}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pageInfo.conversations?.data && pageInfo.conversations.data.length > 0 ? (
                <div className="space-y-4">
                  {pageInfo.conversations.data.slice(0, 5).map((conversation: any) => (
                    <div key={conversation.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">محادثة {conversation.id}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(conversation.updated_time).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>الرسائل: {conversation.message_count}</span>
                        {conversation.unread_count > 0 && (
                          <Badge variant="destructive">{conversation.unread_count} غير مقروءة</Badge>
                        )}
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

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                {text.customerReviews}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pageInfo.ratings?.data && pageInfo.ratings.data.length > 0 ? (
                <div className="space-y-4">
                  {pageInfo.ratings.data.slice(0, 5).map((rating: any, index: number) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{rating.reviewer?.name}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < rating.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(rating.created_time).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                      {rating.review_text && <p className="text-sm text-gray-600">{rating.review_text}</p>}
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
                  {text.socialStats}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>{text.averageEngagement}</span>
                  <span className="font-bold">{averageEngagement.toFixed(1)}</span>
                </div>
                <Progress value={Math.min((averageEngagement / 100) * 100, 100)} className="w-full" />

                <div className="flex items-center justify-between">
                  <span>{text.totalReviews}</span>
                  <span className="font-bold">{pageInfo.ratings?.data?.length || 0}</span>
                </div>
                <Progress
                  value={Math.min(((pageInfo.ratings?.data?.length || 0) / 50) * 100, 100)}
                  className="w-full"
                />
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
                {pageInfo.posts?.data && pageInfo.posts.data.length > 0 ? (
                  <div className="space-y-3">
                    {pageInfo.posts.data
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
