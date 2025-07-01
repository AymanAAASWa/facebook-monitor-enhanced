"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  FileText,
  BookOpen,
  Map,
  FolderTree,
  Eye,
  Copy,
  CheckCircle,
  Loader2,
  ExternalLink,
  Settings,
  Users,
  BarChart3,
  MessageCircle,
} from "lucide-react"

interface DocumentationExportProps {
  darkMode: boolean
  language: "ar" | "en"
}

export function DocumentationExport({ darkMode, language }: DocumentationExportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportedFiles, setExportedFiles] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const t = {
    ar: {
      title: "تصدير التوثيق",
      description: "تصدير دليل المستخدم والتوثيق الفني",
      userGuide: "دليل المستخدم",
      siteMap: "خريطة الموقع",
      fileStructure: "خريطة الملفات",
      apiDocs: "توثيق API",
      exportPDF: "تصدير PDF",
      exportTXT: "تصدير نص",
      exportHTML: "تصدير HTML",
      preview: "معاينة",
      exporting: "جاري التصدير...",
      exported: "تم التصدير",
      copy: "نسخ",
      miniPreview: "معاينة مصغرة",
      currentInterface: "الواجهة الحالية",
    },
    en: {
      title: "Export Documentation",
      description: "Export user guide and technical documentation",
      userGuide: "User Guide",
      siteMap: "Site Map",
      fileStructure: "File Structure",
      apiDocs: "API Documentation",
      exportPDF: "Export PDF",
      exportTXT: "Export TXT",
      exportHTML: "Export HTML",
      preview: "Preview",
      exporting: "Exporting...",
      exported: "Exported",
      copy: "Copy",
      miniPreview: "Mini Preview",
      currentInterface: "Current Interface",
    },
  }

  const text = t[language]

  const documentSections = [
    {
      id: "user-guide",
      title: text.userGuide,
      icon: BookOpen,
      description: "دليل شامل لاستخدام مراقب فيسبوك المتقدم",
      content: `# دليل المستخدم - مراقب فيسبوك المتقدم

## 🚀 البدء السريع

### 1. إعداد Facebook API
- انتقل إلى الإعدادات
- أدخل Facebook Access Token
- اختبر الاتصال

### 2. تحميل قاعدة بيانات الأرقام
- اذهب لقسم "قاعدة بيانات الأرقام"
- حمل ملف CSV أو JSON
- انتظر اكتمال الفهرسة

### 3. بدء المراقبة
- أضف مصادر المراقبة (صفحات/مجموعات)
- اضبط إعدادات التحديث
- ابدأ جمع البيانات

## 📊 استخدام التحليلات

### التحليلات الأساسية
- عرض الإحصائيات العامة
- تتبع نمو المتابعين
- مراقبة معدل التفاعل

### التحليلات المتقدمة
- تحليل المشاعر
- اكتشاف الاتجاهات
- التنبؤ بالأداء

## 🔍 البحث والفلترة

### البحث في المنشورات
- استخدم مربع البحث
- فلتر حسب التاريخ
- فلتر حسب المصدر

### البحث عن الأرقام
- اضغط على أيقونة الهاتف
- انتظر نتائج البحث
- انسخ الرقم المكتشف

## 📱 الميزات المتقدمة

### التجميع التلقائي
- جدولة التحديثات
- قواعد التجميع الذكية
- التنبيهات التلقائية

### البيانات المحسنة
- معلومات مفصلة عن المستخدمين
- تاريخ النشاط
- الروابط الاجتماعية`,
    },
    {
      id: "site-map",
      title: text.siteMap,
      icon: Map,
      description: "خريطة تفاعلية لجميع صفحات الموقع",
      content: `# خريطة الموقع

## الصفحات الرئيسية
- / - الصفحة الرئيسية
- /dashboard - لوحة التحكم
- /posts - المنشورات
- /users - المستخدمون

## التحليلات
- /analytics - التحليلات الأساسية
- /advanced-analytics - التحليلات المتقدمة
- /sentiment-analysis - تحليل المشاعر

## الإعدادات
- /settings - الإعدادات العامة
- /settings/facebook - إعدادات Facebook
- /phone-database - قاعدة بيانات الأرقام`,
    },
    {
      id: "file-structure",
      title: text.fileStructure,
      icon: FolderTree,
      description: "هيكل الملفات والمجلدات في المشروع",
      content: `# هيكل الملفات

## app/
- page.tsx - الصفحة الرئيسية
- layout.tsx - تخطيط التطبيق
- globals.css - التنسيقات العامة

## components/
- facebook-monitor.tsx - مراقب Facebook
- analytics-dashboard.tsx - لوحة التحليلات
- user-table.tsx - جدول المستخدمين

## lib/
- firebase-service.ts - خدمات Firebase
- facebook-service.ts - خدمات Facebook
- phone-search-service.ts - البحث عن الأرقام`,
    },
  ]

  const exportDocument = async (format: string, sectionId: string) => {
    setIsExporting(true)

    // محاكاة عملية التصدير
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const section = documentSections.find((s) => s.id === sectionId)
    if (!section) return

    const filename = `${section.title.replace(/\s+/g, "-")}.${format}`

    if (format === "txt") {
      const blob = new Blob([section.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } else if (format === "html") {
      const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${section.title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #333; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <div>${section.content
      .replace(/\n/g, "<br>")
      .replace(/#{1,6}\s/g, "<h3>")
      .replace(/<h3>/g, "</h3><h3>")
      .replace(/^<\/h3>/, "")}</div>
</body>
</html>`
      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }

    setExportedFiles((prev) => [...prev, filename])
    setIsExporting(false)
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  // واجهة مصغرة للتوضيح
  const MiniInterfacePreview = () => (
    <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
      <div className="text-xs text-gray-600 mb-2">{text.currentInterface}</div>

      {/* Header مصغر */}
      <div className="bg-white dark:bg-gray-800 rounded-md p-2 mb-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs">FB</span>
            </div>
            <span className="text-sm font-semibold">مراقب فيسبوك</span>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Navigation مصغر */}
      <div className="bg-white dark:bg-gray-800 rounded-md p-2 mb-2 shadow-sm">
        <div className="flex gap-1">
          {[
            { icon: BarChart3, name: "لوحة التحكم", active: true },
            { icon: FileText, name: "المنشورات", active: false },
            { icon: Users, name: "المستخدمون", active: false },
            { icon: Settings, name: "الإعدادات", active: false },
          ].map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                item.active ? "bg-blue-100 text-blue-700" : "text-gray-600"
              }`}
            >
              <item.icon className="w-3 h-3" />
              <span className="hidden sm:inline">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content مصغر */}
      <div className="bg-white dark:bg-gray-800 rounded-md p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-blue-50 p-2 rounded text-center">
            <div className="text-lg font-bold text-blue-600">1,234</div>
            <div className="text-xs text-gray-600">منشورات</div>
          </div>
          <div className="bg-green-50 p-2 rounded text-center">
            <div className="text-lg font-bold text-green-600">567</div>
            <div className="text-xs text-gray-600">مستخدمين</div>
          </div>
        </div>

        {/* منشور مصغر */}
        <div className="border rounded p-2 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="text-xs font-semibold">أحمد محمد</div>
            <Badge variant="outline" className="text-xs">
              <MessageCircle className="w-2 h-2 mr-1" />5
            </Badge>
          </div>
          <div className="text-xs text-gray-600 mb-1">هذا مثال على منشور من فيسبوك مع التعليقات والتفاعلات...</div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-5 text-xs">
              <Eye className="w-2 h-2 mr-1" />
              عرض
            </Button>
            <Button variant="ghost" size="sm" className="h-5 text-xs">
              <MessageCircle className="w-2 h-2 mr-1" />
              تعليقات
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            {text.title}
          </CardTitle>
          <p className="text-sm text-gray-600">{text.description}</p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">التوثيق</TabsTrigger>
          <TabsTrigger value="preview">{text.miniPreview}</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {documentSections.map((section) => (
            <Card key={section.id} className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <section.icon className="w-5 h-5" />
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {exportedFiles.some((f) => f.includes(section.title.replace(/\s+/g, "-"))) && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {text.exported}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{section.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportDocument("pdf", section.id)}
                    disabled={isExporting}
                    className="flex items-center gap-1"
                  >
                    {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                    {text.exportPDF}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportDocument("txt", section.id)}
                    disabled={isExporting}
                    className="flex items-center gap-1"
                  >
                    {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
                    {text.exportTXT}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportDocument("html", section.id)}
                    disabled={isExporting}
                    className="flex items-center gap-1"
                  >
                    {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <ExternalLink className="w-3 h-3" />}
                    {text.exportHTML}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(section.content)}
                    className="flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    {text.copy}
                  </Button>
                </div>

                {showPreview && (
                  <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap">{section.content.substring(0, 500)}...</pre>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  {text.preview}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {text.miniPreview}
              </CardTitle>
              <p className="text-sm text-gray-600">معاينة مصغرة للواجهة الحالية للمشروع</p>
            </CardHeader>
            <CardContent>
              <MiniInterfacePreview />

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">ملاحظات التصميم:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• الواجهة تدعم الوضع المظلم والفاتح</li>
                  <li>• التصميم متجاوب مع جميع أحجام الشاشات</li>
                  <li>• استخدام أيقونات Lucide React</li>
                  <li>• نظام ألوان متسق مع Tailwind CSS</li>
                  <li>• مكونات shadcn/ui للواجهة</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {exportedFiles.length > 0 && (
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              الملفات المُصدرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exportedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{file}</span>
                  <Badge variant="secondary">تم</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
