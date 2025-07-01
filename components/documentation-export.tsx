"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  FileText, 
  Download, 
  BookOpen, 
  FileType, 
  CheckCircle, 
  Info, 
  FolderOpen, 
  Folder, 
  File, 
  Code, 
  Image, 
  Database,
  Settings,
  ChevronDown,
  ChevronRight,
  TreePine,
  Camera
} from "lucide-react"

interface DocumentationExportProps {
  darkMode: boolean
  language: "ar" | "en"
}

// بيانات شجرة الملفات مع الصور المصغرة
interface FileNode {
  name: string
  type: "file" | "folder"
  description?: string
  thumbnail?: string
  children?: { [key: string]: FileNode }
  icon?: any
  color?: string
}

const projectStructure: { [key: string]: FileNode } = {
  app: {
    name: "app",
    type: "folder",
    description: "صفحات ومسارات Next.js الرئيسية",
    icon: Folder,
    color: "text-blue-500",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMjU2M2ViIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QVBQPC90ZXh0Pgo8L3N2Zz4=",
    children: {
      "page.tsx": {
        name: "page.tsx",
        type: "file",
        description: "الصفحة الرئيسية للتطبيق",
        icon: Code,
        color: "text-green-500",
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMTBiOTgxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SG9tZTwvdGV4dD4KPC9zdmc+"
      },
      "layout.tsx": {
        name: "layout.tsx",
        type: "file", 
        description: "هيكل التطبيق العام",
        icon: Code,
        color: "text-purple-500",
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjOGI1Y2Y2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TGF5b3V0PC90ZXh0Pgo8L3N2Zz4="
      },
      api: {
        name: "api",
        type: "folder",
        description: "API Routes للتطبيق",
        icon: Database,
        color: "text-orange-500",
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZWE1ODBjIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QVBJPC90ZXh0Pgo8L3N2Zz4="
      }
    }
  },
  components: {
    name: "components",
    type: "folder",
    description: "مكونات React القابلة لإعادة الاستخدام",
    icon: Folder,
    color: "text-green-500",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMTBiOTgxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q29tcG9uZW50czwvdGV4dD4KPC9zdmc+",
    children: {
      "facebook-monitor.tsx": {
        name: "facebook-monitor.tsx",
        type: "file",
        description: "مراقب Facebook الرئيسي",
        icon: Code,
        color: "text-blue-500",
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMTg3N2YyIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RkIgTW9uaXRvcjwvdGV4dD4KPC9zdmc+"
      },
      "analytics-dashboard.tsx": {
        name: "analytics-dashboard.tsx",
        type: "file",
        description: "لوحة التحليلات",
        icon: Code,
        color: "text-cyan-500",
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDZiNmQ0Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QW5hbHl0aWNzPC90ZXh0Pgo8L3N2Zz4="
      },
      "settings-panel.tsx": {
        name: "settings-panel.tsx",
        type: "file",
        description: "لوحة الإعدادات",
        icon: Settings,
        color: "text-gray-500",
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNmI3Mjg2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2V0dGluZ3M8L3RleHQ+Cjwvc3ZnPg=="
      }
    }
  },
  lib: {
    name: "lib",
    type: "folder",
    description: "خدمات ومكتبات مساعدة",
    icon: Database,
    color: "text-yellow-500",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZWFiMzA4Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TElCPC90ZXh0Pgo8L3N2Zz4=",
    children: {
      "facebook-service.ts": {
        name: "facebook-service.ts",
        type: "file",
        description: "خدمة Facebook API",
        icon: Code,
        color: "text-blue-500",
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMzc1NGRiIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RkIgU2VydmljZTwvdGV4dD4KPC9zdmc+"
      },
      "firebase-service.ts": {
        name: "firebase-service.ts", 
        type: "file",
        description: "خدمة Firebase",
        icon: Database,
        color: "text-orange-500",
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZWE1ODBjIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RmlyZWJhc2U8L3RleHQ+Cjwvc3ZnPg=="
      }
    }
  }
}

