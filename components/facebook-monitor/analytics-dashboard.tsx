"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageCircle,
  FileText,
  Phone,
  Clock,
  Star,
  Activity,
  PieChart,
  Target,
  Info,
} from "lucide-react"
import type { Post, SavedPhone } from "@/types"

interface AnalyticsDashboardProps {
  posts: Post[]
  filteredPosts: Post[] // إضافة المنشورات المفلترة
  savedPhones: SavedPhone[]
  darkMode: boolean
  language: "ar" | "en"
}

export function AnalyticsDashboard({ posts, filteredPosts, savedPhones, darkMode, language }: AnalyticsDashboardProps) {
  const t = {
    ar: {
      analytics: "لوحة التحليلات",
      overview: "نظرة عامة",
      totalPosts: "إجمالي المنشورات",
      totalComments: "إجمالي التعليقات",
      totalUsers: "إجمالي المستخدمين",
      savedPhones: "الأرقام المحفوظة",
      postsToday: "منشورات اليوم",
      commentsToday: "تعليقات اليوم",
      activeUsers: "المستخدمون النشطون",
      topSources: "أفضل المصادر",
      activityTrend: "اتجاه النشاط",
      userEngagement: "تفاعل المستخدمين",
      contentAnalysis: "تحليل المحتوى",
      timeDistribution: "توزيع الوقت",
      groups: "الجروبات",
      pages: "الصفحات",
      posts: "منشورات",
      comments: "تعليقات",
      users: "مستخدمين",
      phones: "أرقام",
      morning: "الصباح (6ص - 12ظ)",
      afternoon: "بعد الظهر (12ظ - 6م)",
      evening: "المساء (6م - 12ص)",
      night: "الليل (12ص - 6ص)",
      thisWeek: "هذا الأسبوع",
      lastWeek: "الأسبوع الماضي",
      growth: "النمو",
      engagement: "التفاعل",
      coverage: "التغطية",
      efficiency: "الكفاءة",
      noData: "لا توجد بيانات للتحليل",
      loadData: "قم بتحميل المنشورات أولاً",
      // إضافة وصف للمؤشرات
      totalPostsDesc: "العدد الإجمالي للمنشورات المحملة من جميع المصادر",
      totalCommentsDesc: "العدد الإجمالي للتعليقات على جميع المنشورات",
      totalUsersDesc: "عدد المستخدمين الفريدين الذين نشروا أو علقوا",
      savedPhonesDesc: "عدد أرقام الهواتف التي تم العثور عليها وحفظها",
      engagementDesc: "متوسط عدد التعليقات لكل منشور - مؤشر على مستوى التفاعل",
      growthDesc: "إجمالي النشاط الجديد (منشورات + تعليقات) اليوم",
      coverageDesc: "نسبة المستخدمين الذين لديهم أرقام هواتف محفوظة",
      efficiencyDesc: "مدى فعالية العثور على أرقام الهواتف",
      topSourcesDesc: "المصادر الأكثر نشاطاً مرتبة حسب إجمالي المنشورات والتعليقات",
      timeDistributionDesc: "توزيع المنشورات حسب أوقات اليوم لفهم أنماط النشاط",
      sourceTypesDesc: "توزيع المحتوى بين الجروبات والصفحات",
      keyMetrics: "المؤشرات الرئيسية",
      detailedAnalysis: "التحليل التفصيلي",
      howCalculated: "كيف يتم الحساب؟",
      engagementFormula: "إجمالي التعليقات ÷ إجمالي المنشورات",
      coverageFormula: "الأرقام المحفوظة ÷ إجمالي المستخدمين × 100",
      activeUsersDesc: "تقدير للمستخدمين النشطين (70% من إجمالي المستخدمين)",
      scoreSystem: "نظام النقاط",
      postScore: "منشور = 10 نقاط",
      commentScore: "تعليق = 5 نقاط",
      phoneBonus: "رقم هاتف = 20 نقطة إضافية",
      insights: "رؤى تحليلية",
      bestTimeToPost: "أفضل وقت للنشر",
      mostActiveSource: "المصدر الأكثر نشاطاً",
      engagementLevel: "مستوى التفاعل",
      low: "منخفض",
      medium: "متوسط",
      high: "عالي",
      veryHigh: "عالي جداً",
    },
    en: {
      analytics: "Analytics Dashboard",
      overview: "Overview",
      totalPosts: "Total Posts",
      totalComments: "Total Comments",
      totalUsers: "Total Users",
      savedPhones: "Saved Phones",
      postsToday: "Posts Today",
      commentsToday: "Comments Today",
      activeUsers: "Active Users",
      topSources: "Top Sources",
      activityTrend: "Activity Trend",
      userEngagement: "User Engagement",
      contentAnalysis: "Content Analysis",
      timeDistribution: "Time Distribution",
      groups: "Groups",
      pages: "Pages",
      posts: "Posts",
      comments: "Comments",
      users: "Users",
      phones: "Phones",
      morning: "Morning (6AM - 12PM)",
      afternoon: "Afternoon (12PM - 6PM)",
      evening: "Evening (6PM - 12AM)",
      night: "Night (12AM - 6AM)",
      thisWeek: "This Week",
      lastWeek: "Last Week",
      growth: "Growth",
      engagement: "Engagement",
      coverage: "Coverage",
      efficiency: "Efficiency",
      noData: "No data to analyze",
      loadData: "Load posts first",
      // Add metric descriptions
      totalPostsDesc: "Total number of posts loaded from all sources",
      totalCommentsDesc: "Total number of comments on all posts",
      totalUsersDesc: "Number of unique users who posted or commented",
      savedPhonesDesc: "Number of phone numbers found and saved",
      engagementDesc: "Average comments per post - indicates interaction level",
      growthDesc: "Total new activity (posts + comments) today",
      coverageDesc: "Percentage of users with saved phone numbers",
      efficiencyDesc: "How effective we are at finding phone numbers",
      topSourcesDesc: "Most active sources ranked by total posts and comments",
      timeDistributionDesc: "Distribution of posts by time of day to understand activity patterns",
      sourceTypesDesc: "Content distribution between groups and pages",
      keyMetrics: "Key Metrics",
      detailedAnalysis: "Detailed Analysis",
      howCalculated: "How is it calculated?",
      engagementFormula: "Total Comments ÷ Total Posts",
      coverageFormula: "Saved Phones ÷ Total Users × 100",
      activeUsersDesc: "Estimated active users (70% of total users)",
      scoreSystem: "Scoring System",
      postScore: "Post = 10 points",
      commentScore: "Comment = 5 points",
      phoneBonus: "Phone number = 20 bonus points",
      insights: "Analytical Insights",
      bestTimeToPost: "Best Time to Post",
      mostActiveSource: "Most Active Source",
      engagementLevel: "Engagement Level",
      low: "Low",
      medium: "Medium",
      high: "High",
      veryHigh: "Very High",
    },
  }

  const text = t[language]

  const analytics = useMemo(() => {
    // استخدام filteredPosts بدلاً من posts في التحليلات
    if (filteredPosts.length === 0) {
      return {
        totalPosts: 0,
        totalComments: 0,
        totalUsers: 0,
        postsToday: 0,
        commentsToday: 0,
        activeUsers: 0,
        topSources: [],
        timeDistribution: { morning: 0, afternoon: 0, evening: 0, night: 0 },
        sourceTypes: { groups: 0, pages: 0 },
        userEngagement: 0,
        phonesCoverage: 0,
      }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const users = new Set<string>()
    const sources = new Map<string, { name: string; posts: number; comments: number; type: string }>()
    const timeDistribution = { morning: 0, afternoon: 0, evening: 0, night: 0 }
    const sourceTypes = { groups: 0, pages: 0 }

    let totalComments = 0
    let postsToday = 0
    let commentsToday = 0

    // ... باقي الكود يستخدم filteredPosts بدلاً من posts
    filteredPosts.forEach((post) => {
      // Count users
      if (post.from?.id) {
        users.add(post.from.id)
      }

      // Count posts today
      const postDate = new Date(post.created_time)
      if (postDate >= today) {
        postsToday++
      }

      // Time distribution
      const hour = postDate.getHours()
      if (hour >= 6 && hour < 12) timeDistribution.morning++
      else if (hour >= 12 && hour < 18) timeDistribution.afternoon++
      else if (hour >= 18 && hour < 24) timeDistribution.evening++
      else timeDistribution.night++

      // Source analysis
      const sourceKey = post.source || "unknown"
      const sourceName = post.source_name || sourceKey
      const sourceType = post.source_type || "unknown"

      if (!sources.has(sourceKey)) {
        sources.set(sourceKey, { name: sourceName, posts: 0, comments: 0, type: sourceType })
      }
      sources.get(sourceKey)!.posts++

      if (sourceType === "group") sourceTypes.groups++
      else if (sourceType === "page") sourceTypes.pages++

      // Comments analysis
      if (post.comments?.data) {
        const commentsCount = post.comments.data.length
        totalComments += commentsCount
        sources.get(sourceKey)!.comments += commentsCount

        post.comments.data.forEach((comment) => {
          if (comment.from?.id) {
            users.add(comment.from.id)
          }
          const commentDate = new Date(comment.created_time)
          if (commentDate >= today) {
            commentsToday++
          }
        })
      }
    })

    // Calculate metrics
    const totalUsers = users.size
    const activeUsers = Math.floor(totalUsers * 0.7) // Estimate active users
    const userEngagement = totalUsers > 0 ? Math.round((totalComments / filteredPosts.length) * 100) / 100 : 0
    const phonesCoverage = totalUsers > 0 ? Math.round((savedPhones.length / totalUsers) * 100) : 0

    // Top sources
    const topSources = Array.from(sources.entries())
      .map(([key, data]) => ({ key, ...data, total: data.posts + data.comments }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)

    return {
      totalPosts: filteredPosts.length,
      totalComments,
      totalUsers,
      postsToday,
      commentsToday,
      activeUsers,
      topSources,
      timeDistribution,
      sourceTypes,
      userEngagement,
      phonesCoverage,
    }
  }, [filteredPosts, savedPhones]) // تغيير dependency

  if (filteredPosts.length === 0) {
    return (
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardContent className="p-8 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">{text.noData}</h3>
          <p className="text-gray-500">{text.loadData}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{text.totalPosts}</p>
                <p className="text-2xl font-bold">{analytics.totalPosts}</p>
                <p className="text-xs text-green-600">
                  +{analytics.postsToday} {text.postsToday.toLowerCase()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{text.totalComments}</p>
                <p className="text-2xl font-bold">{analytics.totalComments}</p>
                <p className="text-xs text-green-600">
                  +{analytics.commentsToday} {text.commentsToday.toLowerCase()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{text.totalUsers}</p>
                <p className="text-2xl font-bold">{analytics.totalUsers}</p>
                <p className="text-xs text-blue-600">
                  {analytics.activeUsers} {text.activeUsers.toLowerCase()}
                </p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">{text.savedPhones}</p>
                <p className="text-2xl font-bold">{savedPhones.length}</p>
                <p className="text-xs text-orange-600">
                  {analytics.phonesCoverage}% {text.coverage.toLowerCase()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sources */}
        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {text.topSources}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.topSources.map((source, index) => (
              <div key={source.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium text-sm">{source.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {source.type === "group" ? text.groups : text.pages}
                    </Badge>
                  </div>
                  <span className="text-sm font-bold">{source.total}</span>
                </div>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>
                    {source.posts} {text.posts}
                  </span>
                  <span>•</span>
                  <span>
                    {source.comments} {text.comments}
                  </span>
                </div>
                <Progress value={(source.total / analytics.topSources[0]?.total) * 100 || 0} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Time Distribution */}
        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {text.timeDistribution}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(analytics.timeDistribution).map(([period, count]) => (
              <div key={period} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{text[period as keyof typeof text]}</span>
                  <span className="text-sm font-bold">{count}</span>
                </div>
                <Progress value={(count / analytics.totalPosts) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardContent className="p-4 text-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit mx-auto mb-3">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{text.engagement}</p>
            <p className="text-2xl font-bold">{analytics.userEngagement}</p>
            <p className="text-xs text-gray-500">
              {text.comments}/{text.posts}
            </p>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardContent className="p-4 text-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-fit mx-auto mb-3">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{text.growth}</p>
            <p className="text-2xl font-bold">+{analytics.postsToday + analytics.commentsToday}</p>
            <p className="text-xs text-gray-500">{text.thisWeek}</p>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardContent className="p-4 text-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full w-fit mx-auto mb-3">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{text.coverage}</p>
            <p className="text-2xl font-bold">{analytics.phonesCoverage}%</p>
            <p className="text-xs text-gray-500">
              {text.phones}/{text.users}
            </p>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardContent className="p-4 text-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full w-fit mx-auto mb-3">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{text.efficiency}</p>
            <p className="text-2xl font-bold">
              {analytics.totalUsers > 0 ? Math.round((savedPhones.length / analytics.totalUsers) * 100) : 0}%
            </p>
            <p className="text-xs text-gray-500">{text.efficiency.toLowerCase()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Source Types Distribution */}
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            {text.contentAnalysis}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">{text.overview}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">{text.groups}</span>
                  </div>
                  <span className="font-medium">{analytics.sourceTypes.groups}</span>
                </div>
                <Progress value={(analytics.sourceTypes.groups / analytics.totalPosts) * 100} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{text.pages}</span>
                  </div>
                  <span className="font-medium">{analytics.sourceTypes.pages}</span>
                </div>
                <Progress value={(analytics.sourceTypes.pages / analytics.totalPosts) * 100} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">{text.userEngagement}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{analytics.userEngagement}</p>
                  <p className="text-xs text-gray-500">
                    {text.comments}/{text.posts}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{analytics.phonesCoverage}%</p>
                  <p className="text-xs text-gray-500">
                    {text.phones} {text.coverage.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytical Insights */}
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            {text.insights}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">{text.keyMetrics}</h4>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{text.totalPosts}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{text.totalPostsDesc}</p>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{text.userEngagement}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{text.engagementDesc}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {text.howCalculated} {text.engagementFormula}
                  </p>
                </div>

                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">{text.coverage}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{text.coverageDesc}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {text.howCalculated} {text.coverageFormula}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">{text.scoreSystem}</h4>

              <div className="space-y-3">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{text.postScore}</span>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{text.commentScore}</span>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{text.phoneBonus}</span>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h5 className="font-medium mb-2">{text.engagementLevel}</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>{text.low}:</span>
                      <span>{"< 1"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{text.medium}:</span>
                      <span>1 - 3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{text.high}:</span>
                      <span>3 - 5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{text.veryHigh}:</span>
                      <span>{"> 5"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Insights */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-lg mb-4">{text.detailedAnalysis}</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{text.bestTimeToPost}</span>
                </div>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  {Object.entries(analytics.timeDistribution).reduce((a, b) =>
                    analytics.timeDistribution[a[0]] > analytics.timeDistribution[b[0]] ? a : b,
                  )[0] === "morning"
                    ? text.morning
                    : Object.entries(analytics.timeDistribution).reduce((a, b) =>
                          analytics.timeDistribution[a[0]] > analytics.timeDistribution[b[0]] ? a : b,
                        )[0] === "afternoon"
                      ? text.afternoon
                      : Object.entries(analytics.timeDistribution).reduce((a, b) =>
                            analytics.timeDistribution[a[0]] > analytics.timeDistribution[b[0]] ? a : b,
                          )[0] === "evening"
                        ? text.evening
                        : text.night}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {
                    Object.entries(analytics.timeDistribution).reduce((a, b) =>
                      analytics.timeDistribution[a[0]] > analytics.timeDistribution[b[0]] ? a : b,
                    )[1]
                  }{" "}
                  {text.posts}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-medium">{text.mostActiveSource}</span>
                </div>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                  {analytics.topSources[0]?.name || text.noData}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {analytics.topSources[0]?.total || 0} {text.posts}/{text.comments}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">{text.engagementLevel}</span>
                </div>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                  {analytics.userEngagement < 1
                    ? text.low
                    : analytics.userEngagement < 3
                      ? text.medium
                      : analytics.userEngagement < 5
                        ? text.high
                        : text.veryHigh}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {analytics.userEngagement} {text.comments}/{text.posts}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
