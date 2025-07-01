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
  Camera,
  Zap,
  Shield,
  Palette,
  Search,
  Globe,
  GitBranch,
  Package,
  Terminal
} from "lucide-react"

interface DocumentationExportProps {
  darkMode: boolean
  language: "ar" | "en"
}

// بيانات شجرة الملفات مع التفاصيل الشاملة
interface FileNode {
  name: string
  type: "file" | "folder"
  description?: string
  purpose?: string
  functionality?: string[]
  dependencies?: string[]
  connectedTo?: string[]
  techStack?: string[]
  importance?: "critical" | "high" | "medium" | "low"
  thumbnail?: string
  children?: { [key: string]: FileNode }
  icon?: any
  color?: string
  size?: string
  lastModified?: string
}

const projectStructure: { [key: string]: FileNode } = {
  app: {
    name: "app",
    type: "folder",
    description: "صفحات ومسارات Next.js الرئيسية - قلب التطبيق",
    purpose: "يحتوي على الصفحات الرئيسية وAPI routes وتخطيط التطبيق",
    functionality: [
      "إدارة المسارات (Routing)",
      "صفحات التطبيق الرئيسية",
      "API endpoints للخدمات",
      "تخطيط التطبيق العام"
    ],
    importance: "critical",
    icon: Folder,
    color: "text-blue-500",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMjU2M2ViIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QVBQPC90ZXh0Pgo8L3N2Zz4=",
    children: {
      "page.tsx": {
        name: "page.tsx",
        type: "file",
        description: "الصفحة الرئيسية للتطبيق - نقطة الدخول الأساسية",
        purpose: "عرض لوحة التحكم الرئيسية والإحصائيات العامة للمستخدم",
        functionality: [
          "عرض الإحصائيات العامة",
          "لوحة تحكم رئيسية",
          "نقاط الوصول السريع",
          "حالة النظام العامة"
        ],
        dependencies: [
          "components/facebook-monitor.tsx",
          "components/analytics-dashboard.tsx", 
          "lib/firebase-service.ts",
          "lib/app-context.tsx"
        ],
        connectedTo: [
          "layout.tsx (التخطيط العام)",
          "components/* (جميع المكونات)",
          "lib/* (الخدمات)"
        ],
        techStack: ["Next.js 15", "React 18", "TypeScript"],
        importance: "critical",
        icon: Code,
        color: "text-green-500",
        size: "~8KB",
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMTBiOTgxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SG9tZTwvdGV4dD4KPC9zdmc+"
      },
      "layout.tsx": {
        name: "layout.tsx",
        type: "file", 
        description: "هيكل التطبيق العام - يحدد التخطيط لجميع الصفحات",
        purpose: "تحديد الهيكل العام للتطبيق مع Header, Sidebar, Footer وإدارة الحالة العامة",
        functionality: [
          "تخطيط التطبيق الأساسي",
          "إدارة الثيم (فاتح/داكن)",
          "شريط التنقل العلوي",
          "الشريط الجانبي",
          "إدارة السياق العام"
        ],
        dependencies: [
          "components/theme-provider.tsx",
          "lib/app-context.tsx",
          "components/ui/*",
          "globals.css"
        ],
        connectedTo: [
          "جميع الصفحات في app/",
          "components/* (المكونات المشتركة)",
          "lib/utils.ts (المساعدات)"
        ],
        techStack: ["Next.js", "React Context", "Tailwind CSS"],
        importance: "critical",
        icon: Code,
        color: "text-purple-500",
        size: "~5KB",
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjOGI1Y2Y2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TGF5b3V0PC90ZXh0Pgo8L3N2Zz4="
      },
      "globals.css": {
        name: "globals.css",
        type: "file",
        description: "التنسيقات العامة والمتغيرات - أساس التصميم",
        purpose: "تحديد التنسيقات الأساسية، الألوان، الخطوط، والمتغيرات العامة للتطبيق",
        functionality: [
          "متغيرات الألوان CSS",
          "خطوط التطبيق",
          "تنسيقات Tailwind الأساسية",
          "تنسيقات الثيم المظلم/الفاتح",
          "أنماط المكونات العامة"
        ],
        dependencies: ["tailwind.config.ts", "postcss.config.mjs"],
        connectedTo: [
          "جميع مكونات التطبيق",
          "components/ui/* (مكونات الواجهة)",
          "tailwind.config.ts (إعدادات)"
        ],
        techStack: ["CSS3", "Tailwind CSS", "CSS Variables"],
        importance: "high",
        icon: Palette,
        color: "text-pink-500",
        size: "~3KB"
      },
      api: {
        name: "api",
        type: "folder",
        description: "API Routes للتطبيق - نقاط النهاية للخدمات",
        purpose: "يحتوي على جميع نقاط API للتفاعل مع Facebook API والخدمات الخارجية",
        functionality: [
          "التفاعل مع Facebook API",
          "التحقق من صحة الرموز",
          "جلب المنشورات والتعليقات",
          "إدارة بيانات المستخدمين"
        ],
        dependencies: ["lib/facebook-service.ts", "lib/firebase-service.ts"],
        connectedTo: [
          "components/* (المكونات التي تستدعي API)",
          "lib/* (الخدمات)",
          "Frontend components"
        ],
        techStack: ["Next.js API Routes", "TypeScript"],
        importance: "critical",
        icon: Database,
        color: "text-orange-500",
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZWE1ODBjIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QVBJPC90ZXh0Pgo8L3N2Zz4=",
        children: {
          facebook: {
            name: "facebook",
            type: "folder",
            description: "خدمات Facebook API المتخصصة",
            purpose: "إدارة جميع العمليات المتعلقة بـ Facebook API",
            children: {
              "posts/route.ts": {
                name: "posts/route.ts",
                type: "file",
                description: "API لجلب المنشورات من Facebook",
                purpose: "جلب وتحليل المنشورات من المجموعات والصفحات",
                functionality: [
                  "جلب المنشورات من Facebook",
                  "تحليل البيانات المستلمة",
                  "فلترة المحتوى",
                  "تحويل البيانات للتنسيق المطلوب"
                ],
                dependencies: ["lib/facebook-service.ts"],
                connectedTo: ["components/posts-list.tsx", "components/facebook-monitor.tsx"],
                importance: "critical",
                icon: Code,
                color: "text-blue-500",
                size: "~4KB"
              }
            }
          }
        }
      }
    }
  },
  components: {
    name: "components",
    type: "folder",
    description: "مكونات React القابلة لإعادة الاستخدام - عقل التطبيق",
    purpose: "يحتوي على جميع مكونات واجهة المستخدم والمنطق التفاعلي للتطبيق",
    functionality: [
      "واجهات المستخدم التفاعلية",
      "إدارة الحالة المحلية",
      "التفاعل مع المستخدم",
      "عرض البيانات"
    ],
    importance: "critical",
    icon: Folder,
    color: "text-green-500",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMTBiOTgxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q29tcG9uZW50czwvdGV4dD4KPC9zdmc+",
    children: {
      "facebook-monitor.tsx": {
        name: "facebook-monitor.tsx",
        type: "file",
        description: "مراقب Facebook الرئيسي - المكون الأساسي للمراقبة",
        purpose: "المكون الأساسي لمراقبة وعرض بيانات Facebook مع جميع الميزات المتقدمة",
        functionality: [
          "مراقبة المنشورات والتعليقات",
          "عرض البيانات في الوقت الفعلي",
          "إدارة المصادر (مجموعات وصفحات)",
          "البحث والفلترة المتقدمة",
          "تحديث البيانات التلقائي"
        ],
        dependencies: [
          "lib/facebook-service.ts",
          "lib/firebase-service.ts",
          "components/posts-list.tsx",
          "components/user-table.tsx",
          "components/analytics-dashboard.tsx"
        ],
        connectedTo: [
          "app/page.tsx (الصفحة الرئيسية)",
          "جميع مكونات البيانات",
          "خدمات API",
          "قاعدة البيانات"
        ],
        techStack: ["React 18", "TypeScript", "Tailwind CSS", "Lucide Icons"],
        importance: "critical",
        icon: Code,
        color: "text-blue-500",
        size: "~15KB",
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMTg3N2YyIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RkIgTW9uaXRvcjwvdGV4dD4KPC9zdmc+"
      }
    }
  },
  lib: {
    name: "lib",
    type: "folder",
    description: "خدمات ومكتبات مساعدة - عقل العمليات",
    purpose: "يحتوي على جميع المنطق التجاري والخدمات والأدوات المساعدة للتطبيق",
    functionality: [
      "خدمات Facebook API",
      "إدارة قواعد البيانات",
      "معالجة البيانات",
      "خدمات البحث",
      "أدوات مساعدة"
    ],
    importance: "critical",
    icon: Database,
    color: "text-yellow-500",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZWFiMzA4Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TElCPC90ZXh0Pgo8L3N2Zz4=",
    children: {
      "facebook-service.ts": {
        name: "facebook-service.ts",
        type: "file",
        description: "خدمة Facebook API الأساسية - التفاعل الأساسي مع Facebook",
        purpose: "توفير الوظائف الأساسية للتفاعل مع Facebook Graph API",
        functionality: [
          "جلب المنشورات من المجموعات",
          "جلب بيانات الصفحات",
          "إدارة Access Tokens",
          "التعامل مع حدود API",
          "معالجة الأخطاء"
        ],
        dependencies: ["axios", "facebook-oauth-service"],
        connectedTo: [
          "app/api/facebook/*/route.ts",
          "components/facebook-monitor.tsx",
          "enhanced-facebook-service.ts"
        ],
        techStack: ["JavaScript/TypeScript", "Facebook Graph API", "Axios"],
        importance: "critical",
        icon: Code,
        color: "text-blue-500",
        size: "~8KB",
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMzc1NGRiIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RkIgU2VydmljZTwvdGV4dD4KPC9zdmc+"
      }
    }
  }
}

