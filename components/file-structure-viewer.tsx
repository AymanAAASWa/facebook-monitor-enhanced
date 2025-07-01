"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FolderTree,
  Folder,
  File,
  Search,
  Code,
  Database,
  Settings,
  Palette,
  BookOpen,
  Zap,
  Shield,
  TestTube,
  Package,
  ChevronRight,
  ChevronDown,
  Copy,
  Info,
} from "lucide-react"

interface FileStructureViewerProps {
  darkMode: boolean
  language: "ar" | "en"
}

export function FileStructureViewer({ darkMode, language }: FileStructureViewerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["app", "components", "lib"])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const fileStructure = {
    app: {
      name: "app",
      type: "folder",
      description: "تطبيق Next.js الرئيسي",
      icon: Folder,
      color: "text-blue-500",
      children: {
        "page.tsx": {
          name: "page.tsx",
          type: "file",
          description: "الصفحة الرئيسية - نقطة دخول التطبيق",
          icon: Code,
          color: "text-green-500",
          purpose: "عرض لوحة التحكم الرئيسية والإحصائيات",
          dependencies: ["components/facebook-monitor", "lib/firebase-service"],
        },
        "layout.tsx": {
          name: "layout.tsx",
          type: "file",
          description: "تخطيط التطبيق العام",
          icon: Code,
          color: "text-green-500",
          purpose: "تحديد الهيكل العام (Header, Sidebar, Footer)",
          dependencies: ["components/ui/*", "lib/app-context"],
        },
        "globals.css": {
          name: "globals.css",
          type: "file",
          description: "التنسيقات العامة والمتغيرات",
          icon: Palette,
          color: "text-pink-500",
          purpose: "التنسيقات الأساسية وألوان التطبيق",
        },
        api: {
          name: "api",
          type: "folder",
          description: "API Routes للخدمات",
          icon: Folder,
          color: "text-purple-500",
          children: {
            facebook: {
              name: "facebook",
              type: "folder",
              description: "API خدمات Facebook",
              icon: Folder,
              color: "text-blue-600",
              children: {
                "posts/route.ts": {
                  name: "posts/route.ts",
                  type: "file",
                  description: "API جلب المنشورات من Facebook",
                  icon: Code,
                  color: "text-green-500",
                  purpose: "جلب وتحليل منشورات Facebook",
                },
                "validate/route.ts": {
                  name: "validate/route.ts",
                  type: "file",
                  description: "API التحقق من صحة Access Token",
                  icon: Shield,
                  color: "text-yellow-500",
                  purpose: "التحقق من صحة وصلاحيات Facebook Token",
                },
              },
            },
            auth: {
              name: "auth",
              type: "folder",
              description: "API التوثيق",
              icon: Shield,
              color: "text-red-500",
              children: {
                "login/route.ts": {
                  name: "login/route.ts",
                  type: "file",
                  description: "API تسجيل الدخول",
                  icon: Shield,
                  color: "text-red-500",
                  purpose: "معالجة تسجيل الدخول والتوثيق",
                },
              },
            },
          },
        },
      },
    },
    components: {
      name: "components",
      type: "folder",
      description: "مكونات React القابلة لإعادة الاستخدام",
      icon: Folder,
      color: "text-green-500",
      children: {
        auth: {
          name: "auth",
          type: "folder",
          description: "مكونات التوثيق",
          icon: Shield,
          color: "text-red-500",
          children: {
            "login-form.tsx": {
              name: "login-form.tsx",
              type: "file",
              description: "نموذج تسجيل الدخول",
              icon: Code,
              color: "text-green-500",
              purpose: "نموذج تسجيل الدخول بالبريد الإلكتروني",
              dependencies: ["@/components/ui/input", "@/components/ui/button"],
            },
            "facebook-login-form.tsx": {
              name: "facebook-login-form.tsx",
              type: "file",
              description: "تسجيل دخول Facebook",
              icon: Code,
              color: "text-blue-500",
              purpose: "تسجيل الدخول باستخدام Facebook API",
              dependencies: ["lib/facebook-oauth-service"],
            },
          },
        },
        "analytics-dashboard.tsx": {
          name: "analytics-dashboard.tsx",
          type: "file",
          description: "لوحة التحليلات الأساسية",
          icon: Code,
          color: "text-green-500",
          purpose: "عرض الإحصائيات والرسوم البيانية",
          dependencies: ["lib/firebase-service", "components/ui/chart"],
        },
        "user-table.tsx": {
          name: "user-table.tsx",
          type: "file",
          description: "جدول المستخدمين",
          icon: Code,
          color: "text-green-500",
          purpose: "جدول قابل للفرز والبحث لعرض المستخدمين",
          dependencies: ["lib/phone-search-service", "components/ui/table"],
        },
        "facebook-monitor.tsx": {
          name: "facebook-monitor.tsx",
          type: "file",
          description: "مراقب Facebook الرئيسي",
          icon: Code,
          color: "text-blue-500",
          purpose: "المكون الرئيسي لمراقبة Facebook",
          dependencies: ["lib/facebook-service", "lib/firebase-service"],
        },
        "enhanced-data-viewer.tsx": {
          name: "enhanced-data-viewer.tsx",
          type: "file",
          description: "عارض البيانات المحسنة",
          icon: Code,
          color: "text-purple-500",
          purpose: "عرض البيانات المحسنة مع فلاتر متقدمة",
          dependencies: ["lib/firebase-enhanced-service"],
        },
        ui: {
          name: "ui",
          type: "folder",
          description: "مكونات واجهة المستخدم",
          icon: Palette,
          color: "text-pink-500",
          children: {
            "button.tsx": {
              name: "button.tsx",
              type: "file",
              description: "أزرار قابلة للتخصيص",
              icon: Code,
              color: "text-green-500",
              purpose: "مكون الأزرار مع أنماط مختلفة",
            },
            "card.tsx": {
              name: "card.tsx",
              type: "file",
              description: "بطاقات المحتوى",
              icon: Code,
              color: "text-green-500",
              purpose: "مكون البطاقات لعرض المحتوى",
            },
          },
        },
      },
    },
    lib: {
      name: "lib",
      type: "folder",
      description: "مكتبات ووظائف مساعدة",
      icon: Database,
      color: "text-orange-500",
      children: {
        "firebase.ts": {
          name: "firebase.ts",
          type: "file",
          description: "إعداد Firebase",
          icon: Database,
          color: "text-orange-500",
          purpose: "إعداد الاتصال مع Firebase",
          dependencies: ["firebase/app", "firebase/firestore"],
        },
        "firebase-service.ts": {
          name: "firebase-service.ts",
          type: "file",
          description: "خدمات Firebase الأساسية",
          icon: Database,
          color: "text-orange-500",
          purpose: "عمليات CRUD الأساسية مع Firebase",
          dependencies: ["lib/firebase"],
        },
        "facebook-service.ts": {
          name: "facebook-service.ts",
          type: "file",
          description: "خدمة Facebook API الأساسية",
          icon: Code,
          color: "text-blue-500",
          purpose: "الوظائف الأساسية للتفاعل مع Facebook API",
          dependencies: ["axios"],
        },
        "enhanced-facebook-service.ts": {
          name: "enhanced-facebook-service.ts",
          type: "file",
          description: "خدمة Facebook المحسنة",
          icon: Zap,
          color: "text-purple-500",
          purpose: "خدمات محسنة مع ذكاء اصطناعي",
          dependencies: ["lib/facebook-service", "lib/data-processor"],
        },
        "phone-search-service.ts": {
          name: "phone-search-service.ts",
          type: "file",
          description: "خدمة البحث عن الأرقام",
          icon: Search,
          color: "text-green-600",
          purpose: "البحث السريع في أرقام الهواتف",
          dependencies: ["lib/large-file-search-service"],
        },
        "utils.ts": {
          name: "utils.ts",
          type: "file",
          description: "وظائف مساعدة عامة",
          icon: Settings,
          color: "text-gray-500",
          purpose: "وظائف مساعدة وأدوات عامة",
        },
      },
    },
    data: {
      name: "data",
      type: "folder",
      description: "بيانات تجريبية وثابتة",
      icon: Database,
      color: "text-cyan-500",
      children: {
        "test-phone-data.json": {
          name: "test-phone-data.json",
          type: "file",
          description: "بيانات أرقام هواتف تجريبية",
          icon: File,
          color: "text-cyan-500",
          purpose: "بيانات تجريبية لاختبار البحث عن الأرقام",
        },
      },
    },
    docs: {
      name: "docs",
      type: "folder",
      description: "التوثيق والدلائل",
      icon: BookOpen,
      color: "text-indigo-500",
      children: {
        "project-documentation.md": {
          name: "project-documentation.md",
          type: "file",
          description: "التوثيق الشامل للمشروع",
          icon: BookOpen,
          color: "text-indigo-500",
          purpose: "دليل شامل لاستخدام وتطوير المشروع",
        },
        "site-map.md": {
          name: "site-map.md",
          type: "file",
          description: "خريطة الموقع",
          icon: BookOpen,
          color: "text-indigo-500",
          purpose: "خريطة تفاعلية لجميع صفحات الموقع",
        },
        "file-structure-map.md": {
          name: "file-structure-map.md",
          type: "file",
          description: "خريطة الملفات",
          icon: BookOpen,
          color: "text-indigo-500",
          purpose: "دليل شامل لهيكل الملفات والمجلدات",
        },
      },
    },
  }

  const dataFlows = [
    {
      name: "تدفق جلب البيانات",
      description: "كيفية جلب البيانات من Facebook وحفظها",
      steps: [
        "المستخدم → settings-panel.tsx",
        "settings-panel.tsx → facebook-service.ts",
        "facebook-service.ts → Facebook API",
        "Facebook API → firebase-service.ts",
        "firebase-service.ts → Firebase Database",
      ],
    },
    {
      name: "تدفق معالجة البيانات",
      description: "معالجة وتحليل البيانات المحفوظة",
      steps: [
        "Firebase Database → data-processor.ts",
        "data-processor.ts → advanced-analytics-service.ts",
        "advanced-analytics-service.ts → analytics-dashboard.tsx",
        "analytics-dashboard.tsx → المستخدم",
      ],
    },
    {
      name: "تدفق البحث عن الأرقام",
      description: "البحث في قاعدة بيانات أرقام الهواتف",
      steps: [
        "المستخدم → phone-database-manager.tsx",
        "phone-database-manager.tsx → large-file-search-service.ts",
        "large-file-search-service.ts → phone-search-service.ts",
        "phone-search-service.ts → النتائج → المستخدم",
      ],
    },
  ]

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => (prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]))
  }

  const renderFileTree = (items: any, basePath = "") => {
    return Object.entries(items).map(([key, item]: [string, any]) => {
      const fullPath = basePath ? `${basePath}/${key}` : key
      const isExpanded = expandedFolders.includes(fullPath)
      const isSelected = selectedFile === fullPath

      return (
        <div key={fullPath} className="ml-4">
          <div
            className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${
              isSelected ? "bg-blue-50 border-l-2 border-blue-500" : ""
            }`}
            onClick={() => {
              if (item.type === "folder") {
                toggleFolder(fullPath)
              } else {
                setSelectedFile(fullPath)
              }
            }}
          >
            {item.type === "folder" && (
              <span className="w-4 h-4">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </span>
            )}
            <item.icon className={`w-4 h-4 ${item.color}`} />
            <span className="font-medium">{item.name}</span>
            {item.type === "folder" && (
              <Badge variant="outline" className="text-xs">
                {Object.keys(item.children || {}).length}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600 ml-10 mb-2">{item.description}</p>
          {item.type === "folder" && isExpanded && item.children && (
            <div className="ml-4 border-l border-gray-200 pl-2">{renderFileTree(item.children, fullPath)}</div>
          )}
        </div>
      )
    })
  }

  const getSelectedFileDetails = () => {
    const pathParts = selectedFile?.split("/") || []
    let current = fileStructure
    for (const part of pathParts) {
      if (current[part]) {
        current = current[part].children || current[part]
      }
    }
    return current
  }

  const selectedFileDetails = selectedFile ? getSelectedFileDetails() : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="w-5 h-5" />
            خريطة الملفات التفاعلية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="البحث في الملفات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File Tree */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="structure" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="structure">هيكل الملفات</TabsTrigger>
              <TabsTrigger value="flows">تدفق البيانات</TabsTrigger>
              <TabsTrigger value="categories">التصنيفات</TabsTrigger>
            </TabsList>

            <TabsContent value="structure">
              <Card className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
                <CardHeader>
                  <CardTitle className="text-lg">هيكل المشروع</CardTitle>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto">
                  <div className="space-y-2">{renderFileTree(fileStructure)}</div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="flows">
              <div className="space-y-4">
                {dataFlows.map((flow, index) => (
                  <Card key={index} className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
                    <CardHeader>
                      <CardTitle className="text-lg">{flow.name}</CardTitle>
                      <p className="text-sm text-gray-600">{flow.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {flow.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                              {stepIndex + 1}
                            </span>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">{step}</code>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "التطبيق", icon: Code, color: "text-blue-500", count: 15 },
                  { name: "المكونات", icon: Package, color: "text-green-500", count: 25 },
                  { name: "المكتبات", icon: Database, color: "text-orange-500", count: 18 },
                  { name: "التوثيق", icon: BookOpen, color: "text-indigo-500", count: 8 },
                  { name: "البيانات", icon: Database, color: "text-cyan-500", count: 5 },
                  { name: "الاختبارات", icon: TestTube, color: "text-purple-500", count: 12 },
                ].map((category) => (
                  <Card key={category.name} className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
                    <CardContent className="p-4 text-center">
                      <category.icon className={`w-8 h-8 mx-auto mb-2 ${category.color}`} />
                      <h3 className="font-semibold">{category.name}</h3>
                      <Badge variant="outline">{category.count} ملف</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* File Details */}
        <div>
          <Card className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
            <CardHeader>
              <CardTitle className="text-lg">تفاصيل الملف</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedFileDetails ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <selectedFileDetails.icon className={`w-6 h-6 ${selectedFileDetails.color}`} />
                    <h3 className="font-semibold">{selectedFileDetails.name}</h3>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">الوصف:</h4>
                    <p className="text-sm text-gray-600">{selectedFileDetails.description}</p>
                  </div>

                  {selectedFileDetails.purpose && (
                    <div>
                      <h4 className="font-medium mb-1">الغرض:</h4>
                      <p className="text-sm text-gray-600">{selectedFileDetails.purpose}</p>
                    </div>
                  )}

                  {selectedFileDetails.dependencies && (
                    <div>
                      <h4 className="font-medium mb-2">التبعيات:</h4>
                      <div className="space-y-1">
                        {selectedFileDetails.dependencies.map((dep: string, index: number) => (
                          <code key={index} className="block text-xs bg-gray-100 px-2 py-1 rounded">
                            {dep}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(selectedFile || "")}
                      className="flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      نسخ المسار
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Info className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">اختر ملفاً من الشجرة لعرض تفاصيله</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
