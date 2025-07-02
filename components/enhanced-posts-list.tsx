"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  FileText,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar as CalendarIcon,
  ChevronDown,
  Loader2,
  CheckCircle,
  MessageSquare,
  Heart,
  Share2,
  ExternalLink,
  Copy,
  Eye,
  Phone,
  Clock,
  TrendingUp,
  Activity,
  BarChart3,
  RefreshCw,
  Download,
  ArrowUp
} from "lucide-react"
import { UserAnalyticsViewer } from "./user-analytics-viewer"
import { UserDataViewer } from "./user-posts-viewer"
import { format, subDays, subWeeks, subMonths, isAfter, isBefore } from "date-fns"
import { ar } from "date-fns/locale"
import type { FacebookPost } from "@/lib/facebook-api-service"

interface EnhancedPostsListProps {
  posts: Array<FacebookPost & { source_id: string; source_name: string; source_type: string }>
  loading: boolean
  loadingOlder: boolean
  hasMorePosts: boolean
  onLoadOlderPosts: () => void
  darkMode: boolean
  language: "ar" | "en"
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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUserName, setSelectedUserName] = useState<string>("")
  const [showUserAnalytics, setShowUserAnalytics] = useState(false)
  const [showUserPosts, setShowUserPosts] = useState(false)
  const [autoLoadEnabled, setAutoLoadEnabled] = useState(true)
  const [loadedPostsCount, setLoadedPostsCount] = useState(20)
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  // Date filtering
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month" | "3months" | "6months" | "year" | "custom">("all")
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [showDatePicker, setShowDatePicker] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef(0)

  const t = {
    ar: {
      posts: "المنشورات",
      search: "البحث في المنشورات...",
      sortBy: "ترتيب حسب",
      filterBySource: "تصفية حسب المصدر",
      filterByDate: "تصفية حسب التاريخ",
      date: "التاريخ",
      comments: "التعليقات",
      engagement: "التفاعل",
      source: "المصدر",
      all: "الكل",
      today: "اليوم",
      week: "هذا الأسبوع",
      month: "هذا الشهر",
      "3months": "3 أشهر",
      "6months": "6 أشهر",
      year: "سنة",
      custom: "تخصيص",
      startDate: "من تاريخ",
      endDate: "إلى تاريخ",
      noPosts: "لا توجد منشورات للعرض",
      tryLoading: "جرب تحميل المنشورات أو تغيير كلمة البحث",
      loadOlderPosts: "تحميل منشورات أقدم",
      loadingOlder: "جاري تحميل المنشورات الأقدم...",
      scrollToLoadMore: "مرر لأسفل لتحميل المزيد",
      noMorePosts: "لا توجد منشورات أقدم",
      noComments: "لا توجد تعليقات",
      viewComments: "عرض التعليقات",
      hideComments: "إخفاء التعليقات",
      viewUser: "عرض المستخدم",
      viewAnalytics: "عرض التحليلات",
      searchPhone: "البحث عن رقم",
      searching: "جاري البحث...",
      copyText: "نسخ النص",
      openInFacebook: "فتح في فيسبوك",
      autoLoad: "التحميل التلقائي",
      showingPosts: "عرض {count} من {total} منشور",
      loadMore: "تحميل المزيد",
      scrollToTop: "العودة لأعلى",
      clearFilters: "مسح المرشحات",
      applyFilters: "تطبيق المرشحات",
      totalEngagement: "إجمالي التفاعل",
      avgEngagement: "متوسط التفاعل",
      refreshPosts: "تحديث المنشورات",
      exportPosts: "تصدير المنشورات",
      selectAll: "تحديد الكل",
      selectNone: "إلغاء التحديد",
      selectedPosts: "المنشورات المحددة"
    },
    en: {
      posts: "Posts",
      search: "Search posts...",
      sortBy: "Sort by",
      filterBySource: "Filter by source",
      filterByDate: "Filter by date",
      date: "Date",
      comments: "Comments",
      engagement: "Engagement",
      source: "Source",
      all: "All",
      today: "Today",
      week: "This Week",
      month: "This Month",
      "3months": "3 Months",
      "6months": "6 Months",
      year: "Year",
      custom: "Custom",
      startDate: "Start Date",
      endDate: "End Date",
      noPosts: "No posts to display",
      tryLoading: "Try loading posts or change search term",
      loadOlderPosts: "Load Older Posts",
      loadingOlder: "Loading older posts...",
      scrollToLoadMore: "Scroll down to load more",
      noMorePosts: "No more older posts",
      noComments: "No comments",
      viewComments: "View Comments",
      hideComments: "Hide Comments",
      viewUser: "View User",
      viewAnalytics: "View Analytics",
      searchPhone: "Search Phone",
      searching: "Searching...",
      copyText: "Copy Text",
      openInFacebook: "Open in Facebook",
      autoLoad: "Auto Load",
      showingPosts: "Showing {count} of {total} posts",
      loadMore: "Load More",
      scrollToTop: "Scroll to Top",
      clearFilters: "Clear Filters",
      applyFilters: "Apply Filters",
      totalEngagement: "Total Engagement",
      avgEngagement: "Average Engagement",
      refreshPosts: "Refresh Posts",
      exportPosts: "Export Posts",
      selectAll: "Select All",
      selectNone: "Select None",
      selectedPosts: "Selected Posts"
    }
  }

  const text = t[language]

  // تصفية المنشورات حسب التاريخ والبحث
  const filteredPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      // تصفية النص
      const matchesSearch = !searchTerm || 
        post.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.from?.name?.toLowerCase().includes(searchTerm.toLowerCase())

      // تصفية المصدر
      const matchesSource = filterSource === "all" || post.source_name === filterSource

      // تصفية التاريخ
      let matchesDate = true
      if (post.created_time) {
        const postDate = new Date(post.created_time)
        const now = new Date()

        switch (dateFilter) {
          case "today":
            matchesDate = format(postDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")
            break
          case "week":
            matchesDate = isAfter(postDate, subWeeks(now, 1))
            break
          case "month":
            matchesDate = isAfter(postDate, subMonths(now, 1))
            break
          case "3months":
            matchesDate = isAfter(postDate, subMonths(now, 3))
            break
          case "6months":
            matchesDate = isAfter(postDate, subMonths(now, 6))
            break
          case "year":
            matchesDate = isAfter(postDate, subMonths(now, 12))
            break
          case "custom":
            if (startDate && endDate) {
              matchesDate = isAfter(postDate, startDate) && isBefore(postDate, endDate)
            } else if (startDate) {
              matchesDate = isAfter(postDate, startDate)
            } else if (endDate) {
              matchesDate = isBefore(postDate, endDate)
            }
            break
        }
      }

      return matchesSearch && matchesSource && matchesDate
    })

    // ترتيب المنشورات
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "date":
          aValue = new Date(a.created_time || 0).getTime()
          bValue = new Date(b.created_time || 0).getTime()
          break
        case "comments":
          aValue = a.comments?.summary?.total_count || 0
          bValue = b.comments?.summary?.total_count || 0
          break
        case "engagement":
          aValue = (a.reactions?.summary?.total_count || 0) + 
                   (a.comments?.summary?.total_count || 0) + 
                   (a.shares?.count || 0)
          bValue = (b.reactions?.summary?.total_count || 0) + 
                   (b.comments?.summary?.total_count || 0) + 
                   (b.shares?.count || 0)
          break
        default:
          aValue = new Date(a.created_time || 0).getTime()
          bValue = new Date(b.created_time || 0).getTime()
      }

      return sortOrder === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1)
    })

    return filtered
  }, [posts, searchTerm, filterSource, dateFilter, startDate, endDate, sortBy, sortOrder])

  // المنشورات المعروضة (للتحميل التدريجي)
  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, loadedPostsCount)
  }, [filteredPosts, loadedPostsCount])

  // معالجة التمرير
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container

    // إظهار/إخفاء زر العودة لأعلى
    setShowScrollToTop(scrollTop > 300)

    // التحميل التلقائي عند الوصول لنهاية المحتوى
    if (autoLoadEnabled && scrollTop + clientHeight >= scrollHeight - 200) {
      if (loadedPostsCount < filteredPosts.length) {
        setLoadedPostsCount(prev => Math.min(prev + 20, filteredPosts.length))
      } else if (hasMorePosts && !loadingOlder) {
        onLoadOlderPosts()
      }
    }

    lastScrollTop.current = scrollTop
  }, [autoLoadEnabled, loadedPostsCount, filteredPosts.length, hasMorePosts, loadingOlder, onLoadOlderPosts])

  // ربط معالج التمرير
  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  // إعادة تعيين عدد المنشورات المحملة عند تغيير المرشحات
  useEffect(() => {
    setLoadedPostsCount(20)
  }, [searchTerm, filterSource, dateFilter, startDate, endDate, sortBy, sortOrder])

  // دوال المساعدة
  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterSource("all")
    setDateFilter("all")
    setStartDate(undefined)
    setEndDate(undefined)
    setSortBy("date")
    setSortOrder("desc")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedComments(newExpanded)
  }

  const handleUserClick = (userId: string, userName: string, action: "analytics" | "posts") => {
    setSelectedUserId(userId)
    setSelectedUserName(userName)
    if (action === "analytics") {
      setShowUserAnalytics(true)
    } else {
      setShowUserPosts(true)
    }
  }

  const exportFilteredPosts = () => {
    const data = {
      posts: displayedPosts,
      filters: {
        searchTerm,
        filterSource,
        dateFilter,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        sortBy,
        sortOrder
      },
      export_date: new Date().toISOString(),
      total_posts: displayedPosts.length
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `filtered-posts-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // الحصول على المصادر المتاحة
  const availableSources = useMemo(() => {
    const sources = new Set(posts.map(post => post.source_name))
    return Array.from(sources)
  }, [posts])

  // حساب الإحصائيات
  const stats = useMemo(() => {
    const totalEngagement = displayedPosts.reduce((sum, post) => 
      sum + (post.reactions?.summary?.total_count || 0) + 
            (post.comments?.summary?.total_count || 0) + 
            (post.shares?.count || 0), 0
    )

    return {
      totalPosts: displayedPosts.length,
      totalEngagement,
      avgEngagement: displayedPosts.length > 0 ? Math.round(totalEngagement / displayedPosts.length) : 0
    }
  }, [displayedPosts])

  // عرض المكونات الفرعية
  if (showUserAnalytics && selectedUserId) {
    return (
      <UserAnalyticsViewer
        userId={selectedUserId}
        posts={posts}
        darkMode={darkMode}
        language={language}
        onClose={() => {
          setShowUserAnalytics(false)
          setSelectedUserId(null)
        }}
      />
    )
  }

  if (showUserPosts && selectedUserId) {
    return (
      <UserDataViewer
        userId={selectedUserId}
        userName={selectedUserName}
        onClose={() => {
          setShowUserPosts(false)
          setSelectedUserId(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 relative">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardContent className="p-3 sm:p-4 text-center">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-lg sm:text-2xl font-bold">{stats.totalPosts}</div>
            <div className="text-xs sm:text-sm text-gray-500">{text.posts}</div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardContent className="p-3 sm:p-4 text-center">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-500" />
            <div className="text-lg sm:text-2xl font-bold">{stats.totalEngagement}</div>
            <div className="text-xs sm:text-sm text-gray-500">{text.totalEngagement}</div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardContent className="p-3 sm:p-4 text-center">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-lg sm:text-2xl font-bold">{stats.avgEngagement}</div>
            <div className="text-xs sm:text-sm text-gray-500">{text.avgEngagement}</div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات التحكم */}
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* الصف الأول: البحث والأزرار الرئيسية */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={text.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setAutoLoadEnabled(!autoLoadEnabled)}
              className={`flex items-center gap-2 ${autoLoadEnabled ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 ${autoLoadEnabled ? 'text-blue-600' : ''}`} />
              {text.autoLoad}
            </Button>

            <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {text.clearFilters}
            </Button>

            <Button variant="outline" onClick={exportFilteredPosts} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              {text.exportPosts}
            </Button>
          </div>

          {/* الصف الثاني: المرشحات المتقدمة */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* تصفية التاريخ */}
            <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <SelectValue placeholder={text.filterByDate} />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">{text.all}</SelectItem>
                  <SelectItem value="today">{text.today}</SelectItem>
                  <SelectItem value="week">{text.week}</SelectItem>
                  <SelectItem value="month">{text.month}</SelectItem>
                  <SelectItem value="3months">{text["3months"]}</SelectItem>
                  <SelectItem value="6months">{text["6months"]}</SelectItem>
                  <SelectItem value="year">{text.year}</SelectItem>
                  <SelectItem value="custom">{text.custom}</SelectItem>
                </SelectContent>
            </Select>

            {/* تواريخ مخصصة */}
            {dateFilter === "custom" && (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-48">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {startDate ? format(startDate, "PPP", { locale: ar }) : text.startDate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      locale={ar}
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-48">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {endDate ? format(endDate, "PPP", { locale: ar }) : text.endDate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      locale={ar}
                    />
                  </PopoverContent>
                </Popover>
              </>
            )}

            {/* تصفية المصدر */}
            {availableSources.length > 0 && (
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder={text.filterBySource} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{text.all}</SelectItem>
                  {availableSources.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* الترتيب */}
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={text.sortBy} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">{text.date}</SelectItem>
                <SelectItem value="engagement">{text.engagement}</SelectItem>
                <SelectItem value="comments">{text.comments}</SelectItem>
              </SelectContent>
            </Select>

            {/* اتجاه الترتيب */}
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2"
            >
              {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* عداد المنشورات */}
      {filteredPosts.length > 0 && (
        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between text-sm">
              <span>
                {text.showingPosts
                  .replace("{count}", displayedPosts.length.toString())
                  .replace("{total}", filteredPosts.length.toString())}
              </span>
              {loadedPostsCount < filteredPosts.length && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLoadedPostsCount(prev => Math.min(prev + 20, filteredPosts.length))}
                >
                  {text.loadMore} ({filteredPosts.length - loadedPostsCount})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* قائمة المنشورات */}
      {displayedPosts.length === 0 && !loading ? (
        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardContent className="p-8 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">{text.noPosts}</h3>
            <p className="text-gray-500">{text.tryLoading}</p>
          </CardContent>
        </Card>
      ) : (
        <div
          ref={scrollContainerRef}
          className="space-y-4 sm:space-y-6 max-h-screen overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 300px)" }}
        >
          {displayedPosts.map((post) => (
            <Card key={post.id} className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3 sm:gap-4">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                    <AvatarImage src={post.from?.picture?.data?.url} alt={post.from?.name} />
                    <AvatarFallback>
                      {post.from?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base truncate">
                          {post.from?.name || "Unknown User"}
                        </h4>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            {post.created_time 
                              ? new Date(post.created_time).toLocaleString("ar-EG")
                              : "Unknown"
                            }
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {post.source_name}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUserClick(post.from?.id || "", post.from?.name || "", "analytics")}
                          className="text-xs sm:text-sm"
                        >
                          <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {text.viewAnalytics}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUserClick(post.from?.id || "", post.from?.name || "", "posts")}
                          className="text-xs sm:text-sm"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {text.viewUser}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(post.message || "")}
                          className="text-xs sm:text-sm"
                        >
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`https://facebook.com/${post.id}`, "_blank")}
                          className="text-xs sm:text-sm"
                        >
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* محتوى المنشور */}
                {post.message && (
                  <div className="mb-4">
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {post.message}
                    </p>
                  </div>
                )}

                {/* صورة المنشور */}
                {post.full_picture && (
                  <div className="mb-4">
                    <img
                      src={post.full_picture}
                      alt="Post image"
                      className="rounded-lg max-w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* إحصائيات التفاعل */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-4 sm:gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>{post.reactions?.summary?.total_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <span>{post.comments?.summary?.total_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-4 h-4 text-green-500" />
                      <span>{post.shares?.count || 0}</span>
                    </div>
                  </div>

                  {post.comments?.data && post.comments.data.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleComments(post.id)}
                      className="text-xs sm:text-sm"
                    >
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {expandedComments.has(post.id) ? text.hideComments : text.viewComments}
                      ({post.comments.data.length})
                    </Button>
                  )}
                </div>

                {/* التعليقات */}
                {expandedComments.has(post.id) && post.comments?.data && post.comments.data.length > 0 ? (
                  <div className="border-t pt-4">
                    <ScrollArea className="max-h-64">
                      <div className="space-y-3">
                        {post.comments.data.slice(0, 10).map((comment) => (
                          <div key={comment.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                              <AvatarImage src={comment.from?.picture?.data?.url} alt={comment.from?.name} />
                              <AvatarFallback className="text-xs">
                                {comment.from?.name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-xs sm:text-sm">{comment.from?.name}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.created_time).toLocaleDateString("ar-EG")}
                                </span>
                                {comment.like_count && comment.like_count > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Heart className="w-3 h-3" />
                                    <span>{comment.like_count}</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {comment.message}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  expandedComments.has(post.id) && (
                    <div className="border-t pt-3">
                      <div className="text-center py-2 sm:py-3 text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1 text-gray-400" />
                        <p className="text-xs">{text.noComments}</p>
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          ))}

          {/* مؤشر التحميل */}
          {(loadingOlder || (autoLoadEnabled && loadedPostsCount < filteredPosts.length)) && (
            <div className="flex flex-col items-center gap-4 py-6 sm:py-8">
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span className="text-sm font-medium">{text.loadingOlder}</span>
              </div>
            </div>
          )}

          {/* نهاية المنشورات */}
          {!hasMorePosts && loadedPostsCount >= filteredPosts.length && filteredPosts.length > 0 && (
            <div className="text-center py-6 sm:py-8">
              <div className="inline-flex items-center gap-2 text-gray-500 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">{text.noMorePosts}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* زر العودة لأعلى */}
      {showScrollToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 rounded-full w-12 h-12 shadow-lg"
          size="sm"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}