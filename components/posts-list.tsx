import type { FacebookPost } from "@/lib/facebook-api-service"
```

Here is the complete modified code:

```typescript
"use client"

import { useCallback, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ChevronDown, CheckCircle, Loader2 } from "lucide-react"
import { PostCard } from "./post-card"
import type { Post } from "@/types"

interface PostsListProps {
  posts: Post[]
  loading: boolean
  loadingOlder: boolean
  hasMorePosts: boolean
  searchingPhones: Set<string>
  phoneSearchResults: { [key: string]: string }
  expandedComments: Set<string>
  onLoadOlderPosts: () => void
  onToggleComments: (postId: string) => void
  onPhoneSearch: (userId: string, userName: string, source: string) => void
  darkMode: boolean
  language: "ar" | "en"
}

export function PostsList({
  posts = [],
  loading = false,
  loadingOlder = false,
  hasMorePosts = false,
  searchingPhones = new Set(),
  phoneSearchResults = {},
  expandedComments = new Set(),
  onLoadOlderPosts,
  onToggleComments,
  onPhoneSearch,
  darkMode = false,
  language = "ar",
}: PostsListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  const t = {
    ar: {
      noPosts: "لا توجد منشورات للعرض",
      tryLoading: "جرب تحميل المنشورات أو تغيير كلمة البحث",
      loadOlderPosts: "تحميل منشورات أقدم",
      loadingOlder: "جاري تحميل المنشورات الأقدم...",
      scrollToLoadMore: "مرر لأسفل لتحميل المزيد",
      noMorePosts: "لا توجد منشورات أقدم",
    },
    en: {
      noPosts: "No posts to display",
      tryLoading: "Try loading posts or change search term",
      loadOlderPosts: "Load Older Posts",
      loadingOlder: "Loading older posts...",
      scrollToLoadMore: "Scroll down to load more",
      noMorePosts: "No more older posts",
    },
  }

  const text = t[language]

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

  return (
    <div
      ref={scrollContainerRef}
      className="space-y-6 max-h-screen overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 400px)" }}
    >
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          searchingPhones={searchingPhones}
          phoneSearchResults={phoneSearchResults}
          expandedComments={expandedComments}
          onToggleComments={onToggleComments}
          onPhoneSearch={onPhoneSearch}
          darkMode={darkMode}
          language={language}
        />
      ))}

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

      {!hasMorePosts && posts.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-gray-500 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">{text.noMorePosts}</span>
          </div>
        </div>
      )}
    </div>
  )
}
```

```typescript
"use client"

import { useCallback, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ChevronDown, CheckCircle, Loader2 } from "lucide-react"
import { PostCard } from "./post-card"
import type { Post } from "@/types"

interface PostsListProps {
  posts: Post[]
  loading: boolean
  loadingOlder: boolean
  hasMorePosts: boolean
  searchingPhones: Set<string>
  phoneSearchResults: { [key: string]: string }
  expandedComments: Set<string>
  onLoadOlderPosts: () => void
  onToggleComments: (postId: string) => void
  onPhoneSearch: (userId: string, userName: string, source: string) => void
  darkMode: boolean
  language: "ar" | "en"
}

export function PostsList({
  posts = [],
  loading = false,
  loadingOlder = false,
  hasMorePosts = false,
  searchingPhones = new Set(),
  phoneSearchResults = {},
  expandedComments = new Set(),
  onLoadOlderPosts,
  onToggleComments,
  onPhoneSearch,
  darkMode = false,
  language = "ar",
}: PostsListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  const t = {
    ar: {
      noPosts: "لا توجد منشورات للعرض",
      tryLoading: "جرب تحميل المنشورات أو تغيير كلمة البحث",
      loadOlderPosts: "تحميل منشورات أقدم",
      loadingOlder: "جاري تحميل المنشورات الأقدم...",
      scrollToLoadMore: "مرر لأسفل لتحميل المزيد",
      noMorePosts: "لا توجد منشورات أقدم",
    },
    en: {
      noPosts: "No posts to display",
      tryLoading: "Try loading posts or change search term",
      loadOlderPosts: "Load Older Posts",
      loadingOlder: "Loading older posts...",
      scrollToLoadMore: "Scroll down to load more",
      noMorePosts: "No more older posts",
    },
  }

  const text = t[language]

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

  return (
    <div
      ref={scrollContainerRef}
      className="space-y-6 max-h-screen overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 400px)" }}
    >
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          searchingPhones={searchingPhones}
          phoneSearchResults={phoneSearchResults}
          expandedComments={expandedComments}
          onToggleComments={onToggleComments}
          onPhoneSearch={onPhoneSearch}
          darkMode={darkMode}
          language={language}
        />
      ))}

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

      {!hasMorePosts && posts.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-gray-500 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">{text.noMorePosts}</span>
          </div>
        </div>
      )}
    </div>
  )
}
```

```typescript
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Phone, Loader2, Eye, EyeOff } from "lucide-react"
import { useState, useCallback } from "react"
import { formatRelative } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { CommentsSection } from "./comments-section"
import { useSession } from "next-auth/react"
import type { FacebookPost } from "@/lib/facebook-api-service"

