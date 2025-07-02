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
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import type { FacebookPost } from "@/lib/facebook-api-service"
import { phoneSearchService } from "@/lib/phone-search-service"
import { UserAnalyticsViewer } from "./user-analytics-viewer"

interface EnhancedPostsListProps {
  posts: Array<FacebookPost & { source_id: string; source_name: string; source_type: string }>
  loading: boolean
  loadingOlder: boolean
  hasMorePosts: boolean
  onLoadOlderPosts: () => void
  darkMode: boolean
  language: "ar" | "en"
}

interface EnhancedUserRecord {
  id: string
  name: string
  phone?: string
  email?: string
  picture?: string
  birthday?: string
  hometown?: string
  location?: string
  about?: string
  relationship_status?: string
  religion?: string
  political?: string
  website?: string
  work?: {
    employer: string
    position: string
    start_date?: string
    end_date?: string
  }[]
  education?: {
    school: string
    type: string
    year?: string
  }[]
  friends_count?: number
  posts_count?: number
  photos_count?: number
  videos_count?: number
  source: string
  source_type: string
  discovered_date: Date
  last_updated: Date
  is_active: boolean
  tags: string[]
  category: string
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
  const [showUserAnalytics, setShowUserAnalytics] = useState(false)

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

        // حفظ البيانات المحسنة في Firebase
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

  // إضافة دالة لحفظ البيانات المحسنة
  const saveEnhancedUserData = async (userId: string, userName: string, phone?: string) => {
    try {
      console.log("Saving enhanced user data for:", userId, userName, phone)
      // سيتم تنفيذ هذه الوظيفة لاحقاً عند الحاجة
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

  const handleViewPost = (post: any) => {
    setSelectedPost(post)
  }

  const handleUserClick = (userId: string) => {
    if (userId) {
      setSelectedUserId(userId)
      setShowUserAnalytics(true)
    }
  }

  const handleUserAnalytics = (userId: string) => {
    if (userId) {
      setSelectedUserId(userId)
      setShowUserAnalytics(true)
    }
  }

  const handleCloseUserAnalytics = () => {
    setShowUserAnalytics(false)
    setSelectedUserId(null)
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
        <CardContent className="p-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">{text.noPosts}</h3>
          <p className="text-gray-500">{text.tryLoading}</p>
        </CardContent>
      </Card>
    )
  }

  if (showUserAnalytics && selectedUserId) {
    return (
      <UserAnalyticsViewer
        userId={selectedUserId}
        posts={posts}
        darkMode={darkMode}
        language={language}
        onClose={handleCloseUserAnalytics}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* شريط البحث والتصفية */}
      <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={text.searchPosts}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
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
              className="flex items-center gap-2"
            >
              {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              {sortOrder === "asc" ? "تصاعدي" : "تنازلي"}
            </Button>

            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger>
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

          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <span>
              عرض {filteredAndSortedPosts.length} من {posts.length} منشور
            </span>
            {searchTerm && (
              <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")} className="text-xs">
                مسح البحث
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* قائمة المنشورات */}
      <div
        ref={scrollContainerRef}
        className="space-y-6 max-h-screen overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 400px)" }}
      >
        {filteredAndSortedPosts.map((post) => {
          return (
            <Card className="w-full mx-2 sm:mx-0">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                  {/* Post content here */}
                </div>
              </CardHeader>
            </Card>
          )
        })}

        {/* Load More Button / Infinite Scroll Indicator */}
        {hasMorePosts && (
          <div className="flex flex-col items-center gap-4 py-8">
            {loadingOlder ? (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">{text.loadingOlder}</span>
              </div>
            ) : (
              <div className="text-center">
                <Button
                  onClick={onLoadOlderPosts}
                  variant="outline"
                  className="mb-2 bg-white/50 backdrop-blur-sm hover:bg-white/70"
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
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-gray-500 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">{text.noMorePosts}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}