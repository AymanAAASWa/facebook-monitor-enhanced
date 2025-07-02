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
      className="space-y-6 overflow-y-auto"
      style={{ scrollBehavior: "smooth" }}
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