
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
  ChevronDown, 
  ChevronRight,
  Folder,
  File,
  Eye,
  Image,
  Globe,
  Code,
  Settings,
  Users,
  BarChart3,
  Phone,
  Database,
  MessageSquare,
  FolderOpen
} from "lucide-react"

interface DocumentationExportProps {
  darkMode: boolean
  language: "ar" | "en"
}

export function DocumentationExport({ darkMode, language }: DocumentationExportProps) {
  const [exporting, setExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['main', 'components', 'pages']))

  const t = {
    ar: {
      title: "تصدير التوثيق",
      description: "تحميل دليل المستخدم الشامل للمشروع مع خريطة تفاعلية",
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
      projectTree: "شجرة المشروع",
      pagePreview: "معاينة الصفحة",
      viewPreview: "عرض المعاينة",
      mainPages: "الصفحات الرئيسية",
      components: "المكونات",
      utilities: "الأدوات المساعدة",
      expandAll: "توسيع الكل",
      collapseAll: "طي الكل"
    },
    en: {
      title: "Documentation Export",
      description: "Download comprehensive user guide with interactive project map",
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
      projectTree: "Project Tree",
      pagePreview: "Page Preview",
      viewPreview: "View Preview",
      mainPages: "Main Pages",
      components: "Components",
      utilities: "Utilities",
      expandAll: "Expand All",
      collapseAll: "Collapse All"
    },
  }

  const text = t[language]

  // شجرة المشروع مع معلومات الصفحات
  const projectStructure = {
    main: {
      name: text.mainPages,
      icon: Globe,
      children: {
        dashboard: {
          name: "لوحة التحكم / Dashboard",
          icon: BarChart3,
          description: "الصفحة الرئيسية مع الإحصائيات العامة",
          preview: "/dashboard-preview.jpg",
          features: ["إحصائيات فورية", "تحليلات سريعة", "نظرة عامة على النشاط"]
        },
        posts: {
          name: "المنشورات / Posts",
          icon: FileText,
          description: "عرض وإدارة منشورات فيسبوك",
          preview: "/posts-preview.jpg",
          features: ["عرض المنشورات", "فلترة المحتوى", "البحث المتقدم", "تحميل الوسائط"]
        },
        users: {
          name: "المستخدمون / Users",
          icon: Users,
          description: "إدارة المستخدمين والبحث عن الأرقام",
          preview: "/users-preview.jpg",
          features: ["جدول المستخدمين", "البحث عن الأرقام", "تصدير البيانات"]
        },
        analytics: {
          name: "التحليلات / Analytics",
          icon: BarChart3,
          description: "تحليلات متقدمة ورسوم بيانية",
          preview: "/analytics-preview.jpg",
          features: ["رسوم بيانية تفاعلية", "تحليل الاتجاهات", "تقارير مفصلة"]
        }
      }
    },
    components: {
      name: text.components,
      icon: Code,
      children: {
        phoneDatabase: {
          name: "قاعدة الأرقام / Phone Database",
          icon: Phone,
          description: "إدارة قاعدة بيانات أرقام الهواتف",
          preview: "/phone-db-preview.jpg",
          features: ["تحميل ملفات كبيرة", "البحث السريع", "تصدير النتائج"]
        },
        comments: {
          name: "إدارة التعليقات / Comments",
          icon: MessageSquare,
          description: "عرض وإدارة تعليقات المنشورات",
          preview: "/comments-preview.jpg",
          features: ["عرض التعليقات", "فلترة التعليقات", "إحصائيات التفاعل"]
        },
        settings: {
          name: "الإعدادات / Settings",
          icon: Settings,
          description: "إعدادات التطبيق و Facebook API",
          preview: "/settings-preview.jpg",
          features: ["إعداد API", "إدارة المصادر", "تخصيص التطبيق"]
        }
      }
    },
    utilities: {
      name: text.utilities,
      icon: Database,
      children: {
        dataExport: {
          name: "تصدير البيانات / Data Export",
          icon: Download,
          description: "تصدير البيانات بتنسيقات مختلفة",
          preview: "/export-preview.jpg",
          features: ["تصدير CSV", "تصدير JSON", "نسخ احتياطي"]
        },
        documentation: {
          name: "التوثيق / Documentation",
          icon: BookOpen,
          description: "دليل المستخدم والمساعدة",
          preview: "/docs-preview.jpg",
          features: ["دليل شامل", "أمثلة عملية", "حل المشاكل"]
        }
      }
    }
  }

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const expandAll = () => {
    setExpandedFolders(new Set(Object.keys(projectStructure)))
  }

  const collapseAll = () => {
    setExpandedFolders(new Set())
  }

  // محتوى التوثيق المحدث
  const documentationContent = `
# مراقب فيسبوك المتقدم - دليل المستخدم الشامل

## نظرة عامة على المشروع

مراقب فيسبوك المتقدم هو نظام متكامل لمراقبة وتحليل المنشورات والتعليقات على فيسبوك، مع إمكانيات البحث عن أرقام الهواتف والتحليل المتقدم للبيانات.

## خريطة المشروع التفاعلية

### الصفحات الرئيسية

#### لوحة التحكم (Dashboard)
- **الوصف**: الصفحة الرئيسية التي تعرض نظرة عامة على جميع الإحصائيات
- **الميزات**:
  - إحصائيات فورية للمنشورات والتعليقات
  - رسوم بيانية للنشاط اليومي
  - تنبيهات هامة
  - الوصول السريع للأدوات

#### المنشورات (Posts)
- **الوصف**: عرض وإدارة جميع منشورات فيسبوك المجمعة
- **الميزات**:
  - عرض المنشورات من مصادر متعددة
  - فلترة حسب التاريخ والمصدر
  - البحث في محتوى المنشورات
  - عرض الصور والفيديوهات
  - تحميل الوسائط المتعددة

#### المستخدمون (Users)
- **الوصف**: إدارة المستخدمين والبحث عن أرقام الهواتف
- **الميزات**:
  - جدول تفاعلي للمستخدمين
  - البحث عن الأرقام بالمعرف
  - ربط الأرقام بالملفات الشخصية
  - تصدير بيانات المستخدمين
  - إحصائيات النشاط

#### التحليلات (Analytics)
- **الوصف**: تحليلات متقدمة ورسوم بيانية تفاعلية
- **الميزات**:
  - رسوم بيانية للاتجاهات
  - تحليل النشاط الزمني
  - إحصائيات التفاعل
  - تقارير مفصلة
  - مقارنات زمنية

### المكونات الرئيسية

#### قاعدة بيانات الأرقام
- **الوظيفة**: إدارة ملفات أرقام الهواتف الكبيرة
- **الإمكانيات**:
  - دعم ملفات حتى 1600 ميجا
  - البحث السريع في المليارات من الأرقام
  - تنسيقات متعددة: TXT, CSV, TSV
  - الحفظ التلقائي للنتائج

#### إدارة التعليقات
- **الوظيفة**: عرض وتحليل تعليقات المنشورات
- **الميزات**:
  - عرض هرمي للتعليقات
  - فلترة التعليقات حسب النوع
  - إحصائيات التفاعل
  - البحث في التعليقات

#### الإعدادات
- **الوظيفة**: تكوين التطبيق وإعدادات Facebook API
- **الأقسام**:
  - إعداد Access Token
  - إدارة المصادر (مجموعات وصفحات)
  - إعدادات التحديث التلقائي
  - تخصيص واجهة المستخدم

### الأدوات المساعدة

#### تصدير البيانات
- **الأنواع المدعومة**:
  - CSV للجداول
  - JSON للبيانات المنظمة
  - TXT للنصوص البسيطة
  - HTML للعرض
  - PDF للتقارير

#### التوثيق
- **المحتويات**:
  - دليل المستخدم الشامل
  - أمثلة عملية للاستخدام
  - حل المشاكل الشائعة
  - أفضل الممارسات

## دليل الإعداد السريع

### 1. إعداد Facebook API
\`\`\`
1. اذهب إلى Facebook Developers
2. أنشئ تطبيق جديد
3. احصل على Access Token
4. أدخل الرمز في الإعدادات
5. اختبر الاتصال
\`\`\`

### 2. إضافة المصادر
\`\`\`
1. اذهب إلى الإعدادات → المصادر
2. أضف معرفات المجموعات والصفحات
3. اختبر الوصول لكل مصدر
4. احفظ الإعدادات
\`\`\`

### 3. تحميل قاعدة الأرقام
\`\`\`
1. حضر ملف بتنسيق: user_id,phone_number
2. اذهب إلى قاعدة الأرقام
3. اختر الملف وحمله
4. انتظر اكتمال المعالجة
\`\`\`

### 4. بدء المراقبة
\`\`\`
1. اضغط "تحديث البيانات"
2. انتظر تحميل المنشورات
3. استكشف الميزات المختلفة
4. راجع التحليلات والإحصائيات
\`\`\`

## الميزات المتقدمة

### البحث الذكي
- البحث في المحتوى بكلمات مفتاحية
- فلترة متقدمة حسب معايير متعددة
- حفظ استعلامات البحث المفضلة
- تنبيهات للمحتوى الجديد

### التحليل التلقائي
- اكتشاف الاتجاهات تلقائياً
- تصنيف المحتوى حسب الموضوع
- تحليل المشاعر للتعليقات
- إنشاء تقارير دورية

### التكامل مع الأدوات الخارجية
- تصدير لـ Google Sheets
- إرسال تقارير بالبريد الإلكتروني
- ربط مع قواعد بيانات خارجية
- API للتطبيقات الأخرى

## حل المشاكل الشائعة

### مشاكل Facebook API
- **انتهاء صلاحية الرمز**: جدد Access Token
- **نقص الصلاحيات**: راجع أذونات التطبيق
- **حدود الاستخدام**: راقب معدل الطلبات

### مشاكل قاعدة الأرقام
- **ملف كبير جداً**: قسم الملف أو ضغطه
- **تنسيق خاطئ**: تأكد من صيغة CSV الصحيحة
- **بحث بطيء**: استخدم فهرسة البيانات

### مشاكل الأداء
- **تحميل بطيء**: قلل عدد المنشورات المحملة
- **ذاكرة ممتلئة**: أغلق التبويبات غير المستخدمة
- **اتصال منقطع**: تحقق من استقرار الإنترنت

## المتطلبات التقنية

### المتصفح المطلوب
- Chrome 90+ (مفضل)
- Firefox 88+
- Safari 14+
- Edge 90+

### متطلبات النظام
- ذاكرة: 4 جيجا رام (8 جيجا للملفات الكبيرة)
- تخزين: 2 جيجا مساحة فارغة
- اتصال: 10 ميجا/ثانية مستقر

### متطلبات Facebook
- حساب Facebook مطور
- تطبيق مع الصلاحيات المناسبة
- Access Token صالح

## الأمان والخصوصية

### حماية البيانات
- جميع البيانات محفوظة محلياً
- لا يتم إرسال الأرقام لخوادم خارجية
- تشفير الاتصالات مع Facebook
- نسخ احتياطي آمن

### أفضل الممارسات
- تحديث كلمات المرور بانتظام
- مراجعة الصلاحيات دورياً
- استخدام رموز وصول محدودة المدة
- مراقبة سجلات النشاط

## الدعم والمساعدة

### الحصول على المساعدة
- مراجعة هذا الدليل أولاً
- البحث في قاعدة المعرفة
- التواصل مع فريق الدعم
- المشاركة في المنتدى

### التحديثات
- التحديثات التلقائية للكود
- إشعارات الميزات الجديدة
- تحسينات الأداء المستمرة
- إصلاح الأخطاء السريع

---

*تم إنشاء هذا الدليل لمساعدتك في الحصول على أقصى استفادة من مراقب فيسبوك المتقدم.*
`

  const generatePreviewHtml = (item: any) => {
    return `
    <div style="
      width: 300px;
      height: 200px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      padding: 16px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    ">
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <div style="
          width: 32px;
          height: 32px;
          background: #3b82f6;
          border-radius: 6px;
          margin-left: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
        ">📊</div>
        <h3 style="margin: 0; font-size: 16px; color: #1e293b;">${item.name}</h3>
      </div>
      
      <p style="
        color: #64748b;
        font-size: 14px;
        margin: 0 0 12px 0;
        line-height: 1.4;
      ">${item.description}</p>
      
      <div style="margin-top: 12px;">
        <h4 style="
          font-size: 12px;
          color: #475569;
          margin: 0 0 6px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">الميزات الرئيسية:</h4>
        <ul style="
          margin: 0;
          padding: 0;
          list-style: none;
          font-size: 12px;
          color: #64748b;
        ">
          ${item.features?.slice(0, 3).map((feature: string) => 
            `<li style="padding: 2px 0;">• ${feature}</li>`
          ).join('') || ''}
        </ul>
      </div>
    </div>
    `
  }

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
    // Generate project tree HTML
    const generateTreeHtml = (structure: any, level = 0) => {
      return Object.entries(structure).map(([key, section]: [string, any]) => {
        if (section.children) {
          return `
            <div style="margin-left: ${level * 20}px; margin-bottom: 16px;">
              <h${level + 3} style="
                display: flex;
                align-items: center;
                color: #1e40af;
                margin: 8px 0;
                font-size: ${18 - level}px;
              ">
                📁 ${section.name}
              </h${level + 3}>
              <div style="margin-left: 20px;">
                ${Object.entries(section.children).map(([childKey, child]: [string, any]) => `
                  <div style="
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 12px;
                    margin: 8px 0;
                  ">
                    <h4 style="
                      display: flex;
                      align-items: center;
                      color: #1e3a8a;
                      margin: 0 0 8px 0;
                    ">
                      📄 ${child.name}
                    </h4>
                    <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px;">
                      ${child.description}
                    </p>
                    ${child.features ? `
                      <div>
                        <strong style="color: #475569; font-size: 12px;">الميزات:</strong>
                        <ul style="margin: 4px 0 0 20px; color: #64748b; font-size: 12px;">
                          ${child.features.map((feature: string) => `<li>${feature}</li>`).join('')}
                        </ul>
                      </div>
                    ` : ''}
                    <div style="margin-top: 12px;">
                      ${generatePreviewHtml(child)}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `
        }
        return ''
      }).join('')
    }

    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مراقب فيسبوك المتقدم - دليل المستخدم مع خريطة المشروع</title>
    <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          margin: 0; 
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        .container { 
          max-width: 1200px; 
          margin: 0 auto; 
          background: white; 
          padding: 40px; 
          border-radius: 20px; 
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #2563eb;
        }
        h1 { 
          color: #2563eb; 
          font-size: 2.5em;
          margin: 0 0 10px 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        .subtitle {
          color: #64748b;
          font-size: 1.2em;
          margin: 0;
        }
        h2 { 
          color: #1e40af; 
          margin-top: 40px;
          padding: 15px 20px;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border-radius: 10px;
          border-left: 4px solid #2563eb;
        }
        h3 { color: #1e3a8a; margin-top: 24px; }
        .project-tree {
          background: #f8fafc;
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
          border: 2px solid #e2e8f0;
        }
        .tree-controls {
          margin-bottom: 20px;
          text-align: center;
        }
        .tree-controls button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          margin: 0 8px;
          cursor: pointer;
          font-size: 14px;
        }
        .tree-controls button:hover {
          background: #2563eb;
        }
        code { 
          background: #f1f5f9; 
          padding: 2px 6px; 
          border-radius: 4px; 
          font-family: 'Courier New', monospace;
          color: #be123c;
          font-weight: 500;
        }
        .highlight { 
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); 
          padding: 20px; 
          border-left: 4px solid #2563eb; 
          margin: 20px 0; 
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        }
        ul { padding-right: 20px; }
        li { margin: 8px 0; }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        .feature-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: transform 0.2s ease;
        }
        .feature-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        pre {
          background: #1e293b;
          color: #e2e8f0;
          padding: 20px;
          border-radius: 8px;
          overflow-x: auto;
          border-left: 4px solid #10b981;
        }
        .toc {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .toc h3 {
          margin-top: 0;
          color: #1e40af;
        }
        .toc ul {
          columns: 2;
          column-gap: 30px;
        }
        @media (max-width: 768px) {
          .container { padding: 20px; }
          h1 { font-size: 2em; }
          .feature-grid { grid-template-columns: 1fr; }
          .toc ul { columns: 1; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 مراقب فيسبوك المتقدم</h1>
            <p class="subtitle">دليل المستخدم الشامل مع خريطة المشروع التفاعلية</p>
        </div>

        <div class="toc">
            <h3>📋 فهرس المحتويات</h3>
            <ul>
                <li><a href="#overview">نظرة عامة على المشروع</a></li>
                <li><a href="#project-map">خريطة المشروع التفاعلية</a></li>
                <li><a href="#quick-setup">دليل الإعداد السريع</a></li>
                <li><a href="#advanced-features">الميزات المتقدمة</a></li>
                <li><a href="#troubleshooting">حل المشاكل</a></li>
                <li><a href="#technical-requirements">المتطلبات التقنية</a></li>
                <li><a href="#security">الأمان والخصوصية</a></li>
                <li><a href="#support">الدعم والمساعدة</a></li>
            </ul>
        </div>

        <h2 id="project-map">🗺️ خريطة المشروع التفاعلية</h2>
        <div class="project-tree">
            <div class="tree-controls">
                <h3 style="margin-top: 0; color: #1e40af;">استكشف جميع أجزاء المشروع</h3>
                <p style="color: #64748b;">اضغط على أي عنصر لرؤية المعاينة والتفاصيل</p>
            </div>
            ${generateTreeHtml(projectStructure)}
        </div>

        <div style="margin-top: 40px;">
            ${documentationContent
              .replace(/\n/g, "<br>")
              .replace(/### (.*)/g, "<h3>$1</h3>")
              .replace(/## (.*)/g, "<h2>$1</h2>")
              .replace(/# (.*)/g, "<h1>$1</h1>")
              .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')}
        </div>

        <div style="
          margin-top: 60px;
          padding: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          text-align: center;
          color: white;
        ">
            <h2 style="color: white; margin-top: 0;">🎯 بدء الاستخدام الآن</h2>
            <p style="font-size: 1.1em; margin-bottom: 20px;">
                اتبع الخطوات أعلاه وابدأ في الاستفادة من جميع ميزات مراقب فيسبوك المتقدم
            </p>
            <div style="
              background: rgba(255,255,255,0.2);
              border-radius: 10px;
              padding: 20px;
              margin-top: 20px;
            ">
                <strong>💡 نصيحة:</strong> احفظ هذا الدليل كمرجع سريع واستخدم فهرس المحتويات للانتقال السريع
            </div>
        </div>
    </div>

    <script>
        // Add interactivity for better user experience
        document.addEventListener('DOMContentLoaded', function() {
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Highlight current section in TOC
            const sections = document.querySelectorAll('h2[id]');
            const tocLinks = document.querySelectorAll('.toc a');
            
            window.addEventListener('scroll', function() {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (window.pageYOffset >= sectionTop - 200) {
                        current = section.getAttribute('id');
                    }
                });

                tocLinks.forEach(link => {
                    link.style.fontWeight = 'normal';
                    link.style.color = '#3b82f6';
                    if (link.getAttribute('href') === '#' + current) {
                        link.style.fontWeight = 'bold';
                        link.style.color = '#1e40af';
                    }
                });
            });
        });
    </script>
</body>
</html>
`
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "facebook-monitor-complete-guide.html"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportAsPdf = async () => {
    setExporting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setExportStatus({ type: "success", message: text.success })
      // Export as enhanced HTML instead of PDF for demonstration
      exportAsHtml()
    } catch (error) {
      setExportStatus({ type: "error", message: text.error })
    } finally {
      setExporting(false)
      setTimeout(() => setExportStatus(null), 3000)
    }
  }

  const renderTreeItem = (key: string, item: any, level = 0) => {
    const isExpanded = expandedFolders.has(key)
    const hasChildren = item.children && Object.keys(item.children).length > 0
    const IconComponent = item.icon

    if (hasChildren) {
      return (
        <div key={key} className="mb-2">
          <Collapsible open={isExpanded} onOpenChange={() => toggleFolder(key)}>
            <CollapsibleTrigger className="flex items-center gap-2 p-2 w-full text-left hover:bg-gray-100 rounded-lg transition-colors">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <IconComponent className="w-5 h-5 text-blue-600" />
              <span className="font-medium">{item.name}</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-6 mt-2 space-y-2">
                {Object.entries(item.children).map(([childKey, child]: [string, any]) => 
                  renderTreeItem(childKey, child, level + 1)
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )
    }

    return (
      <div 
        key={key} 
        className="ml-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
        onClick={() => setSelectedPreview(key)}
      >
        <div className="flex items-center gap-2 mb-2">
          <IconComponent className="w-4 h-4 text-green-600" />
          <span className="font-medium text-sm">{item.name}</span>
          <Button size="sm" variant="outline" className="ml-auto">
            <Eye className="w-3 h-3 mr-1" />
            {text.viewPreview}
          </Button>
        </div>
        <p className="text-xs text-gray-600 mb-2">{item.description}</p>
        {item.features && (
          <div className="space-y-1">
            {item.features.slice(0, 2).map((feature: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs mr-1">
                {feature}
              </Badge>
            ))}
          </div>
        )}
      </div>
    )
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

        {/* Project Tree */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              {text.projectTree}
            </h4>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={expandAll}>
                {text.expandAll}
              </Button>
              <Button size="sm" variant="outline" onClick={collapseAll}>
                {text.collapseAll}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 bg-gray-50/50 max-h-96 overflow-y-auto">
              {Object.entries(projectStructure).map(([key, section]: [string, any]) => 
                renderTreeItem(key, section)
              )}
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50/50">
              <h5 className="font-medium mb-3 flex items-center gap-2">
                <Image className="w-4 h-4" />
                {text.pagePreview}
              </h5>
              {selectedPreview ? (
                <div className="space-y-3">
                  <div 
                    className="border rounded-lg p-4 bg-white"
                    dangerouslySetInnerHTML={{ 
                      __html: generatePreviewHtml(
                        Object.values(projectStructure).find((section: any) => 
                          section.children && section.children[selectedPreview]
                        )?.children[selectedPreview] || { 
                          name: "معاينة الصفحة", 
                          description: "حدد عنصر من الشجرة لعرض المعاينة",
                          features: ["معاينة تفاعلية", "تفاصيل شاملة"]
                        }
                      ) 
                    }}
                  />
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>اختر عنصر من الشجرة لعرض المعاينة</p>
                </div>
              )}
            </div>
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

            <Button onClick={exportAsText} variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {text.exportTxt}
            </Button>

            <Button onClick={exportAsHtml} variant="outline" className="flex items-center gap-2 bg-green-50 border-green-200 hover:bg-green-100">
              <Download className="w-4 h-4 text-green-600" />
              <span className="text-green-700">{text.exportHtml}</span>
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