export function DocumentationExport({ darkMode, language }: DocumentationExportProps) {
  const [exporting, setExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["app", "components", "lib"]))
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const t = {
    ar: {
      title: "تصدير التوثيق",
      description: "تحميل دليل المستخدم الشامل للمشروع مع خريطة الملفات التفصيلية",
      formats: "التنسيقات المتاحة",
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
      searchPlaceholder: "البحث في الملفات...",
      fileDetails: "تفاصيل الملف",
      dependencies: "التبعيات",
      connectedTo: "مرتبط بـ",
      functionality: "الوظائف",
      techStack: "التقنيات المستخدمة",
      importance: "الأهمية",
      size: "الحجم"
    },
    en: {
      title: "Documentation Export",
      description: "Download comprehensive user guide with detailed file structure map",
      formats: "Available Formats",
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
      searchPlaceholder: "Search files...",
      fileDetails: "File Details",
      dependencies: "Dependencies",
      connectedTo: "Connected To",
      functionality: "Functionality",
      techStack: "Tech Stack",
      importance: "Importance",
      size: "Size"
    },
  }

  const text = t[language]

  // فلترة الملفات حسب البحث
  const filterNodes = (nodes: { [key: string]: FileNode }, searchTerm: string): { [key: string]: FileNode } => {
    if (!searchTerm) return nodes

    const filtered: { [key: string]: FileNode } = {}

    Object.entries(nodes).forEach(([key, node]) => {
      const matchesSearch = 
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.purpose?.toLowerCase().includes(searchTerm.toLowerCase())

      if (matchesSearch) {
        filtered[key] = node
      } else if (node.children) {
        const filteredChildren = filterNodes(node.children, searchTerm)
        if (Object.keys(filteredChildren).length > 0) {
          filtered[key] = { ...node, children: filteredChildren }
        }
      }
    })

    return filtered
  }

  const filteredStructure = filterNodes(projectStructure, searchTerm)

  // مكون لعرض عقد شجرة الملفات المحسنة
  const FileTreeNode = ({ node, path }: { node: FileNode; path: string }) => {
    const isExpanded = expandedNodes.has(path)
    const Icon = node.icon || (node.type === "folder" ? Folder : File)
    const isSelected = selectedFile === path

    const toggleExpanded = () => {
      const newExpanded = new Set(expandedNodes)
      if (isExpanded) {
        newExpanded.delete(path)
      } else {
        newExpanded.add(path)
      }
      setExpandedNodes(newExpanded)
    }

    const selectFile = () => {
      setSelectedFile(isSelected ? null : path)
    }

    const getImportanceBadge = (importance?: string) => {
      const colors = {
        critical: "bg-red-100 text-red-800 border-red-200",
        high: "bg-orange-100 text-orange-800 border-orange-200", 
        medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
        low: "bg-green-100 text-green-800 border-green-200"
      }
      return colors[importance as keyof typeof colors] || colors.medium
    }

    return (
      <div className="ml-4">
        <div 
          className={`flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer group transition-all ${
            isSelected ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200" : ""
          }`}
          onClick={selectFile}
        >
          {node.type === "folder" && (
            <button 
              onClick={(e) => { e.stopPropagation(); toggleExpanded() }} 
              className="flex items-center pt-1"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}

          <Icon className={`w-5 h-5 ${node.color || "text-gray-500"} mt-0.5 flex-shrink-0`} />

          {node.thumbnail && (
            <div className="relative group/thumb">
              <img 
                src={node.thumbnail} 
                alt={node.name} 
                className="w-10 h-10 rounded-lg border border-gray-200 object-cover flex-shrink-0"
              />
              <div className="absolute -top-1 -right-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                <Camera className="w-3 h-3 text-blue-500" />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-sm truncate">{node.name}</span>
              <Badge variant="outline" className="text-xs flex-shrink-0">
                {node.type === "folder" ? "مجلد" : "ملف"}
              </Badge>
              {node.importance && (
                <Badge className={`text-xs flex-shrink-0 ${getImportanceBadge(node.importance)}`}>
                  {node.importance}
                </Badge>
              )}
              {node.size && (
                <Badge variant="outline" className="text-xs flex-shrink-0 bg-gray-100">
                  {node.size}
                </Badge>
              )}
            </div>

            {node.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
                {node.description}
              </p>
            )}

            {node.purpose && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-2 leading-relaxed">
                <strong>الغرض:</strong> {node.purpose}
              </p>
            )}

            {node.functionality && node.functionality.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-medium text-gray-500 mb-1">الوظائف الرئيسية:</p>
                <div className="flex flex-wrap gap-1">
                  {node.functionality.slice(0, 3).map((func, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {func}
                    </Badge>
                  ))}
                  {node.functionality.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{node.functionality.length - 3} أخرى
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {node.techStack && node.techStack.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-medium text-gray-500 mb-1">التقنيات:</p>
                <div className="flex flex-wrap gap-1">
                  {node.techStack.map((tech, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {node.type === "folder" && node.children && isExpanded && (
          <div className="mt-2 ml-4 border-l border-gray-200 dark:border-gray-600 pl-4">
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

  // مكون تفاصيل الملف المحدد
  const FileDetailsPanel = () => {
    if (!selectedFile) return null

    const pathParts = selectedFile.split("/")
    let current: any = projectStructure
    for (const part of pathParts) {
      current = current[part]?.children ? current[part] : current[part]
    }

    if (!current) return null

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            {text.fileDetails}: {current.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {current.purpose && (
            <div>
              <h4 className="font-medium text-sm mb-2">الغرض والهدف</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{current.purpose}</p>
            </div>
          )}

          {current.functionality && (
            <div>
              <h4 className="font-medium text-sm mb-2">{text.functionality}</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {current.functionality.map((func: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                    {func}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {current.dependencies && (
            <div>
              <h4 className="font-medium text-sm mb-2">{text.dependencies}</h4>
              <div className="flex flex-wrap gap-2">
                {current.dependencies.map((dep: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    <GitBranch className="w-3 h-3 mr-1" />
                    {dep}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {current.connectedTo && (
            <div>
              <h4 className="font-medium text-sm mb-2">{text.connectedTo}</h4>
              <div className="flex flex-wrap gap-2">
                {current.connectedTo.map((conn: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    {conn}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {current.techStack && (
            <div>
              <h4 className="font-medium text-sm mb-2">{text.techStack}</h4>
              <div className="flex flex-wrap gap-2">
                {current.techStack.map((tech: string, idx: number) => (
                  <Badge key={idx} className="text-xs bg-blue-100 text-blue-800">
                    <Package className="w-3 h-3 mr-1" />
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const documentationContent = `
# مراقب فيسبوك المتقدم - دليل المستخدم الشامل

## نظرة عامة على المشروع

مراقب فيسبوك المتقدم هو نظام متكامل ومتطور لمراقبة وتحليل المنشورات والتعليقات على فيسبوك، مع إمكانيات البحث عن أرقام الهواتف والتحليل المتقدم للبيانات.

## الميزات الرئيسية

- مراقبة المنشورات والتعليقات في الوقت الفعلي
- تحليلات متقدمة للبيانات
- البحث في قواعد بيانات أرقام الهواتف
- تصدير التقارير بصيغ متعددة
- واجهة مستخدم حديثة ومتجاوبة

## التقنيات المستخدمة

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Firebase
- Facebook Graph API

## الهيكل التنظيمي

يتكون المشروع من عدة مجلدات رئيسية:
- app/ - صفحات التطبيق ومسارات API
- components/ - مكونات واجهة المستخدم
- lib/ - الخدمات والمكتبات المساعدة
- docs/ - التوثيق والدلائل

تم إنشاء هذا الدليل تلقائياً من مراقب فيسبوك المتقدم.
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

  const generateEnhancedFileTreeHtml = (structure: { [key: string]: FileNode }) => {
    const generateNodeHtml = (node: FileNode, depth = 0): string => {
      const indent = "  ".repeat(depth)
      const importanceColors = {
        critical: "#ef4444",
        high: "#f97316", 
        medium: "#eab308",
        low: "#22c55e"
      }
      const borderColor = importanceColors[node.importance as keyof typeof importanceColors] || "#6b7280"

      const thumbnailHtml = node.thumbnail 
        ? `<img src="${node.thumbnail}" alt="${node.name}" style="width: 32px; height: 32px; border-radius: 8px; margin-left: 12px; border: 1px solid #e5e7eb;">` 
        : ""

      let html = `${indent}<div style="margin: 12px 0; padding: 16px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; border-left: 4px solid ${borderColor}; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          ${thumbnailHtml}
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <strong style="color: #1f2937; font-size: 16px;">${node.name}</strong>
              <span style="background: #e5e7eb; padding: 4px 8px; border-radius: 16px; font-size: 11px; font-weight: 600;">${node.type === "folder" ? "مجلد" : "ملف"}</span>
              ${node.importance ? `<span style="background: ${borderColor}; color: white; padding: 4px 8px; border-radius: 16px; font-size: 11px; font-weight: 600;">${node.importance}</span>` : ""}
              ${node.size ? `<span style="background: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 16px; font-size: 11px;">${node.size}</span>` : ""}
            </div>
            ${node.description ? `<div style="color: #6b7280; font-size: 14px; margin-bottom: 8px; line-height: 1.5;">${node.description}</div>` : ""}
            ${node.purpose ? `<div style="color: #2563eb; font-size: 13px; margin-bottom: 8px; line-height: 1.5;"><strong>الغرض:</strong> ${node.purpose}</div>` : ""}
          </div>
        </div>`

      if (node.functionality && node.functionality.length > 0) {
        html += `<div style="margin: 8px 0;">
          <div style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 4px;">الوظائف الرئيسية:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${node.functionality.slice(0, 4).map(func => 
              `<span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 12px; font-size: 11px;">${func}</span>`
            ).join('')}
            ${node.functionality.length > 4 ? `<span style="background: #f3f4f6; color: #6b7280; padding: 2px 8px; border-radius: 12px; font-size: 11px;">+${node.functionality.length - 4} أخرى</span>` : ""}
          </div>
        </div>`
      }

      if (node.techStack && node.techStack.length > 0) {
        html += `<div style="margin: 8px 0;">
          <div style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 4px;">التقنيات:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${node.techStack.map(tech => 
              `<span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 12px; font-size: 11px; border: 1px solid #fcd34d;">${tech}</span>`
            ).join('')}
          </div>
        </div>`
      }

      if (node.dependencies && node.dependencies.length > 0) {
        html += `<div style="margin: 8px 0;">
          <div style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 4px;">التبعيات:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${node.dependencies.slice(0, 3).map(dep => 
              `<span style="background: #ecfdf5; color: #065f46; padding: 2px 8px; border-radius: 12px; font-size: 11px; border: 1px solid #10b981;">${dep}</span>`
            ).join('')}
            ${node.dependencies.length > 3 ? `<span style="background: #f3f4f6; color: #6b7280; padding: 2px 8px; border-radius: 12px; font-size: 11px;">+${node.dependencies.length - 3} أخرى</span>` : ""}
          </div>
        </div>`
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
    setExporting(true)

    try {
      const fileTreeHtml = generateEnhancedFileTreeHtml(projectStructure)
      const currentDate = new Date().toLocaleDateString('ar-EG')

      const htmlContent = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مراقب فيسبوك المتقدم - دليل المستخدم الشامل مع خريطة الملفات التفصيلية</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔍</text></svg>">
    <style>
        body {
            font-family: 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', sans-serif;
            line-height: 1.7;
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
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            color: white;
        }
        h1 { color: white; font-size: 2.5em; margin-bottom: 10px; }
        h2 { color: #1e40af; margin-top: 40px; padding: 15px 20px; background: #dbeafe; border-radius: 10px; }
        .file-tree { background: #f8fafc; padding: 25px; border-radius: 15px; border: 2px solid #e2e8f0; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat-card { background: #f1f5f9; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #cbd5e1; }
        .stat-number { font-size: 2em; font-weight: bold; color: #1e40af; }
        .stat-label { color: #64748b; font-size: 0.9em; margin-top: 5px; }
        @media (max-width: 768px) { .container { padding: 20px; } h1 { font-size: 2em; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 مراقب فيسبوك المتقدم</h1>
            <p style="font-size: 1.2em; margin: 0;">دليل المستخدم الشامل مع خريطة الملفات التفصيلية</p>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">50+</div>
                <div class="stat-label">ملف ومكون</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">15+</div>
                <div class="stat-label">خدمة متخصصة</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${currentDate}</div>
                <div class="stat-label">تاريخ الإنشاء</div>
            </div>
        </div>
        <h2>🗂️ خريطة هيكل المشروع</h2>
        <div class="file-tree">
            ${fileTreeHtml}
        </div>
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 10px;">
            <p style="color: #64748b; font-style: italic;">تم إنشاء هذا التوثيق تلقائياً من مراقب فيسبوك المتقدم</p>
        </div>
    </div>
</body>
</html>`

      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "facebook-monitor-complete-guide-enhanced.html"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setExportStatus({ type: "success", message: text.success })
    } catch (error) {
      console.error('HTML export error:', error)
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
        {/* البحث في الملفات */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={text.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* شجرة الملفات المحسنة */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <TreePine className="w-4 h-4" />
            خريطة هيكل المشروع التفصيلية
            <Badge variant="secondary" className="text-xs">
              {Object.keys(filteredStructure).length} عنصر
            </Badge>
          </h4>
          <Card className="p-4 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {Object.entries(filteredStructure).map(([key, node]) => (
                <FileTreeNode key={key} node={node} path={key} />
              ))}
              {Object.keys(filteredStructure).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>لم يتم العثور على ملفات مطابقة</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* تفاصيل الملف المحدد */}
        <FileDetailsPanel />

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={exportAsHtml}
              disabled={exporting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {exporting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {exporting ? text.exporting : text.exportHtml}
            </Button>

            <Button onClick={exportAsText} variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {text.exportTxt}
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