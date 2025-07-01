"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  Users,
  MessageCircle,
  Heart,
  Clock,
  Calendar,
  Target,
  Zap,
  Brain,
  Eye,
  Award,
  Download,
  RefreshCw,
} from "lucide-react"
import type { AdvancedAnalytics } from "@/lib/advanced-analytics-service"

interface AdvancedAnalyticsDashboardProps {
  analytics: AdvancedAnalytics
  darkMode: boolean
  language: "ar" | "en"
  onExport?: () => void
  onRefresh?: () => void
}

export function AdvancedAnalyticsDashboard({
  analytics,
  darkMode,
  language,
  onExport,
  onRefresh,
}: AdvancedAnalyticsDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("engagement")
  const [activeTab, setActiveTab] = useState("overview")

  const t = {
    ar: {
      title: "التحليلات المتقدمة",
      overview: "نظرة عامة",
      timeAnalysis: "تحليل الوقت",
      contentAnalysis: "تحليل المحتوى",
      userAnalysis: "تحليل المستخدمين",
      engagement: "التفاعل",
      performance: "الأداء",
      predictions: "التنبؤات",
      trends: "الاتجاهات",
      export: "تصدير التقرير",
      refresh: "تحديث",
      filter: "تصفية",
      timeRange: "النطاق الزمني",
      metric: "المقياس",
      totalPosts: "إجمالي المنشورات",
      totalComments: "إجمالي التعليقات",
      totalUsers: "إجمالي المستخدمين",
      totalReactions: "إجمالي التفاعلات",
      engagementRate: "معدل التفاعل",
      averageEngagement: "متوسط التفاعل",
      peakHours: "ساعات الذروة",
      peakDays: "أيام الذروة",
      topUsers: "أكثر المستخدمين نشاطاً",
      viralContent: "المحتوى الفيروسي",
      sentimentAnalysis: "تحليل المشاعر",
      wordCloud: "سحابة الكلمات",
      hashtagAnalysis: "تحليل الهاشتاجات",
      bestPerforming: "الأفضل أداءً",
      worstPerforming: "الأسوأ أداءً",
      growthPrediction: "توقعات النمو",
      riskAnalysis: "تحليل المخاطر",
      recommendations: "التوصيات",
      positive: "إيجابي",
      negative: "سلبي",
      neutral: "محايد",
      mixed: "مختلط",
      high: "عالي",
      medium: "متوسط",
      low: "منخفض",
      score: "النقاط",
      growth: "النمو",
      influence: "التأثير",
      activity: "النشاط",
      posts: "منشورات",
      comments: "تعليقات",
      reactions: "تفاعلات",
      shares: "مشاركات",
      reach: "الوصول",
      impressions: "المشاهدات",
      clickRate: "معدل النقر",
      conversionRate: "معدل التحويل",
      retentionRate: "معدل الاحتفاظ",
      bounceRate: "معدل الارتداد",
      sessionDuration: "مدة الجلسة",
      pageViews: "مشاهدات الصفحة",
      uniqueVisitors: "الزوار الفريدون",
      returningVisitors: "الزوار العائدون",
      newVisitors: "الزوار الجدد",
      mobileUsers: "مستخدمو الهاتف",
      desktopUsers: "مستخدمو سطح المكتب",
      tabletUsers: "مستخدمو الجهاز اللوحي",
    },
    en: {
      title: "Advanced Analytics",
      overview: "Overview",
      timeAnalysis: "Time Analysis",
      contentAnalysis: "Content Analysis",
      userAnalysis: "User Analysis",
      engagement: "Engagement",
      performance: "Performance",
      predictions: "Predictions",
      trends: "Trends",
      export: "Export Report",
      refresh: "Refresh",
      filter: "Filter",
      timeRange: "Time Range",
      metric: "Metric",
      totalPosts: "Total Posts",
      totalComments: "Total Comments",
      totalUsers: "Total Users",
      totalReactions: "Total Reactions",
      engagementRate: "Engagement Rate",
      averageEngagement: "Average Engagement",
      peakHours: "Peak Hours",
      peakDays: "Peak Days",
      topUsers: "Top Users",
      viralContent: "Viral Content",
      sentimentAnalysis: "Sentiment Analysis",
      wordCloud: "Word Cloud",
      hashtagAnalysis: "Hashtag Analysis",
      bestPerforming: "Best Performing",
      worstPerforming: "Worst Performing",
      growthPrediction: "Growth Prediction",
      riskAnalysis: "Risk Analysis",
      recommendations: "Recommendations",
      positive: "Positive",
      negative: "Negative",
      neutral: "Neutral",
      mixed: "Mixed",
      high: "High",
      medium: "Medium",
      low: "Low",
      score: "Score",
      growth: "Growth",
      influence: "Influence",
      activity: "Activity",
      posts: "Posts",
      comments: "Comments",
      reactions: "Reactions",
      shares: "Shares",
      reach: "Reach",
      impressions: "Impressions",
      clickRate: "Click Rate",
      conversionRate: "Conversion Rate",
      retentionRate: "Retention Rate",
      bounceRate: "Bounce Rate",
      sessionDuration: "Session Duration",
      pageViews: "Page Views",
      uniqueVisitors: "Unique Visitors",
      returningVisitors: "Returning Visitors",
      newVisitors: "New Visitors",
      mobileUsers: "Mobile Users",
      desktopUsers: "Desktop Users",
      tabletUsers: "Tablet Users",
    },
  }

  const text = t[language]

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"]

  // Prepare data for charts
  const hourlyData = Object.entries(analytics.timeAnalysis.hourlyActivity).map(([hour, count]) => ({
    hour: `${hour}:00`,
    count,
    label: `الساعة ${hour}`,
  }))

  const dailyData = Object.entries(analytics.timeAnalysis.dailyActivity).map(([day, count]) => ({
    day,
    count,
    percentage: (count / analytics.basic.totalPosts) * 100,
  }))

  const sentimentData = Object.entries(analytics.contentAnalysis.sentimentAnalysis).map(([sentiment, count]) => ({
    name: text[sentiment as keyof typeof text] || sentiment,
    value: count,
    percentage: (count / analytics.basic.totalComments) * 100,
  }))

  const engagementTrendData = analytics.engagementAnalysis.engagementTrends.map((trend) => ({
    ...trend,
    total: trend.likes + trend.comments + trend.shares,
  }))

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-500" />
              <CardTitle className="text-2xl">{text.title}</CardTitle>
              <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                <Zap className="w-3 h-3 mr-1" />
                AI مدعوم
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 أيام</SelectItem>
                  <SelectItem value="30d">30 يوم</SelectItem>
                  <SelectItem value="90d">90 يوم</SelectItem>
                  <SelectItem value="1y">سنة</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engagement">{text.engagement}</SelectItem>
                  <SelectItem value="reach">{text.reach}</SelectItem>
                  <SelectItem value="growth">{text.growth}</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="w-4 h-4 mr-1" />
                {text.refresh}
              </Button>

              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="w-4 h-4 mr-1" />
                {text.export}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {text.overview}
          </TabsTrigger>
          <TabsTrigger value="time" className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {text.timeAnalysis}
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {text.contentAnalysis}
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {text.userAnalysis}
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {text.engagement}
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            {text.performance}
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {text.trends}
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-1">
            <Brain className="w-4 h-4" />
            {text.predictions}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{text.totalPosts}</p>
                    <p className="text-2xl font-bold">{analytics.basic.totalPosts.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+12% from last month</p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{text.engagementRate}</p>
                    <p className="text-2xl font-bold">{analytics.basic.engagementRate}%</p>
                    <p className="text-xs text-green-600">+5.2% from last week</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{text.totalUsers}</p>
                    <p className="text-2xl font-bold">{analytics.basic.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-blue-600">+8% monthly growth</p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">إجمالي المشاركات</p>
                    <p className="text-2xl font-bold">{analytics.basic.totalShares || 0}</p>
                    <p className="text-xs text-purple-600">معدل المشاركة</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Trend Chart */}
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Engagement Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={engagementTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="likes" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="comments" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Analysis Tab */}
        <TabsContent value="time" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hourly Activity */}
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Activity by Hour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Daily Activity */}
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Activity by Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dailyData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ day, percentage }) => `${day} ${percentage.toFixed(1)}%`}
                    >
                      {dailyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Peak Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle>{text.peakHours}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.timeAnalysis.peakHours.map((peak, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{peak.hour}:00</span>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={(peak.activity / analytics.timeAnalysis.peakHours[0].activity) * 100}
                          className="w-20"
                        />
                        <span className="text-sm text-gray-500">{peak.activity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle>{text.peakDays}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.timeAnalysis.peakDays.map((peak, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{peak.day}</span>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={(peak.activity / analytics.timeAnalysis.peakDays[0].activity) * 100}
                          className="w-20"
                        />
                        <span className="text-sm text-gray-500">{peak.activity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Analysis Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment Analysis */}
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  تحليل المشاعر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Reactions Breakdown */}
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  توزيع التفاعلات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.engagementAnalysis.reactionTypes).map(([type, count], index) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: colors[index % colors.length] }} />
                        <span className="text-sm font-medium">
                          {type === 'LIKE' ? '👍 إعجاب' : 
                           type === 'LOVE' ? '❤️ حب' : 
                           type === 'WOW' ? '😮 واو' : 
                           type === 'HAHA' ? '😂 ضحك' : 
                           type === 'SAD' ? '😢 حزن' : 
                           type === 'ANGRY' ? '😡 غضب' : 
                           type === 'CARE' ? '🤗 اهتمام' : type}
                        </span>
                      </div>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Analysis Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* Top Users */}
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Top Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">{/* Placeholder for Top Users Data */}</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          {/* Viral Content */}
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                المحتوى الأكثر تفاعلاً
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.engagementAnalysis.viralContent.map((content, index) => (
                  <div key={content.postId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="bg-purple-50">
                        <Award className="w-3 h-3 mr-1" />
                        #{index + 1}
                      </Badge>
                      <div className="text-right">
                        <Badge variant="secondary">{content.viralScore} نقطة</Badge>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{content.content}...</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>👍 {content.reactions}</span>
                      <span>💬 {content.comments}</span>
                      <span>🔄 {content.shares}</span>
                    </div>
                  </div>
                ))}
                {analytics.engagementAnalysis.viralContent.length === 0 && (
                  <p className="text-center text-gray-500 py-8">لا يوجد محتوى فيروسي حالياً</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* Placeholder for Performance Data */}
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          {/* Placeholder for Trends Data */}
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          {/* Placeholder for Predictions Data */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