interface PostCardProps {
  post: FacebookPost
  searchingPhones: Set<string>
  phoneSearchResults: { [key: string]: string }
  expandedComments: Set<string>
  onToggleComments: (postId: string) => void
  onPhoneSearch: (userId: string, userName: string, source: string) => void
  darkMode: boolean
  language: "ar" | "en"
}

export function PostCard({
  post,
  searchingPhones,
  phoneSearchResults,
  expandedComments,
  onToggleComments,
  onPhoneSearch,
  darkMode = false,
  language = "ar",
}: PostCardProps) {
  const { data: session } = useSession()
  const [showAllContent, setShowAllContent] = useState(false)
  const [showFullImage, setShowFullImage] = useState(false)

  const toggleComments = useCallback(() => {
    onToggleComments(post.id)
  }, [onToggleComments, post.id])

  const performPhoneSearch = useCallback(() => {
    if (!post.user_id || !post.user_name) return
    onPhoneSearch(post.user_id, post.user_name, "facebook")
  }, [onPhoneSearch, post.user_id, post.user_name])

  const isPhoneNumberFound = !!phoneSearchResults[post.user_id!]
  const isPhoneSearchLoading = searchingPhones.has(post.user_id!)
  const areCommentsExpanded = expandedComments.has(post.id)

  const t = {
    ar: {
      comments: "تعليقات",
      searchPhone: "ابحث عن الهاتف",
      searching: "جارٍ البحث...",
      foundPhone: "تم العثور على الهاتف",
      expand: "توسيع",
      collapse: "طي",
      ago: "منذ",
      showMore: "إظهار المزيد",
      showLess: "إظهار أقل",
      showFullImage: "إظهار الصورة كاملة",
      hideFullImage: "إخفاء الصورة كاملة",
    },
    en: {
      comments: "Comments",
      searchPhone: "Search Phone",
      searching: "Searching...",
      foundPhone: "Phone Found",
      expand: "Expand",
      collapse: "Collapse",
      ago: "ago",
      showMore: "Show More",
      showLess: "Show Less",
      showFullImage: "Show Full Image",
      hideFullImage: "Hide Full Image",
    },
  }

  const text = t[language]
  const locale = language === "ar" ? ar : enUS

  const toggleContent = () => {
    setShowAllContent(!showAllContent)
  }

  const toggleImage = () => {
    setShowFullImage(!showFullImage)
  }

  const shortContent = showAllContent ? post.content : post.content.slice(0, 250)
  const showMoreButton = post.content.length > 250 && !showAllContent
  const showLessButton = post.content.length > 250 && showAllContent

  return (
    <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
      <CardContent className="relative p-6">
        {session?.user?.email === "admin@admin.com" && (
          <Badge className="absolute top-2 right-2" variant="secondary">
            Admin
          </Badge>
        )}

        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={post.user_image} />
            <AvatarFallback>{post.user_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 font-medium">
            <div className="flex items-center">
              <p className="text-sm">{post.user_name}</p>
            </div>
            <p className="text-xs text-gray-500">
              {formatRelative(new Date(post.created_at), new Date(), { locale })} {text.ago}
            </p>
          </div>
        </div>

        <div className="mt-4 text-sm break-words">
          {shortContent}
          {showMoreButton && (
            <Button variant="link" onClick={toggleContent}>
              {text.showMore}
            </Button>
          )}
          {showLessButton && (
            <Button variant="link" onClick={toggleContent}>
              {text.showLess}
            </Button>
          )}
        </div>

        {post.image && (
          <div className="mt-4 relative">
            <img
              src={post.image}
              alt="Post Image"
              className={`w-full rounded-md object-cover transition-transform duration-300 ${
                showFullImage ? "scale-100" : "scale-75"
              }`}
              style={{ maxHeight: "400px" }}
            />
            <div className="absolute top-2 left-2 flex space-x-2">
              <Button variant="outline" size="icon" onClick={toggleImage}>
                {showFullImage ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showFullImage ? text.hideFullImage : text.showFullImage}</span>
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={toggleComments}>
            <MessageSquare className="w-4 h-4 mr-2" />
            {text.comments}
            {post.comments_count > 0 && <Badge className="ml-2">{post.comments_count}</Badge>}
          </Button>

          {/* Conditionally render the phone search button based on whether a phone number has been found */}
          {isPhoneNumberFound ? (
            <Badge variant="outline">
              <Phone className="w-3 h-3 mr-1" />
              {text.foundPhone}
              {phoneSearchResults[post.user_id!]}
            </Badge>
          ) : (
            <Button variant="ghost" size="sm" onClick={performPhoneSearch} disabled={isPhoneSearchLoading}>
              {isPhoneSearchLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {text.searching}
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  {text.searchPhone}
                </>
              )}
            </Button>
          )}
        </div>

        {areCommentsExpanded && <CommentsSection postId={post.id} darkMode={darkMode} language={language} />}
      </CardContent>
    </Card>
  )
}