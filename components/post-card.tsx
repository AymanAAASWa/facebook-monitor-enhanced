"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CommentsSection } from "@/components/comments-section"
import { useAppContext } from "@/lib/app-context"
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Clock, 
  User,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react"

interface Post {
  id: string
  message?: string
  created_time: string
  likes?: { data: any[] }
  comments?: { data: any[] }
  shares?: { count: number }
  from?: { name: string; id: string }
  source?: string
  source_type?: string;
  source_name?: string;
  full_picture?: string;
  attachments?: any;
}

interface PostCardProps {
  post: Post
  viewMode?: "grid" | "list"
  compact?: boolean
}

export function PostCard({ 
  post, 
  viewMode = "list", 
  compact = false
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [searchingPhones, setSearchingPhones] = useState<Set<string>>(new Set())
  const [phoneSearchResults, setPhoneSearchResults] = useState<{ [key: string]: string }>({})
  const { darkMode: isDarkMode } = useAppContext()

  const handlePhoneSearch = (userId: string, userName: string, source: string) => {
    setSearchingPhones(prev => new Set(prev).add(userId))
    // محاكاة البحث عن رقم الهاتف
    setTimeout(() => {
      setPhoneSearchResults(prev => ({ ...prev, [userId]: "01xxxxxxxxx" }))
      setSearchingPhones(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }, 2000)
  }

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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const engagement = {
    likes: post.likes?.data?.length || 0,
    comments: post.comments?.data?.length || 0,
    shares: post.shares?.count || 0
  }

  const totalEngagement = engagement.likes + engagement.comments + engagement.shares
  const engagementLevel = totalEngagement > 50 ? "high" : totalEngagement > 10 ? "medium" : "low"

  const buildPostUrl = (post:Post) => {
    return `https://www.facebook.com/${post.id}`
  }
  const buildUserUrl = (userId:string) => {
    return `https://www.facebook.com/${userId}`
  }

  const calculatePostScore = (post: Post): number => {
    let score = 0
    const message = post.message || ""

    score += message.length > 100 ? 5 : 2
    score += (post.comments?.data?.length || 0) * 2
    if (getPostMedia(post).length > 0) score += 5

    return score
  }

  const getPostMedia = (post: Post) => {
    const media: Array<{ type: string; url: string; id: string }> = []

    if (post.full_picture) {
      media.push({
        type: "image",
        url: post.full_picture,
        id: `${post.id}_full_picture`,
      })
    }

    if (post.attachments?.data) {
      post.attachments.data.forEach((attachment, index) => {
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
          attachment.subattachments.data.forEach((subAttachment, subIndex) => {
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (compact) {
    return (
      <Card className={`transition-all duration-200 hover:shadow-md ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm truncate">{post.from?.name || "مستخدم غير معروف"}</span>
                <Badge variant="outline" className="text-xs">{post.source}</Badge>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(post.created_time)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                {post.message || "منشور بدون نص"}
              </p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Heart className="w-3 h-3 text-red-500" />
                  {engagement.likes}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MessageSquare className="w-3 h-3 text-blue-500" />
                  {engagement.comments}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Share2 className="w-3 h-3 text-green-500" />
                  {engagement.shares}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} ${viewMode === "grid" ? "h-fit" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback>
                <User className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{post.from?.name || "مستخدم غير معروف"}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant={post.source_type === "page" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {post.source_type === "page" ? "صفحة" : "مجموعة"}
                </Badge>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDate(post.created_time)}
                </span>
              </div>
            </div>
          </div>
          <Badge 
            variant={engagementLevel === "high" ? "default" : engagementLevel === "medium" ? "secondary" : "outline"}
            className="text-xs"
          >
            {engagementLevel === "high" ? "تفاعل عالي" : engagementLevel === "medium" ? "تفاعل متوسط" : "تفاعل منخفض"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Post Content */}
        {post.message && (
          <div className="space-y-2">
            <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${!expanded && post.message.length > 200 ? "line-clamp-3" : ""}`}>
              {expanded ? post.message : truncateText(post.message, 200)}
            </p>
            {post.message.length > 200 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="p-0 h-auto text-blue-600 hover:text-blue-800"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 ml-1" />
                    عرض أقل
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 ml-1" />
                    عرض المزيد
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        <Separator />

        {/* Engagement Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-bold text-lg">{engagement.likes}</span>
            </div>
            <span className="text-xs text-gray-600">إعجاب</span>
          </div>

          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-lg">{engagement.comments}</span>
            </div>
            <span className="text-xs text-gray-600">تعليق</span>
          </div>

          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Share2 className="w-5 h-5 text-green-500" />
              <span className="font-bold text-lg">{engagement.shares}</span>
            </div>
            <span className="text-xs text-gray-600">مشاركة</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            {showComments ? "إخفاء التعليقات" : "عرض التعليقات"}
            {engagement.comments > 0 && (
              <Badge variant="secondary" className="ml-1">
                {engagement.comments}
              </Badge>
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
            onClick={() => window.open(buildPostUrl(post), "_blank")}
          >
            <ExternalLink className="w-4 h-4" />
            فتح في فيسبوك
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && engagement.comments > 0 && (
          <div className="border-t pt-4">
            <ScrollArea className="max-h-80">
              <CommentsSection 
                postId={post.id} 
                comments={post.comments?.data || []} 
                searchingPhones={searchingPhones}
                phoneSearchResults={phoneSearchResults}
                onPhoneSearch={handlePhoneSearch}
                language="ar"
              />
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  )
}