
"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Calendar, 
  User, 
  FileText,
  ExternalLink,
  Copy,
  Download,
  BarChart3,
  Activity,
  TrendingUp,
  Clock
} from "lucide-react"
import { FacebookService } from "@/lib/facebook-service"
import { toast } from "sonner"

interface UserPost {
  id: string
  message?: string
  created_time: string
  full_picture?: string
  from: {
    id: string
    name: string
    picture?: {
      data: {
        url: string
      }
    }
  }
  comments?: {
    data: Array<{
      id: string
      message?: string
      created_time: string
      from: {
        id: string
        name: string
      }
      like_count?: number
    }>
  }
  likes?: {
    summary: {
      total_count: number
    }
  }
  reactions?: {
    summary: {
      total_count: number
    }
  }
  shares?: {
    count: number
  }
}

interface UserComment {
  id: string
  message?: string
  created_time: string
  from: {
    id: string
    name: string
  }
  like_count?: number
  post_id?: string
}

interface UserInfo {
  id: string
  name: string
  picture?: {
    data: {
      url: string
    }
  }
  about?: string
  location?: {
    name: string
  }
  work?: Array<{
    employer: {
      name: string
    }
    position?: {
      name: string
    }
  }>
}

interface UserDataViewerProps {
  userId: string
  userName: string
  onClose?: () => void
}

