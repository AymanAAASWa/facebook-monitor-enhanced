"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Shield,
  MessageCircle,
  TrendingUp,
  Activity,
  ThumbsUp,
  Crown,
  User,
  Lock,
  Globe,
  Eye,
} from "lucide-react"
import { enhancedFacebookService } from "@/lib/enhanced-facebook-service"

interface EnhancedGroupDetailsProps {
  groupId: string
  darkMode: boolean
  language: "ar" | "en"
  onClose: () => void
}

export function EnhancedGroupDetails({ groupId, darkMode, language, onClose }: EnhancedGroupDetailsProps) {
  const [groupInfo, setGroupInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("info")

  const t = {
    ar: {
      info: "معلومات المجموعة",
      posts: "المنشورات",
      members: "الأعضاء",
      admins: "المشرفون",
      analytics: "التحليلات",
      groupInfo: "معلومات المجموعة",
      groupStats: "إحصائيات المجموعة",
      memberActivity: "نشاط الأعضاء",
      description: "الوصف",
      privacy: "الخصوصية",
      memberCount: "عدد الأعضاء",
      totalPosts: "إجمالي المنشورات",
      averageEngagement: "متوسط التفاعل",
      topPosts: "أفضل المنشورات",
      recentPosts: "المنشورات الأخيرة",
      groupAdmins: "مشرفو المجموعة",
      activeMembers: "الأعضاء النشطون",
      newMembers: "الأعضاء الجدد",
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      close: "إغلاق",
      noData: "لا توجد بيانات",
      viewAll: "عرض الكل",
      likes: "إعجاب",
      comments: "تعليق",
      shares: "مشاركة",
      views: "مشاهدة",
      public: "عامة",
      closed: "مغلقة",
      secret: "سرية",
      administrator: "مشرف",
      member: "عضو",
      joinedDate: "تاريخ الانضمام",
    },
    en: {
      info: "Group Info",
      posts: "Posts",
      members: "Members",
      admins: "Admins",
      analytics: "Analytics",
      groupInfo: "Group Information",
      groupStats: "Group Statistics",
      memberActivity: "Member Activity",
      description: "Description",
      privacy: "Privacy",
      memberCount: "Member Count",
      totalPosts: "Total Posts",
      averageEngagement: "Average Engagement",
      topPosts: "Top Posts",
      recentPosts: "Recent Posts",
      groupAdmins: "Group Admins",
      activeMembers: "Active Members",
      newMembers: "New Members",
      loading: "Loading...",
      error: "Error occurred",
      close: "Close",
      noData: "No data available",
      viewAll: "View All",
      likes: "Likes",
      comments: "Comments",
      shares: "Shares",
      views: "Views",
      public: "Public",
      closed: "Closed",
      secret: "Secret",
      administrator: "Administrator",
      member: "Member",
      joinedDate: "Joined Date",
    },
  }

  const text = t[language]

  useEffect(() => {
    loadGroupData()
  }, [groupId])

  const loadGroupData = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await enhancedFacebookService.getEnhancedGroupInfo(groupId)
      if (result.error) {
        setError(result.error)
      } else {
        setGroupInfo(result.data)
      }
    } catch (error) {
      setError("Failed to load group data")
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

  if (!groupInfo) {
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
    totalPosts: groupInfo.posts?.data?.length || 0,
    totalMembers: groupInfo.member_count || 0,
    totalAdmins: groupInfo.admins?.data?.length || 0,
    totalLikes:
      groupInfo.posts?.data?.reduce((sum: number, post: any) => sum + (post.likes?.summary?.total_count || 0), 0) || 0,
    totalComments:
      groupInfo.posts?.data?.reduce((sum: number, post: any) => sum + (post.comments?.summary?.total_count || 0), 0) ||
      0,
  }

  const averageEngagement = stats.totalPosts > 0 ? (stats.totalLikes + stats.totalComments) / stats.totalPosts : 0

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy.toLowerCase()) {
      case "public":
        return <Globe className="w-4 h-4" />
      case "closed":
        return <Lock className="w-4 h-4" />
      case "secret":
        return <Eye className="w-4 h-4" />
      default:
        return <Lock className="w-4 h-4" />
    }
  }

  const getPrivacyText = (privacy: string) => {
    switch (privacy.toLowerCase()) {
      case "public":
        return text.public
      case "closed":
        return text.closed
      case "secret":
        return text.secret
      default:
        return privacy
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={groupInfo.picture?.data?.url || "/placeholder.svg"} />
                <AvatarFallback>
                  <Users className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{groupInfo.name}</h1>
                <p className="text-gray-500">ID: {groupInfo.id}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getPrivacyIcon(groupInfo.privacy)}
                    {getPrivacyText(groupInfo.privacy)}
                  </Badge>
                  <Badge variant="secondary">
                    {stats.totalMembers.toLocaleString()} {text.member}
                  </Badge>
                </div>
              </div>
            </div>
            <Button onClick={onClose} variant="outline">
              {text.close}
            </Button>
          </div>
          {groupInfo.cover && (
            <div className="mt-4">
              <img
                src={groupInfo.cover.source || "/placeholder.svg"}
                alt="Group cover"
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
            <p className="text-2xl font-bold">{stats.totalMembers.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{text.memberCount}</p>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{stats.totalAdmins}</p>
            <p className="text-sm text-gray-500">{text.groupAdmins}</p>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{stats.totalPosts}</p>
            <p className="text-sm text-gray-500">{text.totalPosts}</p>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{averageEngagement.toFixed(1)}</p>
            <p className="text-sm text-gray-500">{text.averageEngagement}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="info">{text.info}</TabsTrigger>
          <TabsTrigger value="posts">{text.posts}</TabsTrigger>
          <TabsTrigger value="members">{text.members}</TabsTrigger>
          <TabsTrigger value="admins">{text.admins}</TabsTrigger>
          <TabsTrigger value="analytics">{text.analytics}</TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {text.groupInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupInfo.description && (
                <div>
                  <h4 className="font-medium mb-2">{text.description}</h4>
                  <p className="text-sm text-gray-600">{groupInfo.description}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  {getPrivacyIcon(groupInfo.privacy)}
                  <span>
                    {text.privacy}: {getPrivacyText(groupInfo.privacy)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>
                    {text.memberCount}: {stats.totalMembers.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
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
              {groupInfo.posts?.data && groupInfo.posts.data.length > 0 ? (
                <div className="space-y-4">
                  {groupInfo.posts.data.slice(0, 5).map((post: any) => (
                    <div key={post.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={post.from?.picture?.data?.url || "/placeholder.svg"} />
                          <AvatarFallback>
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{post.from?.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.created_time).toLocaleDateString("ar-EG")}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
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

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {text.members} ({stats.totalMembers.toLocaleString()})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {groupInfo.members?.data && groupInfo.members.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupInfo.members.data.slice(0, 10).map((member: any) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.picture?.data?.url || "/placeholder.svg"} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        <div className="flex items-center gap-2">
                          {member.administrator && (
                            <Badge variant="secondary" className="text-xs">
                              <Crown className="w-3 h-3 mr-1" />
                              {text.administrator}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">ID: {member.id}</span>
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

        {/* Admins Tab */}
        <TabsContent value="admins" className="space-y-4">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {text.groupAdmins} ({stats.totalAdmins})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {groupInfo.admins?.data && groupInfo.admins.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupInfo.admins.data.map((admin: any) => (
                    <div key={admin.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={admin.picture?.data?.url || "/placeholder.svg"} />
                        <AvatarFallback>
                          <Crown className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            {text.administrator}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">ID: {admin.id}</p>
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {text.memberActivity}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>{text.averageEngagement}</span>
                  <span className="font-bold">{averageEngagement.toFixed(1)}</span>
                </div>
                <Progress value={Math.min((averageEngagement / 100) * 100, 100)} className="w-full" />

                <div className="flex items-center justify-between">
                  <span>{text.totalPosts}</span>
                  <span className="font-bold">{stats.totalPosts}</span>
                </div>
                <Progress value={Math.min((stats.totalPosts / 100) * 100, 100)} className="w-full" />

                <div className="flex items-center justify-between">
                  <span>نسبة المشرفين</span>
                  <span className="font-bold">{((stats.totalAdmins / stats.totalMembers) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(stats.totalAdmins / stats.totalMembers) * 100} className="w-full" />
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
                {groupInfo.posts?.data && groupInfo.posts.data.length > 0 ? (
                  <div className="space-y-3">
                    {groupInfo.posts.data
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
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={post.from?.picture?.data?.url || "/placeholder.svg"} />
                              <AvatarFallback>
                                <User className="w-3 h-3" />
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{post.from?.name}</span>
                          </div>
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
