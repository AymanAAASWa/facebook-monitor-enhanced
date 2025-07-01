"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  Calendar,
  User,
  MapPin,
  Phone,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  CheckCircle,
  Copy,
  Download,
  RefreshCw,
  Video,
  FileText,
  Link,
  Users,
  TrendingUp,
  Bookmark,
  MoreHorizontal,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { FacebookPost } from "@/lib/facebook-service"

interface EnhancedPostsListProps {
  posts: FacebookPost[]
  loading: boolean
  loadingOlder: boolean
  hasMorePosts: boolean
  onLoadOlderPosts: () => void
  darkMode: boolean
  language: "ar" | "en"
  accessToken: string
}

interface PostComment {
  id: string
  message: string
  created_time: string
  from: {
    id: string
    name: string
    picture?: {
      data: {
        url: string
      }
    }
  }
  like_count?: number
  comment_count?: number
  replies?: PostComment[]
}

export function EnhancedPostsList({
  posts,
  loading,
  loadingOlder,
  hasMorePosts,
  onLoadOlderPosts,
  darkMode,
  language,
  accessToken,
}: EnhancedPostsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "likes" | "comments" | "shares">("date")
  const [filterBy, setFilterBy] = useState<"all" | "text" | "photo" | "video" | "link">("all")
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set())
  const [showPhoneNumbers, setShowPhoneNumbers] = useState(true)
  const [postComments, setPostComments] = useState<{ [postId: string]: PostComment[] }>({})
  const [loadingComments, setLoadingComments] = useState<Set<string>>(new Set())
  const [commentsExpanded, setCommentsExpanded] = useState<Set<string>>(new Set())
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  const t = {
    ar: {
      searchPlaceholder: "البحث في المنشورات...",
      sortBy: "ترتيب حسب",
      filterBy: "تصفية حسب",
      date: "التاريخ",
      likes: "الإعجابات",
      comments: "التعليقات",
      shares: "المشاركات",
      all: "الكل",
      text: "نص",
      photo: "صورة",
      video: "فيديو",
      link: "رابط",
      showMore: "عرض المزيد",
      showLess: "عرض أقل",
      loadOlderPosts: "تحميل منشورات أقدم",
      noPostsFound: "لم يتم العثور على منشورات",
      phoneNumbersFound: "أرقام هواتف مكتشفة",
      showPhoneNumbers: "إظهار أرقام الهواتف",
      loadComments: "تحميل التعليقات",
      hideComments: "إخفاء التعليقات",
      loadingComments: "جاري تحميل التعليقات...",
      noComments: "لا توجد تعليقات",
      reply: "رد",
      like: "إعجاب",
      copyText: "نسخ النص",
      copyLink: "نسخ الرابط",
      openPost: "فتح المنشور",
      selectPost: "تحديد المنشور",
      selectedPosts: "المنشورات المحددة",
      exportSelected: "تصدير المحدد",
      viewMode: "وضع العرض",
      gridView: "شبكة",
      listView: "قائمة",
      postType: "نوع المنشور",
      engagement: "التفاعل",
      author: "الكاتب",
      source: "المصدر",
      createdAt: "تاريخ الإنشاء",
      totalPosts: "إجمالي المنشورات",
      filteredPosts: "المنشورات المفلترة",
      averageEngagement: "متوسط التفاعل",
      topPost: "أفضل منشور",
      recentPost: "أحدث منشور",
      bookmark: "حفظ",
      flag: "إبلاغ",
      moreOptions: "خيارات أكثر",
    },
    en: {
      searchPlaceholder: "Search posts...",
      sortBy: "Sort by",
      filterBy: "Filter by",
      date: "Date",
      likes: "Likes",
      comments: "Comments",
      shares: "Shares",
      all: "All",
      text: "Text",
      photo: "Photo",
      video: "Video",
      link: "Link",
      showMore: "Show More",
      showLess: "Show Less",
      loadOlderPosts: "Load Older Posts",
      noPostsFound: "No posts found",
      phoneNumbersFound: "Phone numbers found",
      showPhoneNumbers: "Show phone numbers",
      loadComments: "Load Comments",
      hideComments: "Hide Comments",
      loadingComments: "Loading comments...",
      noComments: "No comments",
      reply: "Reply",
      like: "Like",
      copyText: "Copy Text",
      copyLink: "Copy Link",
      openPost: "Open Post",
      selectPost: "Select Post",
      selectedPosts: "Selected Posts",
      exportSelected: "Export Selected",
      viewMode: "View Mode",
      gridView: "Grid",
      listView: "List",
      postType: "Post Type",
      engagement: "Engagement",
      author: "Author",
      source: "Source",
      createdAt: "Created At",
      totalPosts: "Total Posts",
      filteredPosts: "Filtered Posts",
      averageEngagement: "Average Engagement",
      topPost: "Top Post",
      recentPost: "Recent Post",
      bookmark: "Bookmark",
      flag: "Flag",
      moreOptions: "More Options",
    },
  }

  const text = t[language]

  // تصفية وترتيب المنشورات
  const filteredAndSortedPosts = posts
    .filter((post) => {
      // تصفية حسب النص
      const matchesSearch =
        !searchTerm ||
        post.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.from?.name?.toLowerCase().includes(searchTerm.toLowerCase())

      // تصفية حسب النوع
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "text" && post.message && !post.picture && !post.source) ||
        (filterBy === "photo" && post.picture) ||
        (filterBy === "video" && post.source && post.source.includes("video")) ||
        (filterBy === "link" && post.link)

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.created_time).getTime() - new Date(a.created_time).getTime()
        case "likes":
          return (b.likes?.summary?.total_count || 0) - (a.likes?.summary?.total_count || 0)
        case "comments":
          return (b.comments?.summary?.total_count || 0) - (a.comments?.summary?.total_count || 0)
        case "shares":
          return (b.shares?.count || 0) - (a.shares?.count || 0)
        default:
          return 0
      }
    })

  // استخراج أرقام الهواتف من النص - تم إصلاح التعبير النمطي
  const extractPhoneNumbers = (text: string): string[] => {
    if (!text) return []
    // تعبير نمطي محسن لاستخراج أرقام الهواتف
    const phoneRegex = /(\+?[0-9]{1,4}[-.\s]?)?($$?[0-9]{1,4}$$?[-.\s]?)?[0-9]{3,4}[-.\s]?[0-9]{3,4}/g
    return text.match(phoneRegex) || []
  }

  // تحميل التعليقات
  const loadPostComments = async (postId: string) => {
    if (!accessToken) return

    setLoadingComments((prev) => new Set([...prev, postId]))

    try {
      const response = await fetch("/api/facebook/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          accessToken,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()
      if (!text) {
        throw new Error("Empty response")
      }

      let result
      try {
        result = JSON.parse(text)
      } catch (parseError) {
        console.error("Failed to parse JSON:", text)
        throw new Error("Invalid JSON response")
      }

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.data) {
        setPostComments((prev) => ({
          ...prev,
          [postId]: result.data,
        }))
      }
    } catch (error: any) {
      console.error("Error loading comments:", error)
      setPostComments((prev) => ({
        ...prev,
        [postId]: [],
      }))
    } finally {
      setLoadingComments((prev) => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
    }
  }

  // تبديل عرض التعليقات
  const handleToggleComments = async (postId: string) => {
    if (commentsExpanded.has(postId)) {
      setCommentsExpanded((prev) => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
    } else {
      setCommentsExpanded((prev) => new Set([...prev, postId]))
      if (!postComments[postId]) {
        await loadPostComments(postId)
      }
    }
  }

  // تبديل توسيع المنشور
  const togglePostExpansion = (postId: string) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  // تحديد/إلغاء تحديد منشور
  const togglePostSelection = (postId: string) => {
    setSelectedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  // نسخ النص
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // تصدير المنشورات المحددة
  const exportSelectedPosts = () => {
    const selectedPostsData = posts.filter((post) => selectedPosts.has(post.id))
    const dataStr = JSON.stringify(selectedPostsData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `selected-posts-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // حساب الإحصائيات
  const totalEngagement = filteredAndSortedPosts.reduce(
    (sum, post) =>
      sum +
      (post.likes?.summary?.total_count || 0) +
      (post.comments?.summary?.total_count || 0) +
      (post.shares?.count || 0),
    0,
  )
  const averageEngagement = filteredAndSortedPosts.length > 0 ? totalEngagement / filteredAndSortedPosts.length : 0

  const topPost = filteredAndSortedPosts.reduce((top, post) => {
    if (!top) return post
    const postEngagement =
      (post.likes?.summary?.total_count || 0) + (post.comments?.summary?.total_count || 0) + (post.shares?.count || 0)
    const topEngagement =
      (top.likes?.summary?.total_count || 0) + (top.comments?.summary?.total_count || 0) + (top.shares?.count || 0)
    return postEngagement > topEngagement ? post : top
  }, filteredAndSortedPosts[0])

  if (loading && posts.length === 0) {
    return (
      <Card className={`${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"} backdrop-blur-sm`}>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
          <p className="text-lg font-semibold">جاري تحميل المنشورات...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* شريط التحكم */}
      <Card className={`${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"} backdrop-blur-sm`}>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
              {/* البحث */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={text.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* الترتيب والتصفية */}
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">{text.date}</SelectItem>
                    <SelectItem value="likes">{text.likes}</SelectItem>
                    <SelectItem value="comments">{text.comments}</SelectItem>
                    <SelectItem value="shares">{text.shares}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{text.all}</SelectItem>
                    <SelectItem value="text">{text.text}</SelectItem>
                    <SelectItem value="photo">{text.photo}</SelectItem>
                    <SelectItem value="video">{text.video}</SelectItem>
                    <SelectItem value="link">{text.link}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* خيارات العرض */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="show-phones" className="text-sm">
                  {text.showPhoneNumbers}
                </Label>
                <Switch id="show-phones" checked={showPhoneNumbers} onCheckedChange={setShowPhoneNumbers} />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <FileText className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Users className="w-4 h-4" />
                </Button>
              </div>

              {selectedPosts.size > 0 && (
                <Button onClick={exportSelectedPosts} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  {text.exportSelected} ({selectedPosts.size})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* الإحصائيات */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className={`${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"} backdrop-blur-sm`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
            <div className="text-sm text-gray-500">{text.totalPosts}</div>
          </CardContent>
        </Card>
        <Card className={`${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"} backdrop-blur-sm`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{filteredAndSortedPosts.length}</div>
            <div className="text-sm text-gray-500">{text.filteredPosts}</div>
          </CardContent>
        </Card>
        <Card className={`${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"} backdrop-blur-sm`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{Math.round(averageEngagement)}</div>
            <div className="text-sm text-gray-500">{text.averageEngagement}</div>
          </CardContent>
        </Card>
        <Card className={`${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"} backdrop-blur-sm`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{selectedPosts.size}</div>
            <div className="text-sm text-gray-500">{text.selectedPosts}</div>
          </CardContent>
        </Card>
        <Card className={`${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"} backdrop-blur-sm`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {posts.reduce((sum, post) => sum + extractPhoneNumbers(post.message || "").length, 0)}
            </div>
            <div className="text-sm text-gray-500">{text.phoneNumbersFound}</div>
          </CardContent>
        </Card>
      </div>

      {/* قائمة المنشورات */}
      {filteredAndSortedPosts.length === 0 ? (
        <Card className={`${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"} backdrop-blur-sm`}>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">{text.noPostsFound}</h3>
            <p className="text-gray-500">جرب تغيير معايير البحث أو التصفية</p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-6"}>
          {filteredAndSortedPosts.map((post) => {
            const isExpanded = expandedPosts.has(post.id)
            const isSelected = selectedPosts.has(post.id)
            const phoneNumbers = showPhoneNumbers ? extractPhoneNumbers(post.message || "") : []
            const commentsVisible = commentsExpanded.has(post.id)
            const comments = postComments[post.id] || []
            const isLoadingComments = loadingComments.has(post.id)

            const engagement =
              (post.likes?.summary?.total_count || 0) +
              (post.comments?.summary?.total_count || 0) +
              (post.shares?.count || 0)

            return (
              <Card
                key={post.id}
                className={`${
                  darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50"
                } backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${
                  isSelected ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={post.from?.picture?.data?.url || "/placeholder.svg?height=48&width=48&query=user+avatar"}
                          alt={post.from?.name}
                        />
                        <AvatarFallback>
                          <User className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{post.from?.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(post.created_time).toLocaleString(language === "ar" ? "ar-EG" : "en-US")}
                          </span>
                          {post.place && (
                            <>
                              <MapPin className="w-4 h-4 ml-2" />
                              <span className="truncate">{post.place.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePostSelection(post.id)}
                        className={isSelected ? "bg-blue-100 text-blue-600" : ""}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* محتوى المنشور */}
                  <div className="space-y-3">
                    {post.message && (
                      <div className="space-y-2">
                        <p
                          className={`text-gray-800 dark:text-gray-200 leading-relaxed ${
                            !isExpanded && post.message.length > 200 ? "line-clamp-3" : ""
                          }`}
                        >
                          {post.message}
                        </p>
                        {post.message.length > 200 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePostExpansion(post.id)}
                            className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                {text.showLess}
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                {text.showMore}
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )}

                    {/* أرقام الهواتف */}
                    {phoneNumbers.length > 0 && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            {text.phoneNumbersFound}: {phoneNumbers.length}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {phoneNumbers.map((phone, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-yellow-100 border-yellow-300 text-yellow-800 cursor-pointer hover:bg-yellow-200"
                              onClick={() => copyToClipboard(phone)}
                            >
                              {phone}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* الوسائط */}
                    {post.picture && (
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={post.picture || "/placeholder.svg"}
                          alt="Post image"
                          className="w-full h-auto max-h-96 object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {post.source && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Video className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">فيديو</span>
                        </div>
                        <video controls className="w-full rounded">
                          <source src={post.source} type="video/mp4" />
                          متصفحك لا يدعم تشغيل الفيديو
                        </video>
                      </div>
                    )}

                    {post.link && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Link className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">رابط مرفق</span>
                        </div>
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm break-all"
                        >
                          {post.link}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* إحصائيات التفاعل */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{post.likes?.summary?.total_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{post.comments?.summary?.total_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm">{post.shares?.count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">{engagement}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(post.message || "")}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`https://facebook.com/${post.id}`, "_blank")}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* أزرار التفاعل */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="flex-1 justify-center">
                      <Heart className="w-4 h-4 mr-2" />
                      {text.like}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 justify-center"
                      onClick={() => handleToggleComments(post.id)}
                      disabled={isLoadingComments}
                    >
                      {isLoadingComments ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <MessageCircle className="w-4 h-4 mr-2" />
                      )}
                      {commentsVisible ? text.hideComments : text.loadComments}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 justify-center">
                      <Share2 className="w-4 h-4 mr-2" />
                      مشاركة
                    </Button>
                  </div>

                  {/* التعليقات */}
                  {commentsVisible && (
                    <div className="space-y-3 pt-3 border-t">
                      {isLoadingComments ? (
                        <div className="text-center py-4">
                          <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin text-blue-500" />
                          <p className="text-sm text-gray-500">{text.loadingComments}</p>
                        </div>
                      ) : comments.length === 0 ? (
                        <div className="text-center py-4">
                          <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">{text.noComments}</p>
                        </div>
                      ) : (
                        <ScrollArea className="max-h-96">
                          <div className="space-y-3">
                            {comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage
                                    src={
                                      comment.from.picture?.data?.url ||
                                      "/placeholder.svg?height=32&width=32&query=user+avatar" ||
                                      "/placeholder.svg"
                                    }
                                    alt={comment.from.name}
                                  />
                                  <AvatarFallback>
                                    <User className="w-4 h-4" />
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{comment.from.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(comment.created_time).toLocaleString(
                                        language === "ar" ? "ar-EG" : "en-US",
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{comment.message}</p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                                      <Heart className="w-3 h-3 mr-1" />
                                      {comment.like_count || 0}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                                      {text.reply}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* زر تحميل المزيد */}
      {hasMorePosts && (
        <div className="text-center">
          <Button
            onClick={onLoadOlderPosts}
            disabled={loadingOlder}
            variant="outline"
            className="bg-white/50 backdrop-blur-sm"
          >
            {loadingOlder ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري التحميل...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                {text.loadOlderPosts}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
