"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppContext } from "@/lib/app-context"
import { 
  MessageCircle, 
  User, 
  Clock, 
  Phone,
  Search,
  ExternalLink,
  ThumbsUp
} from "lucide-react"

interface CommentsSectionProps {
  postId: string
  comments: Comment[]
  searchingPhones: Set<string>
  phoneSearchResults: { [key: string]: string }
  onPhoneSearch: (userId: string, userName: string, source: string) => void
  language: "ar" | "en"
}

interface Comment {
  id: string
  message?: string
  created_time: string
  from?: { name: string; id: string }
  like_count?: number
  parent?: { id: string }
}

export function CommentsSection({ 
  postId, 
  comments, 
  searchingPhones,
  phoneSearchResults,
  onPhoneSearch,
  language 
}: CommentsSectionProps) {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const { darkMode } = useAppContext()

  const t = {
    ar: {
      comments: "التعليقات",
      noComments: "لا توجد تعليقات",
      searchPhone: "البحث عن رقم",
      searching: "جاري البحث...",
      phoneFound: "تم العثور على الرقم",
      viewProfile: "عرض الملف الشخصي",
      showReplies: "عرض الردود",
      hideReplies: "إخفاء الردود",
      reply: "رد",
      like: "إعجاب"
    },
    en: {
      comments: "Comments",
      noComments: "No comments",
      searchPhone: "Search Phone",
      searching: "Searching...",
      phoneFound: "Phone Found",
      viewProfile: "View Profile",
      showReplies: "Show Replies",
      hideReplies: "Reply",
      like: "Like"
    }
  }

  const text = t[language]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`
    } else if (diffInMinutes < 1440) {
      return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`
    } else {
      return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`
    }
  }

  const buildUserUrl = (userId: string) => {
    return `https://www.facebook.com/${userId}`
  }

  const toggleCommentExpansion = (commentId: string) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId)
    } else {
      newExpanded.add(commentId)
    }
    setExpandedComments(newExpanded)
  }

  const renderComment = (comment: Comment, isReply = false) => {
    const isExpanded = expandedComments.has(comment.id)
    const shouldTruncate = comment.message && comment.message.length > 150
    const displayMessage = shouldTruncate && !isExpanded 
      ? comment.message.substring(0, 150) + "..."
      : comment.message

    return (
      <div key={comment.id} className={`${isReply ? 'mr-8 border-r-2 border-gray-200 dark:border-gray-700 pr-4' : ''}`}>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} transition-all hover:bg-opacity-80`}>
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm truncate">
                  {comment.from?.name || "مستخدم غير معروف"}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(comment.created_time)}
                </span>
                {comment.like_count && comment.like_count > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <ThumbsUp className="w-3 h-3 ml-1" />
                    {comment.like_count}
                  </Badge>
                )}
              </div>

              {comment.message && (
                <div className="mb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {displayMessage}
                  </p>
                  {shouldTruncate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCommentExpansion(comment.id)}
                      className="p-0 h-auto text-blue-600 hover:text-blue-800 text-xs mt-1"
                    >
                      {isExpanded ? "عرض أقل" : "عرض المزيد"}
                    </Button>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                {comment.from?.id && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPhoneSearch(comment.from.id, comment.from.name, "facebook_comment")}
                      disabled={searchingPhones.has(comment.from.id)}
                      className="text-xs gap-1"
                    >
                      {searchingPhones.has(comment.from.id) ? (
                        <>
                          <Search className="w-3 h-3 animate-spin" />
                          {text.searching}
                        </>
                      ) : (
                        <>
                          <Phone className="w-3 h-3" />
                          {text.searchPhone}
                        </>
                      )}
                    </Button>

                    {phoneSearchResults[comment.from.id] && (
                      <Badge variant="default" className="text-xs">
                        <Phone className="w-3 h-3 ml-1" />
                        {phoneSearchResults[comment.from.id]}
                      </Badge>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(buildUserUrl(comment.from.id), "_blank")}
                      className="text-xs gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {text.viewProfile}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {!isReply && (
          <div className="mt-2">
            <Separator className="my-2" />
          </div>
        )}
      </div>
    )
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">{text.noComments}</p>
      </div>
    )
  }

  return (
    <Card className={`mt-4 ${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <MessageSquare className="w-5 h-5 ml-2" />
            {text.comments}
            <Badge variant="secondary" className="mr-2">
              {comments.length}
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="max-h-96">
          <div className="space-y-3">
            {comments.map((comment) => renderComment(comment))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}