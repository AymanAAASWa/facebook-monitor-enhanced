"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Map,
  Home,
  Settings,
  Users,
  FileText,
  BarChart3,
  Search,
  ArrowRight,
  ExternalLink,
  Star,
  Navigation,
  Compass,
  Route,
} from "lucide-react"

interface SiteMapViewerProps {
  darkMode: boolean
  language: "ar" | "en"
  onNavigate?: (path: string) => void
}

export function SiteMapViewer({ darkMode, language, onNavigate }: SiteMapViewerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])

  const siteStructure = {
    main: [
      {
        path: "/",
        name: "الصفحة الرئيسية",
        icon: Home,
        description: "نقطة البداية - لوحة التحكم الرئيسية",
        category: "أساسي",
        popular: true,
      },
      {
        path: "/dashboard",
        name: "لوحة التحكم",
        icon: BarChart3,
        description: "إحصائيات شاملة ومراجعة سريعة",
        category: "أساسي",
        popular: true,
      },
      {
        path: "/posts",
        name: "المنشورات",
        icon: FileText,
        description: "عرض وإدارة جميع المنشورات",
        category: "محتوى",
        popular: true,
      },
      {
        path: "/users",
        name: "المستخدمون",
        icon: Users,
        description: "إدارة المستخدمين والبحث عن الأرقام",
        category: "بيانات",
        popular: true,
      },
    ],
    auth: [
      {
        path: "/auth/login",
        name: "تسجيل الدخول",
        icon: Users,
        description: "تسجيل الدخول بالبريد أو Facebook",
        category: "توثيق",
      },
      {
        path: "/auth/register",
        name: "إنشاء حساب",
        icon: Users,
        description: "إنشاء حساب جديد",
        category: "توثيق",
      },
    ],
    analytics: [
      {
        path: "/analytics",
        name: "التحليلات",
        icon: BarChart3,
        description: "تحليلات مفصلة ورسوم بيانية",
        category: "تحليلات",
        popular: true,
      },
      {
        path: "/advanced-analytics",
        name: "التحليلات المتقدمة",
        icon: BarChart3,
        description: "تحليلات معقدة وذكاء اصطناعي",
        category: "تحليلات",
      },
      {
        path: "/sentiment-analysis",
        name: "تحليل المشاعر",
        icon: BarChart3,
        description: "تحليل مشاعر التعليقات والمنشورات",
        category: "تحليلات",
      },
    ],
    content: [
      {
        path: "/comments",
        name: "التعليقات",
        icon: FileText,
        description: "إدارة والرد على التعليقات",
        category: "محتوى",
      },
      {
        path: "/pages",
        name: "الصفحات",
        icon: FileText,
        description: "متابعة وتحليل الصفحات",
        category: "محتوى",
      },
      {
        path: "/groups",
        name: "المجموعات",
        icon: Users,
        description: "مراقبة المجموعات والأعضاء",
        category: "محتوى",
      },
    ],
    settings: [
      {
        path: "/settings",
        name: "الإعدادات العامة",
        icon: Settings,
        description: "إعدادات التطبيق والحساب",
        category: "إعدادات",
      },
      {
        path: "/settings/facebook",
        name: "إعدادات Facebook",
        icon: Settings,
        description: "إعداد Facebook API والصلاحيات",
        category: "إعدادات",
        important: true,
      },
      {
        path: "/phone-database",
        name: "قاعدة بيانات الأرقام",
        icon: Settings,
        description: "تحميل وإدارة ملفات الأرقام",
        category: "إعدادات",
        important: true,
      },
    ],
    enhanced: [
      {
        path: "/enhanced-data",
        name: "البيانات المحسنة",
        icon: BarChart3,
        description: "عرض البيانات المحسنة مع فلاتر متقدمة",
        category: "متقدم",
        popular: true,
      },
      {
        path: "/auto-collection",
        name: "التجميع التلقائي",
        icon: Settings,
        description: "أتمتة جمع البيانات وجدولة المهام",
        category: "متقدم",
      },
    ],
    reports: [
      {
        path: "/reports",
        name: "التقارير",
        icon: FileText,
        description: "إنشاء وتصدير التقارير",
        category: "تقارير",
      },
      {
        path: "/export",
        name: "التصدير والنسخ الاحتياطي",
        icon: FileText,
        description: "تصدير البيانات والنسخ الاحتياطي",
        category: "تقارير",
      },
    ],
    help: [
      {
        path: "/docs",
        name: "التوثيق",
        icon: FileText,
        description: "دليل المستخدم والتوثيق الفني",
        category: "مساعدة",
      },
      {
        path: "/support",
        name: "الدعم الفني",
        icon: FileText,
        description: "تذاكر الدعم والمساعدة",
        category: "مساعدة",
      },
    ],
  }

  const quickPaths = [
    {
      name: "المسار السريع للمبتدئين",
      description: "للبدء مع التطبيق لأول مرة",
      steps: [
        { path: "/", name: "الصفحة الرئيسية" },
        { path: "/auth/login", name: "تسجيل الدخول" },
        { path: "/settings/facebook", name: "إعداد Facebook API" },
        { path: "/phone-database", name: "تحميل قاعدة الأرقام" },
        { path: "/posts", name: "بدء المراقبة" },
      ],
    },
    {
      name: "المسار اليومي للمستخدم المتقدم",
      description: "للاستخدام اليومي والمراجعة",
      steps: [
        { path: "/dashboard", name: "مراجعة الإحصائيات" },
        { path: "/posts", name: "المنشورات الجديدة" },
        { path: "/comments", name: "الرد على التعليقات" },
        { path: "/analytics", name: "مراجعة التحليلات" },
        { path: "/reports", name: "إنشاء التقارير" },
      ],
    },
    {
      name: "مسار التحليل المتقدم",
      description: "للتحليل العميق والبيانات المتقدمة",
      steps: [
        { path: "/enhanced-data", name: "البيانات المحسنة" },
        { path: "/advanced-analytics", name: "التحليل العميق" },
        { path: "/sentiment-analysis", name: "تحليل المشاعر" },
        { path: "/reports", name: "التقارير المخصصة" },
      ],
    },
  ]

  const allPages = Object.values(siteStructure).flat()
  const filteredPages = allPages.filter(
    (page) =>
      page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleFavorite = (path: string) => {
    setFavorites((prev) => (prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]))
  }

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      // في حالة عدم وجود دالة التنقل، يمكن استخدام window.location
      console.log(`Navigate to: ${path}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              خريطة الموقع التفاعلية
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{allPages.length} صفحة</Badge>
              <Badge variant="secondary">{favorites.length} مفضلة</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="البحث في الصفحات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="structure" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="structure" className="flex items-center gap-2">
            <Compass className="w-4 h-4" />
            هيكل الموقع
          </TabsTrigger>
          <TabsTrigger value="quick-paths" className="flex items-center gap-2">
            <Route className="w-4 h-4" />
            المسارات السريعة
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            المفضلة
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            البحث
          </TabsTrigger>
        </TabsList>

        {/* Site Structure */}
        <TabsContent value="structure" className="space-y-6">
          {Object.entries(siteStructure).map(([section, pages]) => (
            <Card key={section} className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
              <CardHeader>
                <CardTitle className="text-lg capitalize">
                  {section === "main" && "الصفحات الرئيسية"}
                  {section === "auth" && "التوثيق"}
                  {section === "analytics" && "التحليلات"}
                  {section === "content" && "المحتوى"}
                  {section === "settings" && "الإعدادات"}
                  {section === "enhanced" && "الميزات المتقدمة"}
                  {section === "reports" && "التقارير"}
                  {section === "help" && "المساعدة"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pages.map((page) => (
                    <div
                      key={page.path}
                      className={`p-4 rounded-lg border ${
                        darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
                      } hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <page.icon className="w-5 h-5 text-blue-500" />
                          <h3 className="font-semibold">{page.name}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          {page.popular && <Badge variant="secondary">شائع</Badge>}
                          {page.important && <Badge variant="destructive">مهم</Badge>}
                          <Button variant="ghost" size="sm" onClick={() => toggleFavorite(page.path)} className="p-1">
                            <Star
                              className={`w-4 h-4 ${
                                favorites.includes(page.path) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{page.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{page.category}</Badge>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{page.path}</code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNavigate(page.path)}
                            className="flex items-center gap-1"
                          >
                            <ArrowRight className="w-3 h-3" />
                            انتقال
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Quick Paths */}
        <TabsContent value="quick-paths" className="space-y-4">
          {quickPaths.map((path, index) => (
            <Card key={index} className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="w-5 h-5" />
                  {path.name}
                </CardTitle>
                <p className="text-sm text-gray-600">{path.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {path.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNavigate(step.path)}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                          {stepIndex + 1}
                        </span>
                        {step.name}
                      </Button>
                      {stepIndex < path.steps.length - 1 && <ArrowRight className="w-4 h-4 text-gray-400" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Favorites */}
        <TabsContent value="favorites" className="space-y-4">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allPages
                .filter((page) => favorites.includes(page.path))
                .map((page) => (
                  <Card key={page.path} className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <page.icon className="w-5 h-5 text-blue-500" />
                          <h3 className="font-semibold">{page.name}</h3>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => toggleFavorite(page.path)} className="p-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{page.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{page.category}</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNavigate(page.path)}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          فتح
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
              <CardContent className="p-8 text-center">
                <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">لا توجد صفحات مفضلة</h3>
                <p className="text-gray-600 mb-4">اضغط على النجمة بجانب أي صفحة لإضافتها للمفضلة</p>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  تصفح جميع الصفحات
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Search Results */}
        <TabsContent value="search" className="space-y-4">
          {searchTerm ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5" />
                <span>نتائج البحث عن: "{searchTerm}"</span>
                <Badge variant="outline">{filteredPages.length} نتيجة</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPages.map((page) => (
                  <Card key={page.path} className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <page.icon className="w-5 h-5 text-blue-500" />
                          <h3 className="font-semibold">{page.name}</h3>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => toggleFavorite(page.path)} className="p-1">
                          <Star
                            className={`w-4 h-4 ${
                              favorites.includes(page.path) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                            }`}
                          />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{page.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{page.category}</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNavigate(page.path)}
                          className="flex items-center gap-1"
                        >
                          <ArrowRight className="w-3 h-3" />
                          انتقال
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
              <CardContent className="p-8 text-center">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">ابحث في صفحات الموقع</h3>
                <p className="text-gray-600 mb-4">استخدم مربع البحث أعلاه للعثور على الصفحة المطلوبة</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["المنشورات", "المستخدمون", "التحليلات", "الإعدادات"].map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchTerm(term)}
                      className="text-sm"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Access Footer */}
      <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              <span className="font-semibold">الوصول السريع</span>
            </div>
            <div className="flex items-center gap-2">
              {[
                { path: "/", name: "الرئيسية", icon: Home },
                { path: "/dashboard", name: "لوحة التحكم", icon: BarChart3 },
                { path: "/posts", name: "المنشورات", icon: FileText },
                { path: "/settings", name: "الإعدادات", icon: Settings },
              ].map((item) => (
                <Button
                  key={item.path}
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigate(item.path)}
                  className="flex items-center gap-1"
                >
                  <item.icon className="w-3 h-3" />
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
