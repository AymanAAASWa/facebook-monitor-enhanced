"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, MessageSquare, ExternalLink } from "lucide-react"
import { formatRelative } from "date-fns"
import { ar } from "date-fns/locale"

interface Comment {
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
}

interface CommentsSectionProps {
  postId: string
  darkMode: boolean
  language: "ar" | "en"
}

export function CommentsSection({ postId, darkMode = false, language = "ar" }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const t = {
    ar: {
      title: "التعليقات",
      loading: "جاري تحميل التعليقات...",
      noComments: "لا توجد تعليقات",
      error: "خطأ في تحميل التعليقات",
      retry: "إعادة المحاولة",
      likes: "إعجاب",
      viewOnFb: "عرض على فيسبوك",
    },
    en: {
      title: "Comments",
      loading: "Loading comments...",
      noComments: "No comments available",
      error: "Error loading comments",
      retry: "Retry",
      likes: "likes",
      viewOnFb: "View on Facebook",
    },
  }

  const text = t[language]

  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    if (!postId) return

    setLoading(true)
    setError(null)

    try {
      const accessToken = localStorage.getItem("facebook_access_token")
      if (!accessToken) {
        throw new Error("No access token found")
      }

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

      const data = await response.json()

      if (data.success) {
        setComments(data.data || [])
      } else {
        throw new Error(data.error || "Failed to load comments")
      }
    } catch (err: any) {
      setError(err.message)
      console.error("Error loading comments:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={`mt-4 ${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            {text.title}
            {comments.length > 0 && <Badge className="ml-2">{comments.length}</Badge>}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`https://facebook.com/${postId}`, "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            {text.viewOnFb}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>{text.loading}</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{text.error}: {error}</p>
            <Button onClick={loadComments} variant="outline">
              {text.retry}
            </Button>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">{text.noComments}</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto border rounded-md">
            <div className="p-4 space-y-4">
              {comments.map((comment, index) => (
                <div key={comment.id} className={`flex space-x-3 pb-4 ${index < comments.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={comment.from?.picture?.data?.url} />
                    <AvatarFallback>{comment.from?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="font-medium text-sm truncate">{comment.from?.name}</p>
                      <p className="text-xs text-gray-500 flex-shrink-0">
                        {formatRelative(new Date(comment.created_time), new Date(), {
                          locale: language === "ar" ? ar : undefined,
                        })}
                      </p>
                    </div>
                    <p className="text-sm break-words whitespace-pre-wrap mb-2">{comment.message}</p>
                    {comment.like_count && comment.like_count > 0 && (
                      <Badge variant="outline" className="text-xs">
                        ❤️ {comment.like_count} {text.likes}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}