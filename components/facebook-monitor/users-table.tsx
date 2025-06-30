"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  Search,
  Phone,
  ExternalLink,
  Copy,
  Star,
  MessageCircle,
  FileText,
  Calendar,
  MoreVertical,
  Award,
  Activity,
  X,
} from "lucide-react"
import { buildUserUrl, copyToClipboard } from "@/lib/utils"
import type { Post, SavedPhone } from "@/types"

interface UserData {
  id: string
  name: string
  posts_count: number
  comments_count: number
  last_activity: Date
  groups: string[]
  total_score: number
  avatar?: string
  phone?: string
}

interface UsersTableProps {
  posts: Post[]
  filteredPosts: Post[] // إضافة المنشورات المفلترة
  savedPhones: SavedPhone[]
  onPhoneSearch: (userId: string, userName: string, source: string) => void
  searchingPhones: Set<string>
  phoneSearchResults: { [key: string]: string }
  darkMode: boolean
  language: "ar" | "en"
}

export function UsersTable({
  posts,
  filteredPosts, // استخدام المنشورات المفلترة
  savedPhones,
  onPhoneSearch,
  searchingPhones,
  phoneSearchResults,
  darkMode,
  language,
}: UsersTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "posts" | "comments" | "score" | "activity">("score")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedUserComments, setSelectedUserComments] = useState<{
    userId: string
    userName: string
    comments: Array<{
      id: string
      message: string
      created_time: string
      postId: string
      postMessage?: string
      source: string
      sourceName: string
    }>
  } | null>(null)

  const t = {
    ar: {
      userAnalytics: "تحليلات المستخدمين",
      searchUsers: "البحث في المستخدمين...",
      userName: "اسم المستخدم",
      postsCount: "عدد المنشورات",
      commentsCount: "عدد التعليقات",
      totalScore: "إجمالي النقاط",
      lastActivity: "آخر نشاط",
      phone: "الرقم",
      actions: "الإجراءات",
      noPhone: "لا يوجد رقم",
      searchPhone: "البحث عن الرقم",
      visitProfile: "زيارة البروفايل",
      copyPhone: "نسخ الرقم",
      copyUserId: "نسخ معرف المستخدم",
      totalUsers: "إجمالي المستخدمين",
      activeUsers: "المستخدمون النشطون",
      usersWithPhones: "المستخدمون مع الأرقام",
      topContributors: "أفضل المساهمين",
      sortBy: "ترتيب حسب",
      name: "الاسم",
      posts: "المنشورات",
      comments: "التعليقات",
      score: "النقاط",
      activity: "النشاط",
      ascending: "تصاعدي",
      descending: "تنازلي",
      groups: "الجروبات",
      pages: "الصفحات",
      unknown: "غير معروف",
      today: "اليوم",
      yesterday: "أمس",
      daysAgo: "منذ {days} أيام",
      noUsers: "لا يوجد مستخدمون",
      loadingUsers: "جاري تحميل المستخدمين...",
      viewComments: "عرض التعليقات",
      userComments: "تعليقات المستخدم",
      commentText: "نص التعليق",
      commentSource: "مصدر التعليق",
      commentDate: "تاريخ التعليق",
      noUserComments: "لا توجد تعليقات لهذا المستخدم",
      closeComments: "إغلاق التعليقات",
      commentsModal: "نافذة التعليقات",
    },
    en: {
      userAnalytics: "User Analytics",
      searchUsers: "Search users...",
      userName: "User Name",
      postsCount: "Posts Count",
      commentsCount: "Comments Count",
      totalScore: "Total Score",
      lastActivity: "Last Activity",
      phone: "Phone",
      actions: "Actions",
      noPhone: "No phone",
      searchPhone: "Search Phone",
      visitProfile: "Visit Profile",
      copyPhone: "Copy Phone",
      copyUserId: "Copy User ID",
      totalUsers: "Total Users",
      activeUsers: "Active Users",
      usersWithPhones: "Users with Phones",
      topContributors: "Top Contributors",
      sortBy: "Sort by",
      name: "Name",
      posts: "Posts",
      comments: "Comments",
      score: "Score",
      activity: "Activity",
      ascending: "Ascending",
      descending: "Descending",
      groups: "Groups",
      pages: "Pages",
      unknown: "Unknown",
      today: "Today",
      yesterday: "Yesterday",
      daysAgo: "{days} days ago",
      noUsers: "No users found",
      loadingUsers: "Loading users...",
      viewComments: "View Comments",
      userComments: "User Comments",
      commentText: "Comment Text",
      commentSource: "Comment Source",
      commentDate: "Comment Date",
      noUserComments: "No comments for this user",
      closeComments: "Close Comments",
      commentsModal: "Comments Modal",
    },
  }

  const text = t[language]

  // Generate user data from posts
  const userData = useMemo(() => {
    const userMap = new Map<string, UserData>()

    // Process posts
    filteredPosts.forEach((post) => {
      if (post.from?.id && post.from?.name) {
        const userId = post.from.id
        const existing = userMap.get(userId)

        if (existing) {
          existing.posts_count += 1
          existing.total_score += 10 // Base score for post
          existing.last_activity = new Date(
            Math.max(existing.last_activity.getTime(), new Date(post.created_time).getTime()),
          )
          if (post.source_name && !existing.groups.includes(post.source_name)) {
            existing.groups.push(post.source_name)
          }
        } else {
          userMap.set(userId, {
            id: userId,
            name: post.from.name,
            posts_count: 1,
            comments_count: 0,
            last_activity: new Date(post.created_time),
            groups: post.source_name ? [post.source_name] : [],
            total_score: 10,
            avatar: post.from.picture?.data?.url,
          })
        }

        // Process comments
        if (post.comments?.data) {
          post.comments.data.forEach((comment) => {
            if (comment.from?.id && comment.from?.name) {
              const commentUserId = comment.from.id
              const existingCommenter = userMap.get(commentUserId)

              if (existingCommenter) {
                existingCommenter.comments_count += 1
                existingCommenter.total_score += 5 // Base score for comment
                existingCommenter.last_activity = new Date(
                  Math.max(existingCommenter.last_activity.getTime(), new Date(comment.created_time).getTime()),
                )
              } else {
                userMap.set(commentUserId, {
                  id: commentUserId,
                  name: comment.from.name,
                  posts_count: 0,
                  comments_count: 1,
                  last_activity: new Date(comment.created_time),
                  groups: post.source_name ? [post.source_name] : [],
                  total_score: 5,
                })
              }
            }
          })
        }
      }
    })

    // Add phone numbers
    savedPhones.forEach((savedPhone) => {
      const user = userMap.get(savedPhone.userId)
      if (user) {
        user.phone = savedPhone.phone
        user.total_score += 20 // Bonus for having phone
      }
    })

    return Array.from(userMap.values())
  }, [filteredPosts, savedPhones])

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    const filtered = userData.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.includes(searchQuery) ||
        (user.phone && user.phone.includes(searchQuery)),
    )

    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "posts":
          aValue = a.posts_count
          bValue = b.posts_count
          break
        case "comments":
          aValue = a.comments_count
          bValue = b.comments_count
          break
        case "score":
          aValue = a.total_score
          bValue = b.total_score
          break
        case "activity":
          aValue = a.last_activity.getTime()
          bValue = b.last_activity.getTime()
          break
        default:
          return 0
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [userData, searchQuery, sortBy, sortOrder])

  const formatLastActivity = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return text.today
    if (diffDays === 2) return text.yesterday
    return text.daysAgo.replace("{days}", (diffDays - 1).toString())
  }

  const getUserComments = (userId: string, userName: string) => {
    const userComments: Array<{
      id: string
      message: string
      created_time: string
      postId: string
      postMessage?: string
      source: string
      sourceName: string
    }> = []

    filteredPosts.forEach((post) => {
      if (post.comments?.data) {
        post.comments.data.forEach((comment) => {
          if (comment.from?.id === userId) {
            userComments.push({
              id: comment.id,
              message: comment.message,
              created_time: comment.created_time,
              postId: post.id,
              postMessage: post.message?.substring(0, 100) + (post.message && post.message.length > 100 ? "..." : ""),
              source: post.source || "",
              sourceName: post.source_name || "",
            })
          }
        })
      }
    })

    // Sort by date (newest first)
    userComments.sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime())

    setSelectedUserComments({
      userId,
      userName,
      comments: userComments,
    })
  }

  const stats = {
    totalUsers: userData.length,
    activeUsers: userData.filter((u) => {
      const daysSinceActivity = Math.ceil(
        Math.abs(new Date().getTime() - u.last_activity.getTime()) / (1000 * 60 * 60 * 24),
      )
      return daysSinceActivity <= 7
    }).length,
    usersWithPhones: userData.filter((u) => u.phone).length,
    topScore: Math.max(...userData.map((u) => u.total_score), 0),
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{text.totalUsers}</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{text.activeUsers}</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Phone className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{text.usersWithPhones}</p>
                <p className="text-2xl font-bold">{stats.usersWithPhones}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{text.topContributors}</p>
                <p className="text-2xl font-bold">{stats.topScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {text.userAnalytics}
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={text.searchUsers}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {text.sortBy}: {text[sortBy]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>{text.name}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("posts")}>{text.posts}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("comments")}>{text.comments}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("score")}>{text.score}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("activity")}>{text.activity}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                {sortOrder === "asc" ? text.ascending : text.descending}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndSortedUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>{text.noUsers}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{text.userName}</TableHead>
                    <TableHead className="text-center">{text.postsCount}</TableHead>
                    <TableHead className="text-center">{text.commentsCount}</TableHead>
                    <TableHead className="text-center">{text.totalScore}</TableHead>
                    <TableHead>{text.lastActivity}</TableHead>
                    <TableHead>{text.phone}</TableHead>
                    <TableHead className="text-center">{text.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.id}</p>
                            <div className="flex gap-1 mt-1">
                              {user.groups.slice(0, 2).map((group, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {group}
                                </Badge>
                              ))}
                              {user.groups.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.groups.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit mx-auto">
                          <FileText className="w-3 h-3" />
                          {user.posts_count}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit mx-auto">
                          <MessageCircle className="w-3 h-3" />
                          {user.comments_count}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="default" className="flex items-center gap-1 w-fit mx-auto">
                          <Star className="w-3 h-3" />
                          {user.total_score}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{formatLastActivity(user.last_activity)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.phone ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                              {user.phone}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(user.phone!)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : phoneSearchResults[user.id] ? (
                          <Badge
                            variant="secondary"
                            className={
                              phoneSearchResults[user.id] === "لا يوجد رقم" ||
                              phoneSearchResults[user.id] === "خطأ في البحث"
                                ? "bg-red-50 text-red-700"
                                : phoneSearchResults[user.id] === "جاري البحث..."
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-green-50 text-green-700"
                            }
                          >
                            {phoneSearchResults[user.id]}
                          </Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPhoneSearch(user.id, user.name, user.groups[0] || "")}
                            disabled={searchingPhones.has(user.id)}
                            className="h-6 text-xs"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            {text.searchPhone}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => window.open(buildUserUrl(user.id), "_blank")}>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              {text.visitProfile}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyToClipboard(user.id)}>
                              <Copy className="w-4 h-4 mr-2" />
                              {text.copyUserId}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => getUserComments(user.id, user.name)}>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              {text.viewComments} ({user.comments_count})
                            </DropdownMenuItem>
                            {user.phone && (
                              <DropdownMenuItem onClick={() => copyToClipboard(user.phone!)}>
                                <Phone className="w-4 h-4 mr-2" />
                                {text.copyPhone}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Comments Modal */}
      {selectedUserComments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`w-full max-w-4xl max-h-[80vh] ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {text.userComments}: {selectedUserComments.userName}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUserComments(null)}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
                {text.closeComments}
              </Button>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[60vh]">
              {selectedUserComments.comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>{text.noUserComments}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedUserComments.comments.map((comment) => (
                    <div key={comment.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {comment.sourceName}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_time).toLocaleString(language === "ar" ? "ar-EG" : "en-US")}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{text.commentText}:</p>
                          <p className="text-sm bg-white dark:bg-gray-800 p-2 rounded border">{comment.message}</p>
                        </div>

                        {comment.postMessage && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">المنشور الأصلي:</p>
                            <p className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-600 p-2 rounded">
                              {comment.postMessage}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://www.facebook.com/${comment.postId}`, "_blank")}
                          className="text-xs"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          عرض المنشور
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(comment.message)}
                          className="text-xs"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          نسخ التعليق
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