export function UserDataViewer({ userId, userName, onClose }: UserDataViewerProps) {
  const [userPosts, setUserPosts] = useState<UserPost[]>([])
  const [userComments, setUserComments] = useState<UserComment[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const facebookService = new FacebookService()

  useEffect(() => {
    fetchUserData()
  }, [userId])

  const fetchUserData = async () => {
    setLoading(true)
    setError(null)

    try {
      // جلب معلومات المستخدم
      const userInfoResult = await facebookService.getUserInfo(userId)
      if (userInfoResult.data) {
        setUserInfo(userInfoResult.data)
      }

      // جلب منشورات المستخدم
      const postsResult = await facebookService.getUserPosts(userId)
      if (postsResult.data) {
        setUserPosts(postsResult.data)
      } else if (postsResult.error) {
        console.warn("Posts error:", postsResult.error)
      }

      // جلب تعليقات المستخدم (من البيانات المحلية)
      const localData = JSON.parse(localStorage.getItem('facebook_data') || '{}')
      const allComments: UserComment[] = []
      
      if (localData.posts) {
        localData.posts.forEach((post: any) => {
          if (post.comments?.data) {
            post.comments.data.forEach((comment: any) => {
              if (comment.from?.id === userId) {
                allComments.push({
                  ...comment,
                  post_id: post.id
                })
              }
            })
          }
        })
      }
      
      setUserComments(allComments)

    } catch (err) {
      setError("حدث خطأ في جلب بيانات المستخدم")
      console.error("Error fetching user data:", err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("تم النسخ إلى الحافظة")
  }

  const downloadUserData = () => {
    const data = {
      userInfo,
      posts: userPosts,
      comments: userComments,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `user-${userId}-data.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success("تم تنزيل بيانات المستخدم")
  }

  const openInFacebook = (url: string) => {
    window.open(url, "_blank")
  }

  // حساب الإحصائيات
  const totalLikes = userPosts.reduce((sum, post) => 
    sum + (post.reactions?.summary?.total_count || post.likes?.summary?.total_count || 0), 0
  )
  
  const totalShares = userPosts.reduce((sum, post) => 
    sum + (post.shares?.count || 0), 0
  )

  const commentLikes = userComments.reduce((sum, comment) => 
    sum + (comment.like_count || 0), 0
  )

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>جاري تحميل بيانات المستخدم...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">خطأ في تحميل البيانات</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchUserData} variant="outline">
            إعادة المحاولة
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6 p-2 sm:p-4">
      {/* Header - معلومات المستخدم */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                <AvatarImage 
                  src={userInfo?.picture?.data?.url} 
                  alt={userInfo?.name || userName} 
                />
                <AvatarFallback>
                  {(userInfo?.name || userName).charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg sm:text-xl">{userInfo?.name || userName}</CardTitle>
                <CardDescription className="text-sm">معرف المستخدم: {userId}</CardDescription>
                {userInfo?.about && (
                  <p className="text-sm text-muted-foreground mt-2 max-w-md">{userInfo.about}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openInFacebook(`https://facebook.com/${userId}`)}
                className="text-xs"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                فتح في فيسبوك
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={downloadUserData}
                className="text-xs"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                تنزيل البيانات
              </Button>
              {onClose && (
                <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                  إغلاق
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {userInfo && (
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userInfo.location && (
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Badge variant="secondary">الموقع</Badge>
                  <span className="text-sm">{userInfo.location.name}</span>
                </div>
              )}
              {userInfo.work && userInfo.work.length > 0 && (
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Badge variant="secondary">العمل</Badge>
                  <span className="text-sm">
                    {userInfo.work[0].position?.name || "موظف"} في {userInfo.work[0].employer.name}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-10">
          <TabsTrigger value="overview" className="text-xs sm:text-sm p-2 sm:p-3">
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="posts" className="text-xs sm:text-sm p-2 sm:p-3">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            المنشورات ({userPosts.length})
          </TabsTrigger>
          <TabsTrigger value="comments" className="text-xs sm:text-sm p-2 sm:p-3">
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            التعليقات ({userComments.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm p-2 sm:p-3">
            <Activity className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            التحليلات
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  {userPosts.length}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">إجمالي المنشورات</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {userComments.length}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">إجمالي التعليقات</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {totalLikes}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">إعجابات المنشورات</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">
                  {commentLikes}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">إعجابات التعليقات</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                النشاط الأخير
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {/* Recent posts */}
                  {userPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">نشر منشور جديد</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.created_time).toLocaleDateString("ar-EG")}
                        </p>
                        {post.message && (
                          <p className="text-xs mt-1 text-gray-600 line-clamp-2">
                            {post.message.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Recent comments */}
                  {userComments.slice(0, 3).map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-green-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">كتب تعليق</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.created_time).toLocaleDateString("ar-EG")}
                        </p>
                        {comment.message && (
                          <p className="text-xs mt-1 text-gray-600 line-clamp-2">
                            {comment.message.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>منشورات {userInfo?.name || userName}</CardTitle>
              <CardDescription>
                إجمالي المنشورات: {userPosts.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {userPosts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    لا توجد منشورات متاحة
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userPosts.map((post) => (
                      <Card key={post.id} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm text-muted-foreground">
                                {new Date(post.created_time).toLocaleDateString("ar-EG", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(post.id)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {post.message && (
                            <p className="text-sm mb-4 whitespace-pre-wrap">{post.message}</p>
                          )}

                          {post.full_picture && (
                            <div className="mb-4">
                              <img 
                                src={post.full_picture} 
                                alt="صورة المنشور"
                                className="rounded-lg max-w-full h-auto"
                                loading="lazy"
                              />
                            </div>
                          )}

                          {/* Post Stats */}
                          <div className="flex items-center space-x-6 space-x-reverse text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Heart className="w-4 h-4" />
                              <span>{post.reactions?.summary?.total_count || post.likes?.summary?.total_count || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <MessageSquare className="w-4 h-4" />
                              <span>{post.comments?.data?.length || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Share2 className="w-4 h-4" />
                              <span>{post.shares?.count || 0}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>تعليقات المستخدم</CardTitle>
              <CardDescription>
                إجمالي التعليقات: {userComments.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {userComments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    لا توجد تعليقات متاحة
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userComments.map((comment) => (
                      <Card key={comment.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {new Date(comment.created_time).toLocaleDateString("ar-EG")}
                            </span>
                            <div className="flex items-center gap-2">
                              {comment.like_count && comment.like_count > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  <Heart className="w-3 h-3 mr-1" />
                                  {comment.like_count}
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(comment.message || "")}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          {comment.message && (
                            <p className="text-sm">{comment.message}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات التفاعل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">متوسط الإعجابات للمنشور</span>
                    <Badge variant="outline">
                      {userPosts.length > 0 ? Math.round(totalLikes / userPosts.length) : 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">متوسط المشاركات للمنشور</span>
                    <Badge variant="outline">
                      {userPosts.length > 0 ? Math.round(totalShares / userPosts.length) : 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">متوسط الإعجابات للتعليق</span>
                    <Badge variant="outline">
                      {userComments.length > 0 ? Math.round(commentLikes / userComments.length) : 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>نشاط المستخدم</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">نسبة المنشورات إلى التعليقات</span>
                    <Badge variant="outline">
                      {userComments.length > 0 ? `1:${Math.round(userComments.length / Math.max(userPosts.length, 1))}` : "N/A"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">إجمالي المحتوى</span>
                    <Badge variant="outline">
                      {userPosts.length + userComments.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">مستوى النشاط</span>
                    <Badge variant={userPosts.length + userComments.length > 10 ? "default" : "secondary"}>
                      {userPosts.length + userComments.length > 20 ? "عالي" : 
                       userPosts.length + userComments.length > 10 ? "متوسط" : "منخفض"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// تصدير مع الاسم الجديد للتوافق
export { UserDataViewer as UserPostsViewer }
