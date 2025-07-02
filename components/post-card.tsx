"use client"
import { Avatar } from "@/components/ui/avatar"; // تأكد من وجود استيراد لاسم المكون
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  User,
  Phone,
  ExternalLink,
  Star,
  Copy,
  MessageCircle,
  Eye,
  EyeOff,
  Loader2,
  ImageIcon,
  Video,
  DownloadIcon,
} from "lucide-react"
import Image from "next/image"
import { buildPostUrl, buildUserUrl, copyToClipboard, downloadMedia } from "@/lib/utils"
import type { Post } from "@/types"

interface PostCardProps {
  post: Post
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
  darkMode,
  language,
}: PostCardProps) {
  const t = {
    ar: {
      unknown: "غير معروف",
      group: "جروب",
      page: "صفحة",
      comments: "التعليقات",
      showComments: "عرض التعليقات",
      hideComments: "إخفاء التعليقات",
      noComments: "لا توجد تعليقات",
      images: "صور",
      videos: "فيديوهات",
      downloadImage: "تحميل الصورة",
      downloadVideo: "تحميل الفيديو",
    },
    en: {
      unknown: "Unknown",
      group: "Group",
      page: "Page",
      comments: "Comments",
      showComments: "Show Comments",
      hideComments: "Hide Comments",
      noComments: "No comments",
      images: "Images",
      videos: "Videos",
      downloadImage: "Download Image",
      downloadVideo: "Download Video",
    },
  }

  const text = t[language]

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
 
 return (
  <Card
    className={`${
      darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"
    } backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500`}
  >
    <CardContent className="p-4">

        {/* رأس البطاقة */}
        <div className="flex items-start justify-between mb-3">
          {/* معلومات المستخدم */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-md">
              {post.from?.picture?.data?.url ? (
                <Image
                  src={post.from.picture.data.url}
                  alt={post.from?.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {post.from?.name?.charAt(0) || "?"}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-base">{post.from?.name || text.unknown}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(buildUserUrl(post.from?.id || ""), "_blank")}
                  className="h-5 w-5 p-0 hover:bg-blue-100"
                >
                  <User className="w-3 h-3" />
                </Button>
                {post.from?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onPhoneSearch(post.from?.id || "", post.from?.name || "", post.source_name || "")
                    }
                    disabled={searchingPhones.has(post.from?.id || "")}
                    className="h-5 w-5 p-0 hover:bg-green-100"
                  >
                    {searchingPhones.has(post.from?.id || "") ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Phone className="w-3 h-3" />
                    )}
                  </Button>
                )}
              </div>

              <p className="text-xs text-gray-500 mb-1">
                {post.created_time
                  ? new Date(post.created_time).toLocaleString(language === "ar" ? "ar-EG" : "en-US")
                  : text.unknown}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
                  {post.source_type === "group" ? text.group : text.page}: {post.source_name}
                </Badge>

                {post.from?.id && phoneSearchResults[post.from.id] && (
                  <Badge
                    variant="secondary"
                    className={`text-xs flex items-center gap-1 ${
                      phoneSearchResults[post.from.id] === "لا يوجد رقم" ||
                      phoneSearchResults[post.from.id] === "خطأ في البحث"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : phoneSearchResults[post.from.id] === "جاري البحث..."
                        ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                        : "bg-green-50 border-green-200 text-green-700"
                    }`}
                  >
                    <Phone className="w-3 h-3" />
                    {phoneSearchResults[post.from.id]}
                    {!["لا يوجد رقم", "خطأ في البحث", "جاري البحث..."].includes(phoneSearchResults[post.from.id]) && (
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

          {/* أدوات إضافية */}
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-xs">
              <Star className="w-3 h-3 mr-1 text-yellow-500" />
              {calculatePostScore(post)}
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

        {/* التعليقات */}
        {expandedComments.has(post.id) && (
          <div className="mt-3">
            {post.comments?.data?.length > 0 ? (
              <div className="max-h-80 overflow-y-auto border rounded-md bg-gray-50/50 dark:bg-gray-800/50 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                <div className="space-y-3 p-4">
                  {post.comments.data.map((comment, index) => (
                    <div
                      key={comment.id}
                      className={`flex gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border-l-2 border-l-blue-400 ${
                        index < post.comments.data.length - 1 ? "mb-3" : ""
                      }`}
                    >
                      {/* صورة المعلق */}
                      <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-md flex-shrink-0">
                        {comment.from?.picture?.data?.url ? (
                          <Image
                            src={comment.from.picture.data.url}
                            alt={comment.from?.name || "User"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            {comment.from?.name?.charAt(0) || "?"}
                          </div>
                        )}
                      </div>

                      {/* محتوى التعليق */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {comment.from?.name || text.unknown}
                          </span>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(buildUserUrl(comment.from?.id || ""), "_blank")}
                              className="h-6 w-6 p-0 hover:bg-blue-100"
                            >
                              <User className="w-3 h-3" />
                            </Button>
                            {comment.from?.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  onPhoneSearch(comment.from?.id || "", comment.from?.name || "", post.source_name || "")
                                }
                                disabled={searchingPhones.has(comment.from?.id || "")}
                                className="h-6 w-6 p-0 hover:bg-green-100"
                              >
                                {searchingPhones.has(comment.from?.id || "") ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Phone className="w-3 h-3" />
                                )}
                              </Button>
                            )}
                          </div>

                          <span className="text-xs text-gray-500 ml-auto">
                            {comment.created_time
                              ? new Date(comment.created_time).toLocaleString(language === "ar" ? "ar-EG" : "en-US")
                              : text.unknown}
                          </span>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg">
                          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed break-words">
                            {comment.message || "لا يوجد نص"}
                          </p>
                        </div>

                        {/* إعجابات */}
                        {comment.like_count > 0 && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs bg-red-50 border-red-200 text-red-700">
                              ❤️ {comment.like_count}
                            </Badge>
                          </div>
                        )}

                        {/* نتيجة بحث الهاتف */}
                        {comment.from?.id && phoneSearchResults[comment.from.id] && (
                          <div className="mt-2">
                            <Badge
                              variant="secondary"
                              className={`text-xs flex items-center gap-1 w-fit ${
                                phoneSearchResults[comment.from.id] === "لا يوجد رقم" ||
                                phoneSearchResults[comment.from.id] === "خطأ في البحث"
                                  ? "bg-red-50 border-red-200 text-red-700"
                                  : phoneSearchResults[comment.from.id] === "جاري البحث..."
                                  ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                                  : "bg-green-50 border-green-200 text-green-700"
                              }`}
                            >
                              <Phone className="w-3 h-3" />
                              {phoneSearchResults[comment.from.id]}
                              {!["لا يوجد رقم", "خطأ في البحث", "جاري البحث..."].includes(
                                phoneSearchResults[comment.from.id]
                              ) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(phoneSearchResults[comment.from.id])}
                                  className="h-4 w-4 p-0 hover:bg-green-200 ml-1"
                                >
                                  <Copy className="w-2 h-2" />
                                </Button>
                              )}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">{text.noComments}</p>
              </div>
            )}
          </div>
        )}
      
    </CardContent>
  </Card>
);

}