export function DocumentationExport({ darkMode, language }: DocumentationExportProps) {
  const [exporting, setExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

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

  // مكون لعرض عقد شجرة الملفات
  const FileTreeNode = ({ node, path }: { node: FileNode; path: string }) => {
    const isExpanded = expandedNodes.has(path)
    const Icon = node.icon || (node.type === "folder" ? Folder : File)

    const toggleExpanded = () => {
      const newExpanded = new Set(expandedNodes)
      if (isExpanded) {
        newExpanded.delete(path)
      } else {
        newExpanded.add(path)
      }
      setExpandedNodes(newExpanded)
    }

    return (
      <div className="ml-4">
        <div className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer group">
          {node.type === "folder" && (
            <button onClick={toggleExpanded} className="flex items-center">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
          
          <Icon className={`w-4 h-4 ${node.color || "text-gray-500"}`} />
          
          {node.thumbnail && (
            <div className="relative group">
              <img 
                src={node.thumbnail} 
                alt={node.name} 
                className="w-8 h-8 rounded border border-gray-200 object-cover"
              />
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-3 h-3 text-blue-500" />
              </div>
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{node.name}</span>
              <Badge variant="outline" className="text-xs">
                {node.type === "folder" ? "مجلد" : "ملف"}
              </Badge>
            </div>
            {node.description && (
              <p className="text-xs text-gray-500 mt-1">{node.description}</p>
            )}
          </div>
        </div>

        {node.type === "folder" && node.children && isExpanded && (
          <div className="mt-2">
            {Object.entries(node.children).map(([key, childNode]) => (
              <FileTreeNode 
                key={key} 
                node={childNode} 
                path={`${path}/${key}`} 
              />
            ))}
          </div>
        )}
      </div>
    )
  }

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

  const generateFileTreeHtml = (structure: { [key: string]: FileNode }) => {
    const generateNodeHtml = (node: FileNode, depth = 0): string => {
      const indent = "  ".repeat(depth)
      const thumbnailHtml = node.thumbnail 
        ? `<img src="${node.thumbnail}" alt="${node.name}" style="width: 24px; height: 24px; border-radius: 4px; margin-left: 8px;">` 
        : ""
      
      let html = `${indent}<div style="margin: 8px 0; padding: 8px; background: #f8fafc; border-radius: 6px; border-right: 3px solid ${node.color?.replace('text-', '') === 'blue-500' ? '#3b82f6' : '#6b7280'};">
        <div style="display: flex; align-items: center; gap: 8px;">
          ${thumbnailHtml}
          <strong style="color: #1f2937;">${node.name}</strong>
          <span style="background: #e5e7eb; padding: 2px 6px; border-radius: 12px; font-size: 10px;">${node.type === "folder" ? "مجلد" : "ملف"}</span>
        </div>`
      
      if (node.description) {
        html += `<div style="color: #6b7280; font-size: 12px; margin-top: 4px;">${node.description}</div>`
      }
      
      html += `</div>\n`
      
      if (node.children) {
        Object.values(node.children).forEach(child => {
          html += generateNodeHtml(child, depth + 1)
        })
      }
      
      return html
    }
    
    return Object.values(structure).map(node => generateNodeHtml(node)).join("")
  }

  const exportAsHtml = () => {
    const fileTreeHtml = generateFileTreeHtml(projectStructure)
    
    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مراقب فيسبوك المتقدم - دليل المستخدم الشامل</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 20px 0; }
        .file-tree { background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
        h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #1e40af; margin-top: 30px; }
        h3 { color: #1e3a8a; }
        .highlight { background: #dbeafe; padding: 15px; border-right: 4px solid #2563eb; margin: 15px 0; border-radius: 4px; }
        @media (max-width: 768px) { .two-column { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 مراقب فيسبوك المتقدم - دليل المستخدم الشامل</h1>
        
        <div class="highlight">
            <h2>🗂️ خريطة هيكل المشروع التفاعلية</h2>
            <p>يحتوي هذا القسم على شجرة تفصيلية لجميع ملفات ومجلدات المشروع مع صور مصغرة ووصف لكل عنصر.</p>
        </div>
        
        <div class="two-column">
            <div>
                <h3>🌳 شجرة الملفات</h3>
                <div class="file-tree">
                    ${fileTreeHtml}
                </div>
            </div>
            <div>
                <h3>📖 المحتوى التفصيلي</h3>
                ${documentationContent
                  .replace(/\n/g, "<br>")
                  .replace(/### (.*)/g, "<h4 style='color: #1e3a8a; margin-top: 20px;'>$1</h4>")
                  .replace(/## (.*)/g, "<h3 style='color: #1e40af; margin-top: 25px;'>$1</h3>")
                  .replace(/# (.*)/g, "<h2 style='color: #2563eb; margin-top: 30px;'>$1</h2>")}
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding: 20px; background: #f1f5f9; border-radius: 8px;">
            <p style="color: #64748b;">تم إنشاء هذا التوثيق تلقائياً من مراقب فيسبوك المتقدم</p>
            <p style="color: #64748b; font-size: 12px;">تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-EG')}</p>
        </div>
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
        {/* Project Structure Tree */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <TreePine className="w-4 h-4" />
            خريطة هيكل المشروع
          </h4>
          <Card className="p-4 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {Object.entries(projectStructure).map(([key, node]) => (
                <FileTreeNode key={key} node={node} path={key} />
              ))}
            </div>
          </Card>
        </div>

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
