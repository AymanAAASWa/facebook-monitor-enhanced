"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, UsersIcon, MessageCircle, FileText, Clock, Calendar, ImageIcon, Video, Star } from "lucide-react"

interface AnalyticsDashboardProps {
  data: {
    totalPosts: number
    totalComments: number
    totalUsers: number
    sourceCounts: { [key: string]: number }
    topUsers: Array<{ id: string; name: string; activity: number }>
  }
  darkMode: boolean
  language: "ar" | "en"
}

export function AnalyticsDashboard({ data, darkMode, language }: AnalyticsDashboardProps) {
  const t = {
    ar: {
      analytics: "التحليلات",
      overview: "نظرة عامة",
      totalPosts: "إجمالي المنشورات",
      totalComments: "إجمالي التعليقات",
      totalUsers: "إجمالي المستخدمين",
      topUsers: "أكثر المستخدمين نشاطاً",
      activityByHour: "النشاط حسب الساعة",
      activityByDay: "النشاط حسب اليوم",
      sourceDistribution: "توزيع المصادر",
      mediaStats: "إحصائيات الوسائط",
      images: "الصور",
      videos: "الفيديوهات",
      totalMedia: "إجمالي الوسائط",
      activity: "النشاط",
      posts: "منشورات",
      comments: "تعليقات",
      noData: "لا توجد بيانات للعرض",
    },
    en: {
      analytics: "Analytics",
      overview: "Overview",
      totalPosts: "Total Posts",
      totalComments: "Total Comments",
      totalUsers: "Total Users",
      topUsers: "Top Active Users",
      activityByHour: "Activity by Hour",
      activityByDay: "Activity by Day",
      sourceDistribution: "Source Distribution",
      mediaStats: "Media Statistics",
      images: "Images",
      videos: "Videos",
      totalMedia: "Total Media",
      activity: "Activity",
      posts: "Posts",
      comments: "Comments",
      noData: "No data to display",
    },
  }

  const text = t[language]

  const hourlyData = Object.entries(data.activityByHour || {}).map(([hour, count]) => ({
    hour: `${hour}:00`,
    count,
  }))

  const dailyData = Object.entries(data.activityByDay || {}).map(([day, count]) => ({
    day,
    count,
  }))

  const sourceData = Object.entries(data.sourceCounts || {}).map(([source, count]) => ({
    name: source,
    value: count,
  }))

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"]

  if (!data || (data.totalPosts === 0 && data.totalComments === 0 && data.totalUsers === 0)) {
    return (
      <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
        <CardContent className="p-8 text-center">
          <BarChart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">{text.noData}</h3>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{text.totalPosts}</p>
                <p className="text-2xl font-bold">{data.totalPosts}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{text.totalComments}</p>
                <p className="text-2xl font-bold">{data.totalComments}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{text.totalUsers}</p>
                <p className="text-2xl font-bold">{data.totalUsers}</p>
              </div>
              <UsersIcon className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{text.totalMedia}</p>
                <p className="text-2xl font-bold">{data.mediaStats?.totalMedia || 0}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity by Hour */}
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {text.activityByHour}
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

        {/* Activity by Day */}
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {text.activityByDay}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Users */}
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              {text.topUsers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topUsers?.slice(0, 5).map((user, index) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <span className="font-medium text-sm">{user.name}</span>
                  </div>
                  <Badge variant="secondary">{user.activity}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Source Distribution */}
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {text.sourceDistribution}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Media Statistics */}
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              {text.mediaStats}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{text.images}</span>
                  </div>
                  <span className="font-medium">{data.mediaStats?.images || 0}</span>
                </div>
                <Progress
                  value={
                    data.mediaStats?.totalMedia ? ((data.mediaStats.images || 0) / data.mediaStats.totalMedia) * 100 : 0
                  }
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{text.videos}</span>
                  </div>
                  <span className="font-medium">{data.mediaStats?.videos || 0}</span>
                </div>
                <Progress
                  value={
                    data.mediaStats?.totalMedia ? ((data.mediaStats.videos || 0) / data.mediaStats.totalMedia) * 100 : 0
                  }
                  className="h-2"
                />
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{text.totalMedia}</span>
                  <span className="font-bold">{data.mediaStats?.totalMedia || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
