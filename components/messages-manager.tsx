"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Send, RefreshCw, User, Clock, MessageSquare, Bot, Loader2, Search } from "lucide-react"
import { facebookCommentsService, type FacebookMessage, type AutoReplyRule } from "@/lib/facebook-comments-service"

interface MessagesManagerProps {
  pageId: string
  accessToken: string
  autoReplyRules: AutoReplyRule[]
  autoReplyEnabled: boolean
  darkMode: boolean
  language: "ar" | "en"
}

export function MessagesManager({
  pageId,
  accessToken,
  autoReplyRules,
  autoReplyEnabled,
  darkMode,
  language,
}: MessagesManagerProps) {
  const [messages, setMessages] = useState<FacebookMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sending, setSending] = useState(false)

  const t = {
    ar: {
      title: "إدارة الرسائل",
      messages: "الرسائل",
      refresh: "تحديث",
      reply: "رد",
      send: "إرسال",
      search: "بحث في الرسائل",
      replyPlaceholder: "اكتب ردك هنا...",
      noMessages: "لا توجد رسائل",
      loading: "جاري التحميل...",
      sending: "جاري الإرسال...",
      replySuccess: "تم الرد بنجاح",
      replyError: "خطأ في الرد",
      timeAgo: "منذ",
      autoReplyTriggered: "تم تفعيل الرد التلقائي",
      from: "من",
      to: "إلى",
      conversation: "محادثة",
    },
    en: {
      title: "Messages Manager",
      messages: "Messages",
      refresh: "Refresh",
      reply: "Reply",
      send: "Send",
      search: "Search messages",
      replyPlaceholder: "Type your reply here...",
      noMessages: "No messages",
      loading: "Loading...",
      sending: "Sending...",
      replySuccess: "Reply sent successfully",
      replyError: "Reply error",
      timeAgo: "ago",
      autoReplyTriggered: "Auto reply triggered",
      from: "From",
      to: "To",
      conversation: "Conversation",
    },
  }

  const text = t[language]

  useEffect(() => {
    if (pageId && accessToken) {
      facebookCommentsService.setAccessToken(accessToken)
      loadMessages()
    }
  }, [pageId, accessToken])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const result = await facebookCommentsService.getPageMessages(pageId, 50)
      if (result.data) {
        setMessages(result.data)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (message: FacebookMessage) => {
    if (!replyText.trim()) return

    setSending(true)
    try {
      // التحقق من الرد التلقائي أولاً
      if (autoReplyEnabled) {
        const autoReplyRule = facebookCommentsService.analyzeForAutoReply(replyText, autoReplyRules)
        if (autoReplyRule) {
          const autoResponse = facebookCommentsService.previewAutoReply(replyText, autoReplyRule.response)
          setReplyText(autoResponse)
        }
      }

      const result = await facebookCommentsService.sendMessage(message.from.id, replyText, pageId)

      if (result.success) {
        setReplyText("")
        setReplyingTo(null)
        loadMessages() // إعادة تحميل الرسائل
      }
    } catch (error) {
      console.error("Error replying to message:", error)
    } finally {
      setSending(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "الآن"
    if (diffInMinutes < 60) return `${diffInMinutes} دقيقة`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ساعة`
    return `${Math.floor(diffInMinutes / 1440)} يوم`
  }

  const filteredMessages = messages.filter(
    (message) =>
      !searchTerm ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.from.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              {text.title}
              <Badge variant="outline">
                {messages.length} {text.messages}
              </Badge>
              {autoReplyEnabled && (
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                  <Bot className="w-3 h-3 mr-1" />
                  {text.autoReplyTriggered}
                </Badge>
              )}
            </div>
            <Button onClick={loadMessages} disabled={loading} variant="outline">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {text.refresh}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={text.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Messages List */}
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
              <p className="text-gray-500">{text.loading}</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">{text.noMessages}</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className={`${darkMode ? "bg-gray-700/50" : "bg-gray-50"} border-l-4 border-l-green-500`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{message.from.name}</span>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(message.created_time)} {text.timeAgo}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {text.conversation}
                          </Badge>
                        </div>

                        {message.message && (
                          <div className="mb-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <p className="text-sm leading-relaxed">{message.message}</p>
                          </div>
                        )}

                        {message.attachments?.data && message.attachments.data.length > 0 && (
                          <div className="mb-3">
                            <Badge variant="outline" className="text-xs">
                              📎 {message.attachments.data.length} مرفقات
                            </Badge>
                          </div>
                        )}

                        <div className="space-y-2">
                          {replyingTo === message.id ? (
                            <div className="flex gap-2">
                              <Textarea
                                placeholder={text.replyPlaceholder}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="flex-1 min-h-[60px]"
                              />
                              <div className="flex flex-col gap-1">
                                <Button
                                  onClick={() => handleReply(message)}
                                  disabled={!replyText.trim() || sending}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {sending ? (
                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  ) : (
                                    <Send className="w-3 h-3 mr-1" />
                                  )}
                                  {sending ? text.sending : text.send}
                                </Button>
                                <Button
                                  onClick={() => {
                                    setReplyingTo(null)
                                    setReplyText("")
                                  }}
                                  variant="outline"
                                  size="sm"
                                >
                                  إلغاء
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              onClick={() => setReplyingTo(message.id)}
                              variant="outline"
                              size="sm"
                              className="bg-transparent"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              {text.reply}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
