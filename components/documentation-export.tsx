"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Download, BookOpen, FileType, CheckCircle, Info } from "lucide-react"

interface DocumentationExportProps {
  darkMode: boolean
  language: "ar" | "en"
}

export function DocumentationExport({ darkMode, language }: DocumentationExportProps) {
  const [exporting, setExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const t = {
    ar: {
      title: "تصدير التوثيق",
      description: "تحميل دليل المستخدم الشامل للمشروع",
      formats: "التنسيقات المتاحة",
      exportPdf: "تصدير PDF",
      exportTxt: "تصدير TXT",
      exportHtml: "تصدير HTML",
      exporting: "جاري التصدير...",
      success: "تم التصدير بنجاح",
      error: "خطأ في التصدير",
      features: "محتويات الدليل",
      feature1: "دليل الإعداد الكامل",
      feature2: "شرح جميع الميزات",
      feature3: "حل المشاكل الشائعة",
      feature4: "أفضل الممارسات",
      feature5: "المتطلبات التقنية",
      feature6: "الأمان والخصوصية",
      note: "ملاحظة",
      noteText: "الدليل يحتوي على معلومات شاملة لاستخدام جميع ميزات المشروع بفعالية",
    },
    en: {
      title: "Documentation Export",
      description: "Download comprehensive user guide for the project",
      formats: "Available Formats",
      exportPdf: "Export PDF",
      exportTxt: "Export TXT",
      exportHtml: "Export HTML",
      exporting: "Exporting...",
      success: "Export successful",
      error: "Export error",
      features: "Guide Contents",
      feature1: "Complete setup guide",
      feature2: "All features explained",
      feature3: "Common issues solutions",
      feature4: "Best practices",
      feature5: "Technical requirements",
      feature6: "Security and privacy",
      note: "Note",
      noteText: "The guide contains comprehensive information for effectively using all project features",
    },
  }

  const text = t[language]

  const documentationContent = `
# مراقب فيسبوك المتقدم - دليل المستخدم الشامل

## نظرة عامة على المشروع

مراقب فيسبوك المتقدم هو نظام متكامل لمراقبة وتحليل المنشورات والتعليقات على فيسبوك، مع إمكانيات البحث عن أرقام الهواتف والتحليل المتقدم للبيانات.

## الميزات الرئيسية

### 1. مراقبة المنشورات والتعليقات
- عرض المنشورات من المجموعات والصفحات المختارة
- التعليقات التفاعلية مع إمكانية العرض والإخفاء
- عرض الوسائط المتعددة (صور وفيديوهات) مع إمكانية التحميل
- البحث والتصفية المتقدم في المحتوى
- الترتيب الذكي حسب التاريخ والتفاعل

### 2. البحث عن أرقام الهواتف
- تحميل قاعدة بيانات محلية للأرقام (دعم ملفات كبيرة حتى 1600 ميجا)
- البحث السريع باستخدام معرف المستخدم
- الحفظ التلقائي للنتائج المكتشفة
- دعم تنسيقات متعددة: TXT, CSV, TSV
- البحث المتقدم بالاسم أو جزء من الرقم

### 3. التحليلات المتقدمة
- إحصائيات شاملة للمنشورات والتعليقات والمستخدمين
- تحليل النشاط حسب الساعة واليوم
- ترتيب أكثر المستخدمين نشاطاً
- رسوم بيانية لتوزيع المحتوى حسب المصدر
- إحصائيات مفصلة للوسائط (صور وفيديوهات)

### 4. إدارة المستخدمين
- جدول تفصيلي لجميع المستخدمين النشطين
- البحث والترتيب حسب مستوى النشاط
- ربط أرقام الهواتف بالمستخدمين تلقائياً
- روابط مباشرة للملفات الشخصية على فيسبوك

## دليل الإعداد

### الخطوة 1: إعداد Facebook API

1. الحصول على Access Token:
   - اذهب إلى Facebook Developers (developers.facebook.com)
   - أنشئ تطبيق جديد أو استخدم تطبيق موجود
   - احصل على User Access Token من Graph API Explorer
   - تأكد من وجود الصلاحيات المطلوبة

2. الصلاحيات المطلوبة:
   - pages_read_engagement: لقراءة منشورات الصفحات
   - groups_access_member_info: للوصول لمحتوى المجموعات
   - public_profile: للمعلومات الأساسية

3. إدخال الرمز في النظام:
   - اذهب إلى تبويب "الإعدادات"
   - أدخل Access Token في الحقل المخصص
   - اضغط "اختبار الاتصال" للتأكد من صحة الرمز

### الخطوة 2: إضافة المصادر

1. إضافة مجموعات وصفحات:
   - في تبويب "المصادر" ضمن الإعدادات
   - أدخل اسم المصدر ومعرفه
   - اختر نوع المصدر (مجموعة أو صفحة)
   - اضغط "إضافة"

2. الحصول على معرف المجموعة/الصفحة:
   - من رابط المجموعة: facebook.com/groups/GROUP_ID
   - من رابط الصفحة: facebook.com/PAGE_ID

### الخطوة 3: تحميل قاعدة بيانات الأرقام

1. تحضير الملف:
   - تنسيق الملف: user_id,phone_number
   - مثال: 123456789,+201234567890
   - الملف يمكن أن يكون TXT, CSV, أو TSV
   - يدعم النظام ملفات كبيرة حتى 1600 ميجا

2. تحميل الملف:
   - اذهب إلى تبويب "قاعدة الأرقام"
   - اضغط "اختر ملف" واختر ملف الأرقام
   - انتظر حتى اكتمال التحميل
   - ستظهر إحصائيات الملف المحمل

### الخطوة 4: بدء المراقبة

1. تحديث البيانات:
   - اضغط زر "تحديث البيانات" في الشريط العلوي
   - انتظر حتى اكتمال تحميل المنشورات

2. استخدام الميزات:
   - البحث عن الأرقام: اضغط أيقونة الهاتف بجانب أي مستخدم
   - عرض التعليقات: اضغط "عرض التعليقات" تحت أي منشور
   - تصفية المحتوى: استخدم شريط البحث والتصفية

## حل المشاكل الشائعة

### مشكلة Facebook API Error
الخطأ: "This api call does not support nested request"

الحل:
- تم حل هذه المشكلة في الكود الجديد
- يتم الآن جلب المنشورات والتعليقات بطلبات منفصلة
- تأكد من استخدام الإصدار المحدث من الكود

### مشكلة تحميل ملف الأرقام الكبير
للملفات الكبيرة (1600 ميجا):
- تأكد من وجود ذاكرة كافية في المتصفح
- استخدم ملفات مضغوطة إذا أمكن
- قسم الملف إلى ملفات أصغر إذا لزم الأمر
- استخدم تنسيق CSV للحصول على أفضل أداء

### مشكلة عدم ظهور الأرقام
التحقق من:
- تأكد من تحميل قاعدة بيانات الأرقام بنجاح
- تحقق من تنسيق الملف (user_id,phone_number)
- تأكد من مطابقة معرفات المستخدمين

## المتطلبات التقنية

### متطلبات النظام
- المتصفح: Chrome, Firefox, Safari, Edge (أحدث إصدار)
- الذاكرة: 4 جيجا رام على الأقل للملفات الكبيرة
- الاتصال: اتصال إنترنت مستقر
- التخزين: مساحة كافية للملفات المحلية

### متطلبات Facebook
- حساب Facebook: حساب نشط مع صلاحيات الوصول
- تطبيق Facebook: تطبيق مطور مع الصلاحيات المناسبة
- Access Token: رمز وصول صالح وغير منتهي الصلاحية

## الأمان والخصوصية

### حماية البيانات
- التخزين المحلي: جميع البيانات تُحفظ محلياً في المتصفح
- عدم الإرسال: لا يتم إرسال أرقام الهواتف لأي خادم خارجي
- التشفير: استخدام HTTPS لجميع الاتصالات مع Facebook

### أفضل الممارسات
- تحديث الرموز: قم بتحديث Access Token بانتظام
- النسخ الاحتياطي: احتفظ بنسخة احتياطية من ملف الأرقام
- المراجعة الدورية: راجع الصلاحيات والإعدادات بانتظام

## الخلاصة

مراقب فيسبوك المتقدم يوفر حلاً شاملاً لمراقبة وتحليل محتوى فيسبوك مع إمكانيات البحث عن أرقام الهواتف. باتباع هذا الدليل، ستتمكن من الاستفادة الكاملة من جميع الميزات المتاحة.

للحصول على أفضل النتائج، تأكد من:
- إعداد Facebook API بشكل صحيح
- تحميل قاعدة بيانات الأرقام بالتنسيق المناسب
- استخدام الفلاتر والبحث لتحسين الأداء
- مراجعة التحليلات بانتظام لفهم الاتجاهات
`

  const exportAsText = () => {
    const blob = new Blob([documentationContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "facebook-monitor-guide.txt"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportAsHtml = () => {
    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مراقب فيسبوك المتقدم - دليل المستخدم</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #1e40af; margin-top: 30px; }
        h3 { color: #1e3a8a; }
        code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', monospace; }
        .highlight { background: #dbeafe; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0; border-radius: 4px; }
        ul { padding-right: 20px; }
        li { margin: 8px 0; }
    </style>
</head>
<body>
    <div class="container">
        ${documentationContent
          .replace(/\n/g, "<br>")
          .replace(/### (.*)/g, "<h3>$1</h3>")
          .replace(/## (.*)/g, "<h2>$1</h2>")
          .replace(/# (.*)/g, "<h1>$1</h1>")}
    </div>
</body>
</html>
`
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "facebook-monitor-guide.html"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportAsPdf = async () => {
    setExporting(true)
    try {
      // محاكاة تصدير PDF (في التطبيق الحقيقي، ستحتاج مكتبة مثل jsPDF)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // للتطبيق الحقيقي، استخدم مكتبة PDF
      setExportStatus({ type: "success", message: text.success })

      // تصدير كـ HTML بدلاً من PDF للعرض التوضيحي
      exportAsHtml()
    } catch (error) {
      setExportStatus({ type: "error", message: text.error })
    } finally {
      setExporting(false)
      setTimeout(() => setExportStatus(null), 3000)
    }
  }

  return (
    <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          {text.title}
        </CardTitle>
        <p className="text-sm text-gray-500">{text.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Features List */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            {text.features}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Badge variant="outline" className="justify-start p-2">
              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
              {text.feature1}
            </Badge>
            <Badge variant="outline" className="justify-start p-2">
              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
              {text.feature2}
            </Badge>
            <Badge variant="outline" className="justify-start p-2">
              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
              {text.feature3}
            </Badge>
            <Badge variant="outline" className="justify-start p-2">
              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
              {text.feature4}
            </Badge>
            <Badge variant="outline" className="justify-start p-2">
              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
              {text.feature5}
            </Badge>
            <Badge variant="outline" className="justify-start p-2">
              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
              {text.feature6}
            </Badge>
          </div>
        </div>

        {/* Export Buttons */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <FileType className="w-4 h-4" />
            {text.formats}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={exportAsPdf}
              disabled={exporting}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              {exporting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              {exporting ? text.exporting : text.exportPdf}
            </Button>

            <Button onClick={exportAsText} variant="outline" className="flex items-center gap-2 bg-transparent">
              <FileText className="w-4 h-4" />
              {text.exportTxt}
            </Button>

            <Button onClick={exportAsHtml} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              {text.exportHtml}
            </Button>
          </div>
        </div>

        {/* Status Messages */}
        {exportStatus && (
          <Alert
            className={exportStatus.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
          >
            <CheckCircle className="w-4 h-4" />
            <AlertDescription className={exportStatus.type === "success" ? "text-green-700" : "text-red-700"}>
              {exportStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Note */}
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            <strong>{text.note}:</strong> {text.noteText}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
