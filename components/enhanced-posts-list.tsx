
"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  FileText,
  ChevronDown,
  CheckCircle,
  Loader2,
  Search,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  Phone,
  User,
  ExternalLink,
  Copy,
  MessageCircle,
  Star,
  ImageIcon,
  Video,
  DownloadIcon,
  Heart,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import type { FacebookPost } from "@/lib/facebook-api-service"
import { phoneSearchService } from "@/lib/phone-search-service"
import { UserAnalyticsViewer } from "./user-analytics-viewer"
import { UserPostsViewer } from "./user-posts-viewer"

interface EnhancedPostsListProps {
  posts: Array<FacebookPost & { source_id: string; source_name: string; source_type: string }>
  loading: boolean
  loadingOlder: boolean
  hasMorePosts: boolean
  onLoadOlderPosts: () => void
  darkMode: boolean
  language: "ar" | "en"
}

export function EnhancedPostsList({
  posts = [],
  loading = false,
  loadingOlder = false,
  hasMorePosts = false,
  onLoadOlderPosts,
  darkMode = false,
  language = "ar",
}: EnhancedPostsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "comments" | "engagement">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterSource, setFilterSource] = useState<string>("all")
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [searchingPhones, setSearchingPhones] = useState<Set<string>>(new Set())
  const [phoneSearchResults, setPhoneSearchResults] = useState<{ [key: string]: string }>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUserName, setSelectedUserName] = useState<string>("")
  const [showUserAnalytics, setShowUserAnalytics] = useState(false)
  const [showUserPosts, setShowUserPosts] = useState(false)

  const t = {
    ar: {
      noPosts: "لا توجد منشورات للعرض",
      tryLoading: "جرب تحميل المنشورات أو تغيير كلمة البحث",
      loadOlderPosts: "تحميل منشورات أقدم",
      loadingOlder: "جاري تحميل المنشورات الأقدم...",
      scrollToLoadMore: "مرر لأسفل لتحميل المزيد",
      noMorePosts: "لا توجد منشورات أقدم",
      searchPosts: "البحث في المنشورات...",
      sortBy: "ترتيب حسب",
      filterBy: "تصفية حسب",
      allSources: "جميع المصادر",
      date: "التاريخ",
      comments: "التعليقات",
      engagement: "التفاعل",
      showComments: "عرض التعليقات",
      hideComments: "إخفاء التعليقات",
      noComments: "لا توجد تعليقات",
      searchPhone: "البحث عن رقم",
      phoneFound: "تم العثور على الرقم",
      phoneNotFound: "لم يتم العثور على رقم",
      phoneSearching: "جاري البحث...",
      copyPhone: "نسخ الرقم",
      viewProfile: "عرض الملف الشخصي",
      viewPosts: "عرض المنشورات",
      viewAnalytics: "عرض التحليلات",
      openPost: "فتح المنشور",
      unknown: "غير معروف",
      group: "جروب",
      page: "صفحة",
      downloadImage: "تحميل الصورة",
      downloadVideo: "تحميل الفيديو",
    },
    en: {
      noPosts: "No posts to display",
      tryLoading: "Try loading posts or change search term",
      loadOlderPosts: "Load Older Posts",
      loadingOlder: "Loading older posts...",
      scrollToLoadMore: "Scroll down to load more",
      noMorePosts: "No more older posts",
      searchPosts: "Search posts...",
      sortBy: "Sort by",
      filterBy: "Filter by",
      allSources: "All Sources",
      date: "Date",
      comments: "Comments",
      engagement: "Engagement",
      showComments: "Show Comments",
      hideComments: "Hide Comments",
      noComments: "No comments",
      searchPhone: "Search Phone",
      phoneFound: "Phone Found",
      phoneNotFound: "Phone Not Found",
      phoneSearching: "Searching...",
      copyPhone: "Copy Phone",
      viewProfile: "View Profile",
      viewPosts: "View Posts",
      viewAnalytics: "View Analytics",
      openPost: "Open Post",
      unknown: "Unknown",
      group: "Group",
      page: "Page",
      downloadImage: "Download Image",
      downloadVideo: "Download Video",
    },
  }

  const text = t[language]

  // تحميل نتائج البحث المحفوظة
  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem("phone_search_results") || "{}")
    setPhoneSearchResults(savedResults)
  }, [])

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !posts || posts.length === 0) return

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const isNear = scrollTop + clientHeight >= scrollHeight - 1000

    if (isNear && hasMorePosts && !loadingOlder && posts.length > 0) {
      onLoadOlderPosts()
    }
  }, [hasMorePosts, loadingOlder, posts, onLoadOlderPosts])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  const handlePhoneSearch = async (userId: string, userName: string) => {
    if (!phoneSearchService.isReady()) {
      alert("قاعدة بيانات الأرقام غير محملة. يرجى تحميل ملف الأرقام أولاً.")
      return
    }

    setSearchingPhones((prev) => new Set(prev).add(userId))
    setPhoneSearchResults((prev) => ({ ...prev, [userId]: text.phoneSearching }))

    try {
      const result = await phoneSearchService.searchPhone(userId)

      if (result.found && result.phone) {
        setPhoneSearchResults((prev) => ({ ...prev, [userId]: result.phone! }))
        await saveEnhancedUserData(userId, userName, result.phone)
      } else {
        setPhoneSearchResults((prev) => ({ ...prev, [userId]: text.phoneNotFound }))
      }
    } catch (error) {
      setPhoneSearchResults((prev) => ({ ...prev, [userId]: "خطأ في البحث" }))
    } finally {
      setSearchingPhones((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const saveEnhancedUserData = async (userId: string, userName: string, phone?: string) => {
    try {
      console.log("Saving enhanced user data for:", userId, userName, phone)
    } catch (error) {
      console.error("Error saving enhanced user data:", error)
    }
  }

  const handleToggleComments = (postId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadMedia = (url: string, filename: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const buildPostUrl = (post: any): string => {
    if (post.source_type === "group") {
      return `https://www.facebook.com/groups/${post.source_id}/posts/${post.id.split("_")[1]}/`
    } else {
      return `https://www.facebook.com/${post.source_id}/posts/${post.id.split("_")[1]}/`
    }
  }

  const buildUserUrl = (userId: string): string => {
    return `https://www.facebook.com/${userId}`
  }

  const calculatePostScore = (post: any): number => {
    let score = 0
    const message = post.message || ""
    score += message.length > 100 ? 5 : 2
    score += (post.comments?.data?.length || 0) * 2
    if (post.full_picture || post.attachments?.data?.length) score += 5
    return score
  }

  const getPostMedia = (post: any) => {
    const media: Array<{ type: string; url: string; id: string }> = []

    if (post.full_picture) {
      media.push({
        type: "image",
        url: post.full_picture,
        id: `${post.id}_full_picture`,
      })
    }

    if (post.attachments?.data) {
      post.attachments.data.forEach((attachment: any, index: number) => {
        if (attachment.type === "photo" && attachment.media?.image?.src) {
          media.push({
            type: "image",
            url: attachment.media.image.src,
            id: `${post.id}_attachment_${index}`,
          })
        } else if (attachment.type === "video_inline" && attachment.media?.source) {
          media.push({
            type: "video",
            url: attachment.media.source,
            id: `${post.id}_video_${index}`,
          })
        }

        if (attachment.subattachments?.data) {
          attachment.subattachments.data.forEach((subAttachment: any, subIndex: number) => {
            if (subAttachment.type === "photo" && subAttachment.media?.image?.src) {
              media.push({
                type: "image",
                url: subAttachment.media.image.src,
                id: `${post.id}_sub_${index}_${subIndex}`,
              })
            } else if (subAttachment.type === "video_inline" && subAttachment.media?.source) {
              media.push({
                type: "video",
                url: subAttachment.media.source,
                id: `${post.id}_sub_video_${index}_${subIndex}`,
              })
            }
          })
        }
      })
    }

    return media
  }

  // فتح عارض منشورات المستخدم
  const handleViewUserPosts = (userId: string, userName: string) => {
    if (userId) {
      setSelectedUserId(userId)
      setSelectedUserName(userName)
      setShowUserPosts(true)
      setShowUserAnalytics(false)
    }
  }

  // فتح عارض تحليلات المستخدم
  const handleViewUserAnalytics = (userId: string, userName: string) => {
    if (userId) {
      setSelectedUserId(userId)
      setSelectedUserName(userName)
      setShowUserAnalytics(true)
      setShowUserPosts(false)
    }
  }

  const handleCloseUserViews = () => {
    setShowUserAnalytics(false)
    setShowUserPosts(false)
    setSelectedUserId(null)
    setSelectedUserName("")
  }

  // تصفية وترتيب المنشورات
  const filteredAndSortedPosts = posts
    .filter((post) => {
      const matchesSearch =
        !searchTerm ||
        post.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.from?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.source_name?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSource = filterSource === "all" || post.source_name === filterSource

      return matchesSearch && matchesSource
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.created_time).getTime() - new Date(b.created_time).getTime()
          break
        case "comments":
          comparison = (a.comments?.data?.length || 0) - (b.comments?.data?.length || 0)
          break
        case "engagement":
          comparison = calculatePostScore(a) - calculatePostScore(b)
          break
      }

      return sortOrder === "desc" ? -comparison : comparison
    })

  // الحصول على قائمة المصادر الفريدة
  const uniqueSources = Array.from(new Set(posts.map((post) => post.source_name)))

  if (!posts || (posts.length === 0 && !loading)) {
    return (
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardContent className="p-4 sm:p-8 text-center">
          <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">{text.noPosts}</h3>
          <p className="text-gray-500 text-sm sm:text-base">{text.tryLoading}</p>
        </CardContent>
      </Card>
    )
  }

  // عرض عارض منشورات المستخدم
  if (showUserPosts && selectedUserId) {
    return (
      <UserPostsViewer
        userId={selectedUserId}
        userName={selectedUserName}
        onClose={handleCloseUserViews}
      />
    )
  }

  // عرض عارض تحليلات المستخدم
  if (showUserAnalytics && selectedUserId) {
    return (
      <UserAnalyticsViewer
        userId={selectedUserId}
        posts={posts}
        darkMode={darkMode}
        language={language}
        onClose={handleCloseUserViews}
      />
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* شريط البحث والتصفية - محسن للموبايل */}
      <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
        <CardContent className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={text.searchPosts}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder={text.sortBy} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">{text.date}</SelectItem>
                <SelectItem value="comments">{text.comments}</SelectItem>
                <SelectItem value="engagement">{text.engagement}</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2 text-sm"
            >
              {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              <span className="hidden sm:inline">{sortOrder === "asc" ? "تصاعدي" : "تنازلي"}</span>
            </Button>

            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder={text.filterBy} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{text.allSources}</SelectItem>
                {uniqueSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
            <span>
              عرض {filteredAndSortedPosts.length} من {posts.length} منشور
            </span>
            {searchTerm && (
              <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")} className="text-xs h-6">
                مسح البحث
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* قائمة المنشورات - محسنة للموبايل */}
      <div
        ref={scrollContainerRef}
        className="space-y-4 sm:space-y-6 max-h-screen overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        {filteredAndSortedPosts.map((post) => (
          <Card
            key={post.id}
            className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500`}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-md flex-shrink-0">
                    {post.from?.picture?.data?.url ? (
                      <Image
                        src={post.from.picture.data.url || "/placeholder.svg"}
                        alt={post.from?.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                        {post.from?.name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base truncate">{post.from?.name || text.unknown}</h3>
                      
                      {/* أزرار المستخدم - محسنة للموبايل */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(buildUserUrl(post.from?.id || ""), "_blank")}
                          className="h-5 w-5 p-0 hover:bg-blue-100"
                          title={text.viewProfile}
                        >
                          <User className="w-3 h-3" />
                        </Button>
                        
                        {post.from?.id && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePhoneSearch(post.from?.id || "", post.from?.name || "")}
                              disabled={searchingPhones.has(post.from?.id || "")}
                              className="h-5 w-5 p-0 hover:bg-green-100"
                              title={text.searchPhone}
                            >
                              {searchingPhones.has(post.from?.id || "") ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Phone className="w-3 h-3" />
                              )}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewUserPosts(post.from?.id || "", post.from?.name || "")}
                              className="h-5 w-5 p-0 hover:bg-purple-100"
                              title={text.viewPosts}
                            >
                              <FileText className="w-3 h-3" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewUserAnalytics(post.from?.id || "", post.from?.name || "")}
                              className="h-5 w-5 p-0 hover:bg-orange-100"
                              title={text.viewAnalytics}
                            >
                              <BarChart3 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-1">
                      {post.created_time
                        ? new Date(post.created_time).toLocaleString(language === "ar" ? "ar-EG" : "en-US")
                        : text.unknown}
                    </p>
                    
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
                        {post.source_type === "group" ? text.group : text.page}: {post.source_name}
                      </Badge>

                      {/* عرض نتيجة البحث عن الرقم */}
                      {post.from?.id && phoneSearchResults[post.from.id] && (
                        <Badge
                          variant="secondary"
                          className={`text-xs flex items-center gap-1 ${
                            phoneSearchResults[post.from.id] === text.phoneNotFound ||
                            phoneSearchResults[post.from.id] === "خطأ في البحث"
                              ? "bg-red-50 border-red-200 text-red-700"
                              : phoneSearchResults[post.from.id] === text.phoneSearching
                                ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                                : "bg-green-50 border-green-200 text-green-700"
                          }`}
                        >
                          <Phone className="w-3 h-3" />
                          <span className="truncate max-w-20 sm:max-w-none">{phoneSearchResults[post.from.id]}</span>
                          {phoneSearchResults[post.from.id] !== text.phoneNotFound &&
                            phoneSearchResults[post.from.id] !== "خطأ في البحث" &&
                            phoneSearchResults[post.from.id] !== text.phoneSearching && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(phoneSearchResults[post.from.id])}
                                className="h-4 w-4 p-0 hover:bg-green-200"
                              >
                                <Copy className="w-2 h-2" />
                              </Button>
                            )}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-xs">
                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                    <span className="hidden sm:inline">{calculatePostScore(post)}</span>
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(buildPostUrl(post), "_blank")}
                    className="hover:bg-blue-100 h-6 w-6 p-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {post.message && (
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs sm:text-sm">{post.message}</p>
                </div>
              )}

              {getPostMedia(post).length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                    {getPostMedia(post).map((media) => (
                      <div key={media.id} className="relative group">
                        {media.type === "image" ? (
                          <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                            <Image
                              src={media.url || "/placeholder.svg"}
                              alt="Post image"
                              fill
                              className="object-cover hover:scale-105 transition-transform cursor-pointer"
                              onClick={() => window.open(media.url, "_blank")}
                            />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => downloadMedia(media.url, `image_${media.id}.jpg`)}
                                className="bg-white/90 hover:bg-white h-6 w-6 p-0"
                              >
                                <DownloadIcon className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="absolute bottom-2 left-2">
                              <Badge variant="secondary" className="bg-white/90 text-xs">
                                <ImageIcon className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">صورة</span>
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
                            <video
                              src={media.url}
                              className="w-full h-full object-cover"
                              controls
                              poster="/placeholder.svg?height=300&width=400"
                            />
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => downloadMedia(media.url, `video_${media.id}.mp4`)}
                                className="bg-white/90 hover:bg-white h-6 w-6 p-0"
                              >
                                <DownloadIcon className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="absolute bottom-2 left-2">
                              <Badge variant="secondary" className="bg-white/90 text-xs">
                                <Video className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">فيديو</span>
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {post.comments?.data && post.comments.data.length > 0 ? (
                <div className="border-t pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleComments(post.id)}
                    className="mb-3 hover:bg-blue-50 text-sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {expandedComments.has(post.id) ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">{text.hideComments}</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">{text.showComments}</span>
                      </>
                    )}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {post.comments.data.length}
                    </Badge>
                  </Button>

                  {expandedComments.has(post.id) && (
                    <div className="space-y-2 sm:space-y-3 max-h-64 overflow-y-auto">
                      {post.comments.data.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="relative flex-shrink-0">
                            {comment.from?.picture?.data?.url ? (
                              <img
                                src={comment.from.picture.data.url}
                                alt={comment.from.name || "User"}
                                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-white shadow-sm"
                              />
                            ) : (
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                            )}
                            {comment.user_likes && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <Heart className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white fill-current" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1 gap-2">
                              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                                <button
                                  onClick={() =>
                                    handleViewUserAnalytics(comment.from?.id || "", comment.from?.name || "")
                                  }
                                  className="font-medium text-xs sm:text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer truncate"
                                >
                                  {comment.from?.name || "مستخدم"}
                                </button>
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                  {new Date(comment.created_time).toLocaleString("ar-EG")}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                                {comment.like_count > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    <span className="hidden sm:inline">{comment.like_count}</span>
                                  </span>
                                )}
                                <button
                                  onClick={() =>
                                    handleViewUserAnalytics(comment.from?.id || "", comment.from?.name || "")
                                  }
                                  className="text-blue-500 hover:text-blue-700 p-1 rounded"
                                  title="تحليلات المستخدم"
                                >
                                  <TrendingUp className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {comment.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-t pt-3">
                  <div className="text-center py-2 sm:py-3 text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1 text-gray-400" />
                    <p className="text-xs">{text.noComments}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Load More Button / Infinite Scroll Indicator */}
        {hasMorePosts && (
          <div className="flex flex-col items-center gap-4 py-6 sm:py-8">
            {loadingOlder ? (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span className="text-sm font-medium">{text.loadingOlder}</span>
              </div>
            ) : (
              <div className="text-center">
                <Button
                  onClick={onLoadOlderPosts}
                  variant="outline"
                  className="mb-2 bg-white/50 backdrop-blur-sm hover:bg-white/70 text-sm"
                >
                  <ChevronDown className="w-4 h-4 mr-2" />
                  {text.loadOlderPosts}
                </Button>
                <p className="text-xs text-gray-500">{text.scrollToLoadMore}</p>
              </div>
            )}
          </div>
        )}

        {!hasMorePosts && filteredAndSortedPosts.length > 0 && (
          <div className="text-center py-6 sm:py-8">
            <div className="inline-flex items-center gap-2 text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 sm:px-4 py-2 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">{text.noMorePosts}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
