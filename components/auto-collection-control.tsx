"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Pause,
  Database,
  Clock,
  Activity,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Users,
  Building,
  MessageCircle,
} from "lucide-react"
import { autoDataCollector } from "@/lib/auto-data-collector"
import { firebaseEnhancedService } from "@/lib/firebase-enhanced-service"

interface AutoCollectionControlProps {
  darkMode: boolean
  language: "ar" | "en"
}

export function AutoCollectionControl({ darkMode, language }: AutoCollectionControlProps) {
  const [isCollecting, setIsCollecting] = useState(false)
  const [collectionInterval, setCollectionInterval] = useState(30)
  const [autoStart, setAutoStart] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)
  const [lastCollection, setLastCollection] = useState<Date | null>(null)

  const t = {
    ar: {
      title: "جمع البيانات التلقائي",
      status: "الحالة",
      active: "نشط",
      inactive: "غير نشط",
      interval: "فترة الجمع",
      minutes: "دقيقة",
      autoStart: "بدء تلقائي",
      startCollection: "بدء الجمع",
      stopCollection: "إيقاف الجمع",
      lastCollection: "آخر جمع",
      never: "لم يتم",
      settings: "الإعدادات",
      analytics: "الإحصائيات",
      totalUsers: "إجمالي المستخدمين",
      totalPages: "إجمالي الصفحات",
      totalGroups: "إجمالي المجموعات",
      totalComments: "إجمالي التعليقات",
      collectionProgress: "تقدم الجمع",
      nextCollection: "الجمع التالي",
      collectionHistory: "تاريخ الجمع",
      dataQuality: "جودة البيانات",
      excellent: "ممتاز",
      good: "جيد",
      fair: "مقبول",
      poor: "ضعيف",
    },
    en: {
      title: "Auto Data Collection",
      status: "Status",
      active: "Active",
      inactive: "Inactive",
      interval: "Collection Interval",
      minutes: "minutes",
      autoStart: "Auto Start",
      startCollection: "Start Collection",
      stopCollection: "Stop Collection",
      lastCollection: "Last Collection",
      never: "Never",
      settings: "Settings",
      analytics: "Analytics",
      totalUsers: "Total Users",
      totalPages: "Total Pages",
      totalGroups: "Total Groups",
      totalComments: "Total Comments",
      collectionProgress: "Collection Progress",
      nextCollection: "Next Collection",
      collectionHistory: "Collection History",
      dataQuality: "Data Quality",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
    },
  }

  const text = t[language]

  useEffect(() => {
    loadSettings()
    loadAnalytics()

    // تحديث الحالة كل 10 ثوان
    const statusInterval = setInterval(() => {
      const status = autoDataCollector.getCollectionStatus()
      setIsCollecting(status.isCollecting)
    }, 10000)

    return () => clearInterval(statusInterval)
  }, [])

  const loadSettings = () => {
    const settings = JSON.parse(localStorage.getItem("auto_collection_settings") || "{}")
    setCollectionInterval(settings.interval || 30)
    setAutoStart(settings.autoStart || false)
    setLastCollection(settings.lastCollection ? new Date(settings.lastCollection) : null)

    // بدء الجمع التلقائي إذا كان مفعلاً
    if (settings.autoStart && !autoDataCollector.getCollectionStatus().isCollecting) {
      handleStartCollection()
    }
  }

  const saveSettings = () => {
    const settings = {
      interval: collectionInterval,
      autoStart: autoStart,
      lastCollection: lastCollection?.toISOString(),
    }
    localStorage.setItem("auto_collection_settings", JSON.stringify(settings))
  }

  const loadAnalytics = async () => {
    try {
      const analyticsData = await firebaseEnhancedService.getAnalyticsSummary()
      setAnalytics(analyticsData)
    } catch (error) {
      console.error("Error loading analytics:", error)
    }
  }

  const handleStartCollection = () => {
    autoDataCollector.startAutoCollection(collectionInterval)
    setIsCollecting(true)
    setLastCollection(new Date())
    saveSettings()
  }

  const handleStopCollection = () => {
    autoDataCollector.stopAutoCollection()
    setIsCollecting(false)
    saveSettings()
  }

  const handleIntervalChange = (value: string) => {
    setCollectionInterval(Number(value))
    saveSettings()

    // إعادة تشغيل الجمع بالفترة الجديدة إذا كان نشطاً
    if (isCollecting) {
      handleStopCollection()
      setTimeout(() => handleStartCollection(), 1000)
    }
  }

  const getDataQuality = () => {
    if (!analytics) return { level: "poor", percentage: 0 }

    const totalData = analytics.total_users + analytics.total_pages + analytics.total_groups
    const activeData = analytics.active_users + analytics.verified_pages

    if (totalData === 0) return { level: "poor", percentage: 0 }

    const percentage = (activeData / totalData) * 100

    if (percentage >= 80) return { level: "excellent", percentage }
    if (percentage >= 60) return { level: "good", percentage }
    if (percentage >= 40) return { level: "fair", percentage }
    return { level: "poor", percentage }
  }

  const dataQuality = getDataQuality()

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            {text.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status and Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{text.status}:</span>
                <Badge variant={isCollecting ? "default" : "secondary"} className="flex items-center gap-1">
                  {isCollecting ? <Activity className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  {isCollecting ? text.active : text.inactive}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">{text.interval}:</span>
                <Select value={collectionInterval.toString()} onValueChange={handleIntervalChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 {text.minutes}</SelectItem>
                    <SelectItem value="30">30 {text.minutes}</SelectItem>
                    <SelectItem value="60">60 {text.minutes}</SelectItem>
                    <SelectItem value="120">120 {text.minutes}</SelectItem>
                    <SelectItem value="240">240 {text.minutes}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">{text.autoStart}:</span>
                <Switch
                  checked={autoStart}
                  onCheckedChange={(checked) => {
                    setAutoStart(checked)
                    saveSettings()
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{text.lastCollection}:</span>
                <span className="text-sm text-gray-500">
                  {lastCollection ? lastCollection.toLocaleString(language === "ar" ? "ar-EG" : "en-US") : text.never}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">{text.dataQuality}:</span>
                <Badge
                  variant="outline"
                  className={`${
                    dataQuality.level === "excellent"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : dataQuality.level === "good"
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : dataQuality.level === "fair"
                          ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                          : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  {text[dataQuality.level as keyof typeof text]} ({dataQuality.percentage.toFixed(0)}%)
                </Badge>
              </div>

              <Progress value={dataQuality.percentage} className="w-full" />
            </div>

            <div className="flex flex-col gap-2">
              {isCollecting ? (
                <Button onClick={handleStopCollection} variant="destructive" className="flex items-center gap-2">
                  <Pause className="w-4 h-4" />
                  {text.stopCollection}
                </Button>
              ) : (
                <Button onClick={handleStartCollection} className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  {text.startCollection}
                </Button>
              )}

              <Button variant="outline" onClick={loadAnalytics} className="flex items-center gap-2 bg-transparent">
                <BarChart3 className="w-4 h-4" />
                تحديث الإحصائيات
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{analytics.total_users}</p>
              <p className="text-sm text-gray-500">{text.totalUsers}</p>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  نشط: {analytics.active_users}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardContent className="p-4 text-center">
              <Building className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{analytics.total_pages}</p>
              <p className="text-sm text-gray-500">{text.totalPages}</p>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  موثق: {analytics.verified_pages}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{analytics.total_groups}</p>
              <p className="text-sm text-gray-500">{text.totalGroups}</p>
            </CardContent>
          </Card>

          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{analytics.total_comments}</p>
              <p className="text-sm text-gray-500">{text.totalComments}</p>
              <div className="mt-2">
                <Badge variant="destructive" className="text-xs">
                  غير مجاب: {analytics.unresponded_comments}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Collection Progress */}
      {isCollecting && (
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {text.collectionProgress}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>الجمع التالي خلال:</span>
                <Badge variant="outline">
                  {collectionInterval} {text.minutes}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>تقدم الجمع الحالي</span>
                  <span>جاري العمل...</span>
                </div>
                <Progress value={75} className="w-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>المستخدمون: مكتمل</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500 animate-spin" />
                  <span>الصفحات: جاري...</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <span>المجموعات: في الانتظار</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
