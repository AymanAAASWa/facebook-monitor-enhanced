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
  Star,
  FileText,
  BarChart3,
} from "lucide-react"
import type { AdvancedAnalytics } from "@/lib/advanced-analytics-service"
import { HTMLExportService } from "@/lib/html-export-service"

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

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onExport}>
                  <Download className="w-4 h-4 mr-1" />
                  تصدير JSON
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => HTMLExportService.downloadHTMLReport(analytics, 'تقرير-التحليلات-المتقدمة')}
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  تصدير HTML
                </Button>
              </div>
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
          {/* قسم تحليل التفاعلات المحسن */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              إحصائيات التفاعل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm">إجمالي التفاعلات:</span>
              <span className="font-bold text-blue-600">{analytics.engagementAnalysis?.totalEngagements || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">متوسط التفاعل/منشور:</span>
              <span className="font-bold text-green-600">{analytics.engagementAnalysis?.averageEngagementPerPost || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">المنشورات المتفاعلة:</span>
              <span className="font-bold text-purple-600">{analytics.engagementAnalysis?.postsWithEngagement || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">معدل المشاركة:</span>
              <span className="font-bold text-orange-600">{analytics.engagementAnalysis?.engagementPercentage || "0.0"}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              أنواع التفاعل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={Object.entries(analytics.engagementAnalysis?.reactionTypes || {}).map(([type, count]) => ({
                    name: type === "LIKE" ? "إعجاب" : 
                          type === "LOVE" ? "حب" :
                          type === "WOW" ? "إعجاب" :
                          type === "HAHA" ? "ضحك" :
                          type === "SAD" ? "حزن" :
                          type === "ANGRY" ? "غضب" :
                          type === "CARE" ? "اهتمام" : type,
                    value: count
                  })).filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {Object.entries(analytics.engagementAnalysis?.reactionTypes || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-green-500" />
              توزيع التفاعل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(analytics.engagementAnalysis?.engagementDistribution || {}).map(([range, count]) => (
              <div key={range} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{range} تفاعل</span>
                  <span className="font-semibold">{count} منشور</span>
                </div>
                <Progress 
                  value={analytics.basic?.totalPosts ? (count / analytics.basic.totalPosts) * 100 : 0} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* الشبكة الثانية - الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نشاط حسب الساعة */}
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {text.timeAnalysis}
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
                  توزيع التفاعلات - جميع الإيموجي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.engagementAnalysis.reactionTypes)
                    .filter(([type, count]) => count > 0)
                    .sort(([,a], [,b]) => b - a)
                    .map(([type, count], index) => {
                      const totalReactions = Object.values(analytics.engagementAnalysis.reactionTypes).reduce((sum, val) => sum + val, 0)
                      const percentage = totalReactions > 0 ? ((count / totalReactions) * 100).toFixed(1) : '0'
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: colors[index % colors.length] }} />
                              <span className="text-lg">
                                {type === 'LIKE' ? '👍' : 
                                 type === 'LOVE' ? '❤️' : 
                                 type === 'WOW' ? '😮' : 
                                 type === 'HAHA' ? '😂' : 
                                 type === 'SAD' ? '😢' : 
                                 type === 'ANGRY' ? '😡' : 
                                 type === 'CARE' ? '🤗' : 
                                 type === 'THANKFUL' ? '🙏' :
                                 type === 'PRIDE' ? '🌈' : '👍'}
                              </span>
                              <span className="text-sm font-medium">
                                {type === 'LIKE' ? 'إعجاب' : 
                                 type === 'LOVE' ? 'حب' : 
                                 type === 'WOW' ? 'واو' : 
                                 type === 'HAHA' ? 'ضحك' : 
                                 type === 'SAD' ? 'حزن' : 
                                 type === 'ANGRY' ? 'غضب' : 
                                 type === 'CARE' ? 'اهتمام' : 
                                 type === 'THANKFUL' ? 'شكر' :
                                 type === 'PRIDE' ? 'فخر' : type}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold">{count.toLocaleString()}</span>
                              <span className="text-xs text-gray-500 block">{percentage}%</span>
                            </div>
                          </div>
                          <Progress value={parseFloat(percentage)} className="h-2" />
                        </div>
                      )
                    })}
                  {Object.values(analytics.engagementAnalysis.reactionTypes).every(count => count === 0) && (
                    <p className="text-center text-gray-500 py-4">لم يتم العثور على تفاعلات حتى الآن</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Analysis Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Users */}
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  أكثر المستخدمين نشاطاً
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.userAnalysis.topUsers.slice(0, 10).map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-blue-50">
                          #{index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">معرف: {user.id.substring(0, 10)}...</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{user.totalActivity} نشاط</div>
                        <div className="text-xs text-gray-500">
                          {user.posts} منشور • {user.comments} تعليق
                        </div>
                        <Badge variant="secondary" className="mt-1">
                          تأثير: {user.influence.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {analytics.userAnalysis.topUsers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">لا توجد بيانات مستخدمين</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Segmentation */}
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  تصنيف المستخدمين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>نشط جداً (10+ أنشطة)</span>
                      <span className="font-bold text-green-600">{analytics.userAnalysis.userSegmentation.highlyActive}</span>
                    </div>
                    <Progress value={(analytics.userAnalysis.userSegmentation.highlyActive / (analytics.basic.totalUsers || 1)) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>نشط متوسط (3-10 أنشطة)</span>
                      <span className="font-bold text-blue-600">{analytics.userAnalysis.userSegmentation.moderatelyActive}</span>
                    </div>
<Progress value={(analytics.userAnalysis.userSegmentation.moderatelyActive / (analytics.basic.totalUsers || 1)) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>نشط قليل (1-2 أنشطة)</span>
                      <span className="font-bold text-orange-600">{analytics.userAnalysis.userSegmentation.lowActivity}</span>
                    </div>
                    <Progress value={(analytics.userAnalysis.userSegmentation.lowActivity / (analytics.basic.totalUsers || 1)) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>غير نشط</span>
                      <span className="font-bold text-gray-600">{analytics.userAnalysis.userSegmentation.inactive}</span>
                    </div>
                    <Progress value={(analytics.userAnalysis.userSegmentation.inactive / (analytics.basic.totalUsers || 1)) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demographics Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="text-lg">الفئات العمرية</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={Object.entries(analytics.userAnalysis.demographicAnalysis.ageGroups).map(([age, percentage]) => ({
                        name: age,
                        value: percentage
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {Object.entries(analytics.userAnalysis.demographicAnalysis.ageGroups).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="text-lg">التوزيع الجغرافي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.userAnalysis.demographicAnalysis.locations).map(([location, percentage]) => (
                    <div key={location} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{location}</span>
                        <span className="font-semibold">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="text-lg">اللغات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.userAnalysis.demographicAnalysis.languages).map(([language, percentage]) => (
                    <div key={language} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{language}</span>
                        <span className="font-semibold">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Best Performing Posts */}
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  أفضل المنشورات أداءً
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performanceAnalysis.bestPerformingPosts.slice(0, 5).map((post, index) => (
                    <div key={post.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="bg-green-50">
                          #{index + 1}
                        </Badge>
                        <Badge variant="secondary">{post.score.toFixed(1)} نقطة</Badge>
                      </div>
                      <p className="text-sm mb-2">{post.content}...</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>📈 {post.engagement} تفاعل</span>
                        <span>👁️ {post.reach} وصول</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Optimization */}
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle>توصيات التحسين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performanceAnalysis.contentOptimization.recommendedActions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{action.action}</p>
                        <Badge 
                          variant={action.priority === "عالي" ? "destructive" : action.priority === "متوسط" ? "secondary" : "outline"}
                          className="mt-1"
                        >
                          {action.priority}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <Progress value={action.impact} className="w-16 mb-1" />
                        <span className="text-xs text-gray-500">{action.impact}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                المواضيع الرائجة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.trendAnalysis.trendingTopics.map((topic, index) => (
                  <div key={topic.topic} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <span className="font-medium">{topic.topic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{topic.mentions} ذكر</span>
                      <Badge variant={topic.growth > 50 ? "destructive" : "secondary"}>
                        +{topic.growth.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
                {analytics.trendAnalysis.trendingTopics.length === 0 && (
                  <p className="text-center text-gray-500 py-8">لا توجد اتجاهات واضحة حالياً</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Growth Predictions */}
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  توقعات النمو
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.predictiveAnalysis.growthPrediction).map(([period, value]) => (
                    <div key={period} className="flex items-center justify-between">
                      <span className="font-medium">{period}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={Math.min((value / 1000) * 100, 100)} className="w-20" />
                        <span className="text-sm font-bold">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Analysis */}
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  تحليل المخاطر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">مخاطر المحتوى</h4>
                    {analytics.predictiveAnalysis.riskAnalysis.contentRisks.map((risk, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded mb-2">
                        <span className="text-sm">{risk.risk}</span>
                        <Badge variant={risk.probability > 50 ? "destructive" : "outline"}>
                          {risk.probability}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">مخاطر التفاعل</h4>
                    {analytics.predictiveAnalysis.riskAnalysis.engagementRisks.map((risk, index) => (
                      <div key={index} className="p-2 border rounded mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{risk.risk}</span>
                          <Badge variant={risk.likelihood > 40 ? "destructive" : "secondary"}>
                            {risk.likelihood}%
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">{risk.mitigation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}