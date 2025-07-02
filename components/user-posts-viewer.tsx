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
  Download
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

interface UserPostsViewerProps {
  userId: string
  userName: string
  onClose?: () => void
}

export function UserPostsViewer({ userId, userName, onClose }: UserPostsViewerProps) {
  const [userPosts, setUserPosts] = useState<UserPost[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("posts")

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
        setError(postsResult.error)
      }

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

  if (loading) {
    return (
      <Card>
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
      <Card>
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
    <div className="space-y-4">
      {/* معلومات المستخدم */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Avatar className="w-16 h-16">
                <AvatarImage 
                  src={userInfo?.picture?.data?.url} 
                  alt={userInfo?.name || userName} 
                />
                <AvatarFallback>
                  {(userInfo?.name || userName).charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{userInfo?.name || userName}</CardTitle>
                <CardDescription>معرف المستخدم: {userId}</CardDescription>
                {userInfo?.about && (
                  <p className="text-sm text-muted-foreground mt-2">{userInfo.about}</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openInFacebook(`https://facebook.com/${userId}`)}
              >
                <ExternalLink className="w-4 h-4 ml-2" />
                فتح في فيسبوك
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={downloadUserData}
              >
                <Download className="w-4 h-4 ml-2" />
                تنزيل البيانات
              </Button>
              {onClose && (
                <Button variant="outline" size="sm" onClick={onClose}>
                  إغلاق
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {userInfo && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* علامات التبويب */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">
            <FileText className="w-4 h-4 ml-2" />
            المنشورات ({userPosts.length})
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="w-4 h-4 ml-2" />
            التعليقات
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Heart className="w-4 h-4 ml-2" />
            التحليلات
          </TabsTrigger>
        </TabsList>

        {/* منشورات المستخدم */}
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>منشورات {userInfo?.name || userName}</CardTitle>
              <CardDescription>
                إجمالي المنشورات: {userPosts.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
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

                          {/* إحصائيات المنشور */}
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

                          {/* التعليقات */}
                          {post.comments && post.comments.data.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <h4 className="text-sm font-medium mb-2">التعليقات:</h4>
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {post.comments.data.slice(0, 3).map((comment) => (
                                  <div key={comment.id} className="bg-muted p-2 rounded text-xs">
                                    <div className="font-medium">{comment.from.name}</div>
                                    {comment.message && (
                                      <div className="mt-1">{comment.message}</div>
                                    )}
                                  </div>
                                ))}
                                {post.comments.data.length > 3 && (
                                  <div className="text-xs text-muted-foreground">
                                    ... و {post.comments.data.length - 3} تعليقات أخرى
                                  </div>
                                )}
                              </div>
                            </div>
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

        {/* تعليقات المستخدم */}
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>تعليقات المستخدم</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {(() => {
                  const allComments = userPosts
                    .flatMap(post => post.comments?.data || [])
                    .filter(comment => comment.from.id === userId)

                  return allComments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      لا توجد تعليقات متاحة
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {allComments.map((comment) => (
                        <Card key={comment.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">
                                {new Date(comment.created_time).toLocaleDateString("ar-EG")}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(comment.message || "")}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            {comment.message && (
                              <p className="text-sm">{comment.message}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )
                })()}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تحليلات المستخدم */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>تحليلات النشاط</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {userPosts.length}
                    </div>
                    <div className="text-sm text-muted-foreground">إجمالي المنشورات</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {userPosts.reduce((sum, post) => 
                        sum + (post.comments?.data?.filter(c => c.from.id === userId).length || 0), 0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">إجمالي التعليقات</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {userPosts.reduce((sum, post) => 
                        sum + (post.reactions?.summary?.total_count || post.likes?.summary?.total_count || 0), 0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">إجمالي الإعجابات</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}