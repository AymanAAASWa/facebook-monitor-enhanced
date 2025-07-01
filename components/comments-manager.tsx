"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  MessageCircle,
  Reply,
  Send,
  RefreshCw,
  Bot,
  User,
  Clock,
  Heart,
  Settings,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"
import { facebookCommentsService, type FacebookComment, type AutoReplyRule } from "@/lib/facebook-comments-service"

interface CommentsManagerProps {
  pageId: string
  accessToken: string
  darkMode: boolean
  language: "ar" | "en"
}

export function CommentsManager({ pageId, accessToken, darkMode, language }: CommentsManagerProps) {
  const [comments, setComments] = useState<FacebookComment[]>([])
  const [loading, setLoading] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [autoReplyRules, setAutoReplyRules] = useState<AutoReplyRule[]>([])
  const [newRule, setNewRule] = useState<Partial<AutoReplyRule>>({
    name: "",
    keywords: [],
    response: "",
    enabled: true,
    type: "comment",
    conditions: {
      exactMatch: false,
      caseSensitive: false,
      containsAll: false,
    },
  })
  const [newKeyword, setNewKeyword] = useState("")
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())

  const t = {
    ar: {
      title: "إدارة التعليقات",
      comments: "التعليقات",
      autoReply: "الرد التلقائي",
      settings: "إعدادات الرد التلقائي",
      refresh: "تحديث",
      reply: "رد",
      send: "إرسال",
      replyPlaceholder: "اكتب ردك هنا...",
      noComments: "لا توجد تعليقات",
      loading: "جاري التحميل...",
      replying: "جاري الرد...",
      replySuccess: "تم الرد بنجاح",
      replyError: "خطأ في الرد",
      autoReplyEnabled: "تفعيل الرد التلقائي",
      ruleName: "اسم القاعدة",
      keywords: "الكلمات المفتاحية",
      response: "الرد",
      addKeyword: "إضافة كلمة",
      addRule: "إضافة قاعدة",
      exactMatch: "مطابقة تامة",
      caseSensitive: "حساس للأحرف",
      containsAll: "يحتوي على الكل",
      ruleType: "نوع القاعدة",
      commentType: "تعليقات",
      messageType: "رسائل",
      bothType: "كلاهما",
      preview: "معاينة",
      showMore: "عرض المزيد",
      showLess: "عرض أقل",
      likes: "إعجاب",
      timeAgo: "منذ",
    },
    en: {
      title: "Comments Manager",
      comments: "Comments",
      autoReply: "Auto Reply",
      settings: "Auto Reply Settings",
      refresh: "Refresh",
      reply: "Reply",
      send: "Send",
      replyPlaceholder: "Type your reply here...",
      noComments: "No comments",
      loading: "Loading...",
      replying: "Replying...",
      replySuccess: "Reply sent successfully",
      replyError: "Reply error",
      autoReplyEnabled: "Enable Auto Reply",
      ruleName: "Rule Name",
      keywords: "Keywords",
      response: "Response",
      addKeyword: "Add Keyword",
      addRule: "Add Rule",
      exactMatch: "Exact Match",
      caseSensitive: "Case Sensitive",
      containsAll: "Contains All",
      ruleType: "Rule Type",
      commentType: "Comments",
      messageType: "Messages",
      bothType: "Both",
      preview: "Preview",
      showMore: "Show More",
      showLess: "Show Less",
      likes: "Likes",
      timeAgo: "ago",
    },
  }

  const text = t[language]

  useEffect(() => {
    if (pageId && accessToken) {
      facebookCommentsService.setAccessToken(accessToken)
      loadComments()
    }
  }, [pageId, accessToken])

  const loadComments = async () => {
    setLoading(true)
    try {
      const result = await facebookCommentsService.getPageComments(pageId, 50)
      if (result.data) {
        setComments(result.data)
      }
    } catch (error) {
      console.error("Error loading comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return

    try {
      const result = await facebookCommentsService.replyToComment(commentId, replyText)
      if (result.success) {
        setReplyText("")
        setReplyingTo(null)
        loadComments() // إعادة تحميل التعليقات
      }
    } catch (error) {
      console.error("Error replying to comment:", error)
    }
  }

  const handleAddKeyword = () => {
    if (newKeyword.trim() && newRule.keywords) {
      setNewRule((prev) => ({
        ...prev,
        keywords: [...(prev.keywords || []), newKeyword.trim()],
      }))
      setNewKeyword("")
    }
  }

  const handleAddRule = () => {
    if (newRule.name && newRule.keywords?.length && newRule.response) {
      const rule: AutoReplyRule = {
        id: Date.now().toString(),
        name: newRule.name,
        keywords: newRule.keywords,
        response: newRule.response,
        enabled: newRule.enabled || true,
        type: newRule.type || "comment",
        conditions: newRule.conditions || {
          exactMatch: false,
          caseSensitive: false,
          containsAll: false,
        },
      }

      setAutoReplyRules((prev) => [...prev, rule])
      setNewRule({
        name: "",
        keywords: [],
        response: "",
        enabled: true,
        type: "comment",
        conditions: {
          exactMatch: false,
          caseSensitive: false,
          containsAll: false,
        },
      })
    }
  }

  const handleRemoveRule = (ruleId: string) => {
    setAutoReplyRules((prev) => prev.filter((rule) => rule.id !== ruleId))
  }

  const handleRemoveKeyword = (keyword: string) => {
    setNewRule((prev) => ({
      ...prev,
      keywords: prev.keywords?.filter((k) => k !== keyword) || [],
    }))
  }

  const toggleCommentExpansion = (commentId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
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

  return (
    <div className="space-y-6">
      <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {text.title}
              <Badge variant="outline">
                {comments.length} {text.comments}
              </Badge>
            </div>
            <Button onClick={loadComments} disabled={loading} variant="outline">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {text.refresh}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="comments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                {text.comments}
              </TabsTrigger>
              <TabsTrigger value="autoreply" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                {text.autoReply}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
                  <p className="text-gray-500">{text.loading}</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">{text.noComments}</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {comments.map((comment) => (
                    <Card
                      key={comment.id}
                      className={`${darkMode ? "bg-gray-700/50" : "bg-gray-50"} border-l-4 border-l-blue-500`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={comment.from.picture?.data?.url || "/placeholder.svg"} />
                            <AvatarFallback>
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{comment.from.name}</span>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTimeAgo(comment.created_time)} {text.timeAgo}
                              </Badge>
                              {comment.like_count && comment.like_count > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  <Heart className="w-3 h-3 mr-1" />
                                  {comment.like_count} {text.likes}
                                </Badge>
                              )}
                            </div>

                            <div className="mb-3">
                              <p className="text-sm leading-relaxed">
                                {expandedComments.has(comment.id) || comment.message.length <= 150
                                  ? comment.message
                                  : `${comment.message.substring(0, 150)}...`}
                              </p>

                              {comment.message.length > 150 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleCommentExpansion(comment.id)}
                                  className="mt-1 h-6 px-2 text-xs"
                                >
                                  {expandedComments.has(comment.id) ? (
                                    <>
                                      <EyeOff className="w-3 h-3 mr-1" />
                                      {text.showLess}
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-3 h-3 mr-1" />
                                      {text.showMore}
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>

                            {comment.can_reply && (
                              <div className="space-y-2">
                                {replyingTo === comment.id ? (
                                  <div className="flex gap-2">
                                    <Textarea
                                      placeholder={text.replyPlaceholder}
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      className="flex-1 min-h-[60px]"
                                    />
                                    <div className="flex flex-col gap-1">
                                      <Button
                                        onClick={() => handleReply(comment.id)}
                                        disabled={!replyText.trim()}
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700"
                                      >
                                        <Send className="w-3 h-3 mr-1" />
                                        {text.send}
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
                                    onClick={() => setReplyingTo(comment.id)}
                                    variant="outline"
                                    size="sm"
                                    className="bg-transparent"
                                  >
                                    <Reply className="w-3 h-3 mr-1" />
                                    {text.reply}
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="autoreply" className="space-y-6">
              {/* Auto Reply Settings */}
              <Card className={`${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    {text.settings}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoReplyEnabled">{text.autoReplyEnabled}</Label>
                    <Switch id="autoReplyEnabled" checked={autoReplyEnabled} onCheckedChange={setAutoReplyEnabled} />
                  </div>

                  {/* Add New Rule */}
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-medium">{text.addRule}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>{text.ruleName}</Label>
                        <Input
                          placeholder="اسم القاعدة"
                          value={newRule.name || ""}
                          onChange={(e) => setNewRule((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label>{text.ruleType}</Label>
                        <select
                          className="w-full p-2 border rounded"
                          value={newRule.type || "comment"}
                          onChange={(e) => setNewRule((prev) => ({ ...prev, type: e.target.value as any }))}
                        >
                          <option value="comment">{text.commentType}</option>
                          <option value="message">{text.messageType}</option>
                          <option value="both">{text.bothType}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label>{text.keywords}</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          placeholder="كلمة مفتاحية"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddKeyword()}
                        />
                        <Button onClick={handleAddKeyword} variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {newRule.keywords?.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            {keyword}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveKeyword(keyword)}
                              className="h-4 w-4 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>{text.response}</Label>
                      <Textarea
                        placeholder="الرد التلقائي..."
                        value={newRule.response || ""}
                        onChange={(e) => setNewRule((prev) => ({ ...prev, response: e.target.value }))}
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newRule.conditions?.exactMatch || false}
                          onCheckedChange={(checked) =>
                            setNewRule((prev) => ({
                              ...prev,
                              conditions: { ...prev.conditions, exactMatch: checked },
                            }))
                          }
                        />
                        <Label>{text.exactMatch}</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newRule.conditions?.caseSensitive || false}
                          onCheckedChange={(checked) =>
                            setNewRule((prev) => ({
                              ...prev,
                              conditions: { ...prev.conditions, caseSensitive: checked },
                            }))
                          }
                        />
                        <Label>{text.caseSensitive}</Label>
                      </div>
                    </div>

                    <Button onClick={handleAddRule} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      {text.addRule}
                    </Button>
                  </div>

                  {/* Existing Rules */}
                  <div className="space-y-2">
                    {autoReplyRules.map((rule) => (
                      <Card key={rule.id} className={`${darkMode ? "bg-gray-600/50" : "bg-white"}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{rule.name}</span>
                              <Badge variant={rule.enabled ? "default" : "secondary"}>
                                {rule.enabled ? "مفعل" : "معطل"}
                              </Badge>
                              <Badge variant="outline">{rule.type}</Badge>
                            </div>
                            <Button
                              onClick={() => handleRemoveRule(rule.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="text-sm space-y-1">
                            <p>
                              <strong>الكلمات:</strong> {rule.keywords.join(", ")}
                            </p>
                            <p>
                              <strong>الرد:</strong> {rule.response}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
