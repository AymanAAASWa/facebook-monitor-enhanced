"use client"

import { useState, useEffect } from "react"
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
  Terminal,
  Eye,
  ExternalLink,
  Copy,
  Layers,
  Cpu,
  Monitor,
  Smartphone,
  Phone
} from "lucide-react"

interface DocumentationExportProps {
  darkMode: boolean
  language: "ar" | "en"
}

// محتوى ملف project-documentation.md مدمج في الكود
const projectDocumentation = `# Facebook Monitor - مستند المشروع

## آخر التحديثات

### تحديث 2024-01-31: تحسين واجهة المستخدم للأجهزة المحمولة واللوحية وأجهزة الكمبيوتر

#### المشاكل التي تم حلها:
1. **مشكلة أزرار المستخدم**: تم إصلاح مشكلة وجود زرين ("عرض المنشورات" و "عرض التفاصيل") يقومان بنفس الوظيفة
2. **البيانات الفارغة**: تم حل مشكلة عودة البيانات فارغة في عارض تحليلات المستخدم
3. **التحسين للأجهزة المختلفة**: تم تحسين جميع المكونات للعمل بكفاءة على الموبايل والتابلت وأجهزة الكمبيوتر

#### التحسينات المضافة:

##### 1. تحسين مكون EnhancedPostsList:
- **أزرار منفصلة للمستخدمين**:
  - زر "عرض المنشورات" (FileText icon): يفتح عارض منشورات المستخدم الفردية
  - زر "عرض التحليلات" (BarChart3 icon): يفتح عارض التحليلات التفصيلية
- **تحسين الاستجابة**:
  - شبكة مرنة للبحث والتصفية (1 عمود للموبايل، 2 للتابلت، 4 للكمبيوتر)
  - تحسين أحجام الخطوط والأيقونات حسب حجم الشاشة
  - تحسين المسافات والحشو للأجهزة المختلفة

## نظرة عامة على المشروع

Facebook Monitor هو تطبيق ويب متقدم لمراقبة وتحليل البيانات من Facebook، مبني باستخدام Next.js و TypeScript.

### الميزات الرئيسية:
- مراقبة المنشورات والتعليقات
- البحث عن أرقام الهواتف
- تحليلات المستخدمين
- إدارة التعليقات والردود
- تصدير البيانات والتقارير
- واجهة متجاوبة لجميع الأجهزة

### البنية التقنية:
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API Routes
- **قاعدة البيانات**: Firebase (اختياري)
- **تخزين الملفات**: Google Drive API

### المتطلبات:
- Node.js 18+
- Facebook Access Token
- اتصال إنترنت مستقر

### التثبيت والتشغيل:
\`\`\`bash
npm install
npm run dev
\`\`\``

// محتوى ملف site-map.md مدمج في الكود
const siteMapContent = `# خريطة الموقع - مراقب فيسبوك المتقدم

## 🗺️ الهيكل العام للموقع

### 📱 الصفحة الرئيسية (\`/\`)
- **الوصف**: نقطة البداية للتطبيق
- **المكونات**:
  - شريط التنقل العلوي
  - لوحة التحكم الرئيسية
  - إحصائيات سريعة
  - أزرار الوصول السريع

### 🔐 نظام التوثيق
#### تسجيل الدخول (\`/auth/login\`)
- **الوظيفة**: تسجيل الدخول للمستخدمين
- **الميزات**:
  - تسجيل دخول بالبريد الإلكتروني
  - تسجيل دخول بـ Facebook
  - تسجيل دخول بـ Google
  - حفظ بيانات الجلسة

### 📊 لوحات التحكم

#### 🏠 لوحة التحكم الرئيسية (\`/dashboard\`)
- **المحتوى**:
  - إحصائيات عامة
  - آخر المنشورات
  - التنبيهات المهمة
  - الوصول السريع للأدوات

#### 📈 لوحة التحليلات (\`/analytics\`)
- **الأقسام**:
  - تحليلات المنشورات
  - إحصائيات المستخدمين
  - تحليل التفاعل
  - الرسوم البيانية
  - التقارير المفصلة

### 📱 إدارة المحتوى

#### 📝 المنشورات (\`/posts\`)
- **الميزات**:
  - عرض جميع المنشورات
  - فلترة حسب المصدر
  - البحث في المحتوى
  - عرض التعليقات
  - تحميل الوسائط

## 🧭 مسارات التنقل الرئيسية

### 🏃‍♂️ المسار السريع للمبتدئين
1. **البداية** → \`/\` (الصفحة الرئيسية)
2. **التوثيق** → \`/auth/login\` (تسجيل الدخول)
3. **الإعداد** → \`/settings/facebook\` (إعداد Facebook API)
4. **البيانات** → \`/phone-database\` (تحميل قاعدة الأرقام)
5. **المراقبة** → \`/posts\` (بدء المراقبة)`

// بيانات هيكل المشروع المفصل مع الأكواد والشرح
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
  codeExample?: string
  fullCode?: string
  explanation?: string
}

const projectStructure: { [key: string]: FileNode } = {
  app: {
    name: "app",
    type: "folder",
    description: "مجلد التطبيق الرئيسي - Next.js App Router",
    purpose: "يحتوي على جميع صفحات التطبيق والمسارات وAPI routes",
    functionality: [
      "إدارة المسارات (App Router)",
      "صفحات التطبيق الرئيسية",
      "API endpoints للخدمات",
      "تخطيط التطبيق العام (Layout)",
      "أنماط CSS العامة"
    ],
    techStack: ["Next.js 15", "App Router", "TypeScript", "React Server Components"],
    importance: "critical",
    icon: Folder,
    color: "text-blue-500",
    explanation: "مجلد app هو قلب التطبيق في Next.js 13+ مع App Router. يحتوي على جميع الصفحات والتخطيطات وAPI routes.",
    children: {
      "page.tsx": {
        name: "page.tsx",
        type: "file",
        description: "الصفحة الرئيسية للتطبيق",
        purpose: "عرض لوحة التحكم الرئيسية مع جميع مكونات المراقبة",
        functionality: [
          "عرض مكون FacebookMonitor الرئيسي",
          "إدارة حالة التطبيق العامة",
          "تنسيق التخطيط العام للصفحة",
          "ربط جميع المكونات معاً"
        ],
        dependencies: [
          "components/facebook-monitor.tsx",
          "components/analytics-dashboard.tsx",
          "lib/app-context.tsx"
        ],
        techStack: ["Next.js", "React", "TypeScript"],
        importance: "critical",
        icon: Code,
        color: "text-green-500",
        size: "~2KB",
        codeExample: `export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">مراقب فيسبوك المتقدم</h1>
        <FacebookMonitor />
      </div>
    </main>
  )
}`,
        explanation: "هذا هو الملف الرئيسي للصفحة الأولى. يستخدم Next.js App Router ويعرض المكون الرئيسي FacebookMonitor مع تصميم جميل ومتجاوب."
      },
      "layout.tsx": {
        name: "layout.tsx",
        type: "file",
        description: "التخطيط العام للتطبيق",
        purpose: "يحدد الهيكل العام لجميع صفحات التطبيق",
        functionality: [
          "تحديد HTML و body tags",
          "تضمين الخطوط والأنماط العامة",
          "إعداد Providers (Context, Theme)",
          "تطبيق التصميم المتجاوب",
          "إعداد metadata للتطبيق"
        ],
        dependencies: [
          "globals.css",
          "components/theme-provider.tsx",
          "lib/app-context.tsx"
        ],
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        importance: "critical",
        icon: Layers,
        color: "text-purple-500",
        size: "~3KB",
        codeExample: `export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-cairo">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}`,
        explanation: "ملف التخطيط الجذر الذي يحيط بجميع صفحات التطبيق. يحدد اللغة العربية واتجاه RTL ويضمن المزودين العامين."
      },
      "globals.css": {
        name: "globals.css",
        type: "file",
        description: "الأنماط العامة للتطبيق",
        purpose: "تحديد المتغيرات والأنماط الأساسية لجميع صفحات التطبيق",
        functionality: [
          "متغيرات الألوان للثيم الفاتح والداكن",
          "خطوط التطبيق (Arabic fonts)",
          "أنماط Tailwind الأساسية",
          "أنماط مخصصة للمكونات",
          "تنسيقات RTL للعربية"
        ],
        dependencies: ["tailwind.config.ts", "postcss.config.mjs"],
        techStack: ["CSS3", "Tailwind CSS", "CSS Variables"],
        importance: "high",
        icon: Palette,
        color: "text-pink-500",
        size: "~5KB",
        codeExample: `:root {
  --primary: 222.2 84% 4.9%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
}

body {
  font-family: 'Cairo', 'Segoe UI', sans-serif;
  direction: rtl;
}`,
        explanation: "ملف الأنماط الرئيسي الذي يحدد جميع المتغيرات والأنماط الأساسية. يدعم الثيم الداكن والفاتح والخطوط العربية."
      },
      api: {
        name: "api",
        type: "folder",
        description: "مجلد API Routes للتطبيق",
        purpose: "يحتوي على جميع endpoints الخاصة بالخدمات الخلفية",
        functionality: [
          "API routes لـ Facebook",
          "معالجة طلبات البيانات",
          "التحقق من التوثيق",
          "إدارة الأخطاء",
          "ربط مع قواعد البيانات"
        ],
        importance: "critical",
        icon: Database,
        color: "text-orange-500",
        children: {
          facebook: {
            name: "facebook",
            type: "folder",
            description: "API routes خاصة بـ Facebook",
            purpose: "معالجة جميع طلبات Facebook API",
            children: {
              "posts/route.ts": {
                name: "route.ts",
                type: "file",
                description: "API endpoint لجلب المنشورات",
                purpose: "جلب وإدارة منشورات Facebook",
                functionality: [
                  "GET: جلب المنشورات من Facebook",
                  "POST: إنشاء منشور جديد",
                  "معالجة الأخطاء",
                  "التحقق من Access Token",
                  "حفظ البيانات في قاعدة البيانات"
                ],
                techStack: ["Next.js API Routes", "Facebook Graph API", "TypeScript"],
                importance: "critical",
                icon: Code,
                color: "text-blue-600",
                codeExample: `export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source')

    const facebookService = new FacebookService()
    const posts = await facebookService.getPosts({ source })

    return NextResponse.json({ success: true, data: posts })
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}`,
                explanation: "API endpoint يتعامل مع جلب المنشورات من Facebook Graph API ويرجع البيانات بتنسيق JSON."
              },
              "comments/route.ts": {
                name: "route.ts", 
                type: "file",
                description: "API endpoint للتعليقات",
                purpose: "إدارة تعليقات Facebook",
                functionality: [
                  "جلب تعليقات المنشورات",
                  "إضافة تعليقات جديدة",
                  "حذف وتعديل التعليقات",
                  "فلترة التعليقات",
                  "إحصائيات التعليقات"
                ],
                importance: "high",
                icon: Code,
                color: "text-green-600"
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
    description: "مجلد المكونات القابلة لإعادة الاستخدام",
    purpose: "يحتوي على جميع مكونات React الخاصة بالتطبيق",
    functionality: [
      "مكونات واجهة المستخدم",
      "مكونات إدارة البيانات",
      "مكونات التحليلات",
      "مكونات النماذج",
      "مكونات العرض"
    ],
    importance: "critical",
    icon: Folder,
    color: "text-green-500",
    children: {
      "facebook-monitor.tsx": {
        name: "facebook-monitor.tsx",
        type: "file",
        description: "المكون الرئيسي لمراقبة Facebook",
        purpose: "المكون الأساسي الذي يجمع جميع وظائف المراقبة",
        functionality: [
          "واجهة المراقبة الرئيسية",
          "تبويبات للمنشورات والتعليقات والتحليلات",
          "إدارة حالة البيانات",
          "ربط مع Facebook API",
          "عرض النتائج والإحصائيات"
        ],
        dependencies: [
          "enhanced-posts-list.tsx",
          "analytics-dashboard.tsx",
          "user-analytics-viewer.tsx",
          "lib/enhanced-facebook-service.ts"
        ],
        techStack: ["React 18", "TypeScript", "Tailwind CSS", "Shadcn/ui"],
        importance: "critical",
        icon: Monitor,
        color: "text-blue-500",
        size: "~12KB",
        codeExample: `export function FacebookMonitor() {
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([])

  return (
    <Card>
      <CardHeader>
        <CardTitle>مراقب فيسبوك المتقدم</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="posts">المنشورات</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <EnhancedPostsList posts={posts} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}`,
        explanation: "المكون الرئيسي الذي يجمع جميع وظائف المراقبة في واجهة موحدة مع تبويبات منظمة."
      },
      "enhanced-posts-list.tsx": {
        name: "enhanced-posts-list.tsx",
        type: "file", 
        description: "قائمة المنشورات المحسنة",
        purpose: "عرض وإدارة منشورات Facebook بواجهة متقدمة",
        functionality: [
          "عرض المنشورات مع معلومات تفصيلية",
          "البحث والفلترة المتقدمة",
          "أزرار للتحليلات والمنشورات الفردية",
          "عرض الوسائط والمرفقات",
          "إحصائيات التفاعل",
          "واجهة متجاوبة للجوال"
        ],
        dependencies: [
          "user-analytics-viewer.tsx",
          "lib/enhanced-facebook-service.ts",
          "lib/phone-search-service.ts"
        ],
        importance: "critical",
        icon: FileText,
        color: "text-green-600",
        size: "~25KB",
        explanation: "مكون متقدم لعرض المنشورات مع ميزات البحث والتحليل وواجهة محسنة للجوال."
      },
      "user-analytics-viewer.tsx": {
        name: "user-analytics-viewer.tsx",
        type: "file",
        description: "عارض تحليلات المستخدم",
        purpose: "عرض تحليلات تفصيلية لنشاط المستخدمين",
        functionality: [
          "إحصائيات شاملة للمستخدم",
          "تحليل أنماط النشاط",
          "رسوم بيانية تفاعلية",
          "تبويبات متعددة للبيانات",
          "معدلات التفاعل",
          "النشاط عبر الوقت"
        ],
        importance: "high",
        icon: Cpu,
        color: "text-purple-600",
        codeExample: `// مكون تحليلات المستخدم المفصلة - محسن
export function UserAnalyticsViewer({
  userId,
  posts,
  darkMode,
  language,
  onClose,
}: UserAnalyticsViewerProps) {
  // حساب إحصائيات شاملة مع نظام النقاط الجديد
  const userStats = useMemo(() => {
    // نقاط النشاط: منشور=10، تعليق=5، إعجاب=2، مشاركة=15
    const activityScore = (userPosts.length * 10) + (userComments.length * 5) + 
                         (totalLikes * 2) + (totalShares * 15)

    // نقاط التأثير: متوسط التفاعل × جودة المحتوى
    const influenceScore = Math.round(((totalLikes + totalShares) / 
                          Math.max(userPosts.length, 1)) * 10) / 10

    return {
      totalPosts, totalComments, totalLikes, totalShares,
      activityScore, influenceScore, engagementRate,
      activityTimeline // يشمل المشاركات الآن
    }
  }, [userId, posts])

  return (
    <div className="space-y-6">
      {/* 6 بطاقات إحصائيات: المنشورات، التعليقات، الإعجابات، المشاركات، نقاط النشاط، نقاط التأثير */}
      {/* تبويبات محسنة مع تفاصيل أكثر */}
    </div>
  )
}`,
        explanation: "مكون متخصص في عرض تحليلات عميقة لنشاط المستخدمين الفرديين.",
            children: [
              {
                name: "demographics-map-viewer.tsx",
                type: "file",
                description: "مكون جديد لعرض الديموغرافيا والخريطة",
                purpose: "عرض معلومات ديموغرافية للمستخدمين وتوزيعهم الجغرافي",
                codeExample: `// مكون جديد لعرض الديموغرافيا والخريطة
export function DemographicsMapViewer({ users, darkMode, language }: DemographicsMapViewerProps) {
  // تحليل الديموغرافيا
  const demographics = useMemo(() => {
    // تجميع الأعمار في فئات (18-24، 25-34، إلخ)
    const ageGroups = {
      "18-24": users.filter(u => u.age >= 18 && u.age <= 24).length,
      "25-34": users.filter(u => u.age >= 25 && u.age <= 34).length,
      // ...المزيد
    }

    // تحليل المواقع الجغرافية
    const locationCounts = users.reduce((acc, user) => {
      const location = user.location || "غير محدد"
      acc[location] = (acc[location] || 0) + 1
      return acc
    }, {})

    // تحديد المستخدمين المميزين (VIP)
    const vipUsers = users
      .filter(u => u.activityScore > 100 || u.influenceScore > 50)
      .sort((a, b) => (b.activityScore + b.influenceScore) - (a.activityScore + a.influenceScore))

    // تتبع أعياد الميلاد القادمة
    const upcomingBirthdays = users
      .filter(u => u.birthday)
      .map(u => calculateDaysUntilBirthday(u.birthday))
      .sort((a, b) => a.daysUntil - b.daysUntil)

    return { ageGroups, locationCounts, vipUsers, upcomingBirthdays }
  }, [users])

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      <TabsList>
        <TabsTrigger value="map">الخريطة</TabsTrigger>
        <TabsTrigger value="ages">الأعمار</TabsTrigger>
        <TabsTrigger value="locations">المواقع</TabsTrigger>
        <TabsTrigger value="vip">المستخدمون المميزون</TabsTrigger>
        <TabsTrigger value="birthdays">أعياد الميلاد</TabsTrigger>
      </TabsList>

      {/* محتوى كل تبويب مع تصور البيانات */}
    </Tabs>
  )
}

// الواجهات المطلوبة
interface UserDemographic {
  id: string
  name: string
  age?: number
  location?: string
  work?: string
  birthday?: string
  activityScore: number
  influenceScore: number
  isVIP?: boolean
}`,
              }
            ]
      },
      ui: {
        name: "ui",
        type: "folder",
        description: "مكونات واجهة المستخدم الأساسية",
        purpose: "مكونات Shadcn/ui للواجهة",
        functionality: [
          "أزرار وحقول إدخال",
          "بطاقات وحوارات",
          "تبويبات وقوائم",
          "عناصر التنقل",
          "مكونات النماذج"
        ],
        importance: "high",
        icon: Smartphone,
        color: "text-gray-500",
        children: {
          "button.tsx": {
            name: "button.tsx",
            type: "file",
            description: "مكون الأزرار",
            purpose: "أزرار قابلة للتخصيص مع أنماط متعددة",
            techStack: ["React", "TypeScript", "Tailwind CSS", "Class Variance Authority"],
            importance: "medium",
            icon: Code,
            color: "text-blue-400"
          },
          "card.tsx": {
            name: "card.tsx", 
            type: "file",
            description: "مكون البطاقات",
            purpose: "بطاقات لعرض المحتوى مع رأس وقدم",
            importance: "medium",
            icon: Code,
            color: "text-green-400"
          }
        }
      }
    }
  },
  lib: {
    name: "lib",
    type: "folder",
    description: "مكتبة الخدمات والأدوات المساعدة",
    purpose: "يحتوي على جميع المنطق التجاري والخدمات",
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
    children: {
      "enhanced-facebook-service.ts": {
        name: "enhanced-facebook-service.ts",
        type: "file",
        description: "خدمة Facebook المحسنة",
        purpose: "التعامل مع Facebook Graph API بشكل متقدم",
        functionality: [
          "جلب المنشورات مع بيانات شاملة",
          "تحليل التفاعلات والتعليقات",
          "البحث عن أرقام الهواتف",
          "معالجة الوسائط والمرفقات",
          "إدارة حدود API والأخطاء"
        ],
        dependencies: ["facebook-service.ts", "phone-search-service.ts"],
        techStack: ["TypeScript", "Facebook Graph API", "Axios"],
        importance: "critical",
        icon: Code,
        color: "text-blue-600",
        size: "~15KB",
        codeExample: `export class EnhancedFacebookService {
  async getEnhancedPosts(options: PostOptions): Promise<Post[]> {
    const posts = await this.fetchPosts(options)
    return await Promise.all(
      posts.map(post => this.enhancePost(post))
    )
  }

  private async enhancePost(post: FacebookPost): Promise<Post> {
    const phoneNumber = await this.searchAuthorPhone(post.from.id)
    return {
      ...post,
      author: { ...post.from, phoneNumber }
    }
  }
}`,
        explanation: "خدمة متقدمة تتعامل مع Facebook API وتضيف ميزات إضافية مثل البحث عن أرقام الهواتف."
      },
      "phone-search-service.ts": {
        name: "phone-search-service.ts",
        type: "file",
        description: "خدمة البحث عن أرقام الهواتف",
        purpose: "البحث وإدارة قاعدة بيانات أرقام الهواتف",
        functionality: [
          "البحث بالاسم والرقم",
          "إدارة قاعدة البيانات",
          "فهرسة البيانات للبحث السريع",
          "تحميل من مصادر متعددة",
          "تصدير واستيراد البيانات"
        ],
        importance: "high",
        icon: Phone,
        color: "text-green-600",
        explanation: "خدمة متخصصة في البحث عن أرقام الهواتف مع فهرسة متقدمة وبحث سريع."
      }
    }
  },
  docs: {
    name: "docs",
    type: "folder",
    description: "ملفات التوثيق والمساعدة",
    purpose: "يحتوي على جميع ملفات التوثيق والشروحات",
    functionality: [
      "توثيق المشروع الشامل",
      "خريطة هيكل الملفات",
      "خريطة الموقع والتنقل",
      "أدلة الاستخدام",
      "شرح الميزات الجديدة"
    ],
    importance: "high",
    icon: BookOpen,
    color: "text-indigo-500",
    children: {
      "project-documentation.md": {
        name: "project-documentation.md",
        type: "file",
        description: "التوثيق الشامل للمشروع",
        purpose: "شرح كامل للمشروع وميزاته وآخر التحديثات",
        size: "~15KB",
        icon: FileText,
        color: "text-blue-600",
        fullCode: projectDocumentation,
        explanation: "ملف التوثيق الرئيسي الذي يشرح المشروع وميزاته وآخر التحديثات بالتفصيل."
      },
      "site-map.md": {
        name: "site-map.md",
        type: "file",
        description: "خريطة الموقع وطرق التنقل",
        purpose: "دليل التنقل في التطبيق مع التحسينات",
        size: "~12KB",
        icon: Globe,
        color: "text-purple-600",
        fullCode: siteMapContent,
        explanation: "خريطة شاملة للموقع تساعد في التنقل وفهم هيكل التطبيق."
      }
    }
  }
}

export function DocumentationExport({ darkMode, language }: DocumentationExportProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["app", "components", "lib", "docs"]))
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCode, setShowCode] = useState<string | null>(null)

  const t = {
    ar: {
      title: "توثيق المشروع التفاعلي",
      description: "استكشف هيكل المشروع والأكواد بالتفصيل",
      search: "البحث في الملفات...",
      viewCode: "عرض الكود",
      hideCode: "إخفاء الكود",
      copyCode: "نسخ الكود",
      explanation: "الشرح",
      functionality: "الوظائف",
      dependencies: "التبعيات",
      techStack: "التقنيات",
      importance: "الأهمية",
      size: "الحجم",
      exportHtml: "تصدير HTML",
      exportJson: "تصدير JSON",
      fileStructure: "هيكل الملفات التفاعلي",
      projectDocs: "توثيق المشروع",
      codeExample: "مثال على الكود",
      fullCode: "الكود الكامل"
    },
    en: {
      title: "Interactive Project Documentation", 
      description: "Explore project structure and code in detail",
      search: "Search files...",
      viewCode: "View Code",
      hideCode: "Hide Code", 
      copyCode: "Copy Code",
      explanation: "Explanation",
      functionality: "Functionality",
      dependencies: "Dependencies",
      techStack: "Tech Stack",
      importance: "Importance",
      size: "Size",
      exportHtml: "Export HTML",
      exportJson: "Export JSON",
      fileStructure: "Interactive File Structure",
      projectDocs: "Project Documentation",
      codeExample: "Code Example",
      fullCode: "Full Code"
    }
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
        node.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.explanation?.toLowerCase().includes(searchTerm.toLowerCase())

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

  // مكون عرض عقدة الملف
  const FileTreeNode = ({ node, path }: { node: FileNode; path: string }) => {
    const isExpanded = expandedNodes.has(path)
    const Icon = node.icon || (node.type === "folder" ? Folder : File)
    const isSelected = selectedFile === path
    const hasCode = !!(node.codeExample || node.fullCode)

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

    const toggleCode = () => {
      setShowCode(showCode === path ? null : path)
    }

    const copyToClipboard = (code: string) => {
      navigator.clipboard.writeText(code)
      alert('تم نسخ الكود!')
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
          className={`flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer group transition-all ${
            isSelected ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200" : ""
          }`}
          onClick={selectFile}
        >
          {node.type === "folder" && (
            <button 
              onClick={(e) => { e.stopPropagation(); toggleExpanded() }} 
              className="flex items-center pt-1"
            >              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}

          <Icon className={`w-6 h-6 ${node.color || "text-gray-500"} mt-0.5 flex-shrink-0`} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-semibold text-lg">{node.name}</span>
              <Badge variant="outline" className="text-xs">
                {node.type === "folder" ? "📁 مجلد" : "📄 ملف"}
              </Badge>
              {node.importance && (
                <Badge className={`text-xs ${getImportanceBadge(node.importance)}`}>
                  {node.importance}
                </Badge>
              )}
              {node.size && (
                <Badge variant="outline" className="text-xs bg-gray-100">
                  {node.size}
                </Badge>
              )}
              {hasCode && (
                <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                  <Code className="w-3 h-3 mr-1" />
                  كود متاح
                </Badge>
              )}
            </div>

            {node.description && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed font-medium">
                {node.description}
              </p>
            )}

            {node.purpose && (
              <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-1">الغرض:</h5>
                <p className="text-sm text-blue-700 dark:text-blue-300">{node.purpose}</p>
              </div>
            )}

            {node.explanation && (
              <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h5 className="font-medium text-sm text-green-800 dark:text-green-200 mb-1">{text.explanation}:</h5>
                <p className="text-sm text-green-700 dark:text-green-300">{node.explanation}</p>
              </div>
            )}

            {node.functionality && node.functionality.length > 0 && (
              <div className="mb-3">
                <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">{text.functionality}:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {node.functionality.map((func, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{func}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
              {node.dependencies && node.dependencies.length > 0 && (
                <div>
                  <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">{text.dependencies}:</h5>
                  <div className="space-y-1">
                    {node.dependencies.map((dep, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs mr-1 mb-1">
                        <GitBranch className="w-3 h-3 mr-1" />
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {node.techStack && node.techStack.length > 0 && (
                <div>
                  <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">{text.techStack}:</h5>
                  <div className="space-y-1">
                    {node.techStack.map((tech, idx) => (
                      <Badge key={idx} className="text-xs bg-blue-100 text-blue-800 mr-1 mb-1">
                        <Package className="w-3 h-3 mr-1" />
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {hasCode && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); toggleCode() }}
                    className="text-xs"
                  >
                    {showCode === path ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        {text.hideCode}
                      </>
                    ) : (
                      <>
                        <Code className="w-3 h-3 mr-1" />
                        {text.viewCode}
                      </>
                    )}
                  </Button>

                  {(node.codeExample || node.fullCode) && showCode === path && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => { 
                        e.stopPropagation()
                        copyToClipboard(node.fullCode || node.codeExample || '')
                      }}
                      className="text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      {text.copyCode}
                    </Button>
                  )}
                </div>

                {showCode === path && (
                  <div className="space-y-4">
                    {node.codeExample && (
                      <div>
                        <h5 className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">
                          {text.codeExample}:
                        </h5>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{node.codeExample}</code>
                        </pre>
                      </div>
                    )}

                    {node.fullCode && (
                      <div>
                        <h5 className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">
                          {text.fullCode}:
                        </h5>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{node.fullCode}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {node.type === "folder" && node.children && isExpanded && (
          <div className="mt-2 ml-6 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
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

  // تصدير HTML
  const exportAsHtml = () => {
    const currentDate = new Date().toLocaleDateString('ar-EG')

    const generateNodeHtml = (nodes: { [key: string]: FileNode }, level = 0): string => {
      return Object.entries(nodes).map(([key, node]) => {
        const Icon = node.icon?.name || 'File'

        return `
        <div style="margin-left: ${level * 20}px; margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: white;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <span style="font-size: 20px;">${node.type === 'folder' ? '📁' : '📄'}</span>
            <h${Math.min(level + 2, 6)} style="margin: 0; color: #1f2937;">${node.name}</h${Math.min(level + 2, 6)}>
            <span style="background: #f3f4f6; padding: 2px 8px; border-radius: 4px; font-size: 12px;">
              ${node.type === 'folder' ? 'مجلد' : 'ملف'}
            </span>
            ${node.importance ? `<span style="background: #fee2e2; color: #dc2626; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${node.importance}</span>` : ''}
          </div>

          ${node.description ? `<p style="color: #374151; margin-bottom: 10px; font-weight: 500;">${node.description}</p>` : ''}

          ${node.purpose ? `
          <div style="background: #eff6ff; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
            <strong style="color: #1e40af;">الغرض:</strong>
            <p style="margin: 5px 0 0 0; color: #1e40af;">${node.purpose}</p>
          </div>` : ''}

          ${node.explanation ? `
          <div style="background: #f0fdf4; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
            <strong style="color: #166534;">الشرح:</strong>
            <p style="margin: 5px 0 0 0; color: #166534;">${node.explanation}</p>
          </div>` : ''}

          ${node.functionality && node.functionality.length > 0 ? `
          <div style="margin-bottom: 10px;">
            <strong style="color: #374151;">الوظائف:</strong>
            <ul style="margin: 5px 0; padding-right: 20px;">
              ${node.functionality.map(func => `<li style="color: #6b7280; margin-bottom: 3px;">${func}</li>`).join('')}
            </ul>
          </div>` : ''}

          ${node.codeExample ? `
          <div style="margin-top: 15px;">
            <strong style="color: #374151;">مثال على الكود:</strong>
            <pre style="background: #1f2937; color: #f9fafb; padding: 15px; border-radius: 6px; overflow-x: auto; margin-top: 8px; font-size: 13px;"><code>${node.codeExample.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
          </div>` : ''}

          ${node.fullCode ? `
          <div style="margin-top: 15px;">
            <strong style="color: #374151;">الكود الكامل:</strong>
            <pre style="background: #1f2937; color: #f9fafb; padding: 15px; border-radius: 6px; overflow-x: auto; margin-top: 8px; font-size: 13px; max-height: 400px; overflow-y: auto;"><code>${node.fullCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
          </div>` : ''}

          ${node.children ? generateNodeHtml(node.children, level + 1) : ''}
        </div>
        `
      }).join('')
    }

    const htmlContent = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>توثيق مراقب فيسبوك المتقدم - التفاعلي</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .content { padding: 40px; }
        .toc {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        pre { direction: ltr; text-align: left; }
        @media (max-width: 768px) {
            .container { margin: 10px; }
            .header { padding: 20px; }
            .content { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 توثيق مراقب فيسبوك المتقدم</h1>
            <p>التوثيق التفاعلي الشامل مع الأكواد والشروحات</p>
            <p style="margin-top: 15px; opacity: 0.9;">تم الإنشاء في: ${currentDate}</p>
        </div>

        <div class="content">
            <div class="toc">
                <h2>📋 فهرس المحتويات</h2>
                <p>هذا التوثيق يحتوي على:</p>
                <ul style="margin: 10px 0; padding-right: 20px;">
                    <li>هيكل المشروع التفصيلي مع الأكواد</li>
                    <li>شرح كل ملف ووظيفته</li>
                    <li>أمثلة على الأكواد والاستخدام</li>
                    <li>التبعيات والتقنيات المستخدمة</li>
                    <li>نصائح التطوير والصيانة</li>
                </ul>
            </div>

            <div>
                <h2 style="color: #1f2937; margin-bottom: 20px;">🗂️ هيكل المشروع التفاعلي</h2>
                ${generateNodeHtml(filteredStructure)}
            </div>

            <div style="margin-top: 40px; padding: 20px; background: #f3f4f6; border-radius: 10px; text-align: center;">
                <h3 style="color: #374151;">📧 مراقب فيسبوك المتقدم</h3>
                <p style="color: #6b7280; margin-top: 10px;">
                    نظام شامل لمراقبة وتحليل بيانات Facebook مع واجهة متجاوبة وميزات متقدمة
                </p>
                <p style="margin-top: 15px; font-size: 14px; color: #9ca3af;">
                    تم إنشاؤه في: ${currentDate} • النسخة: 2.0
                </p>
            </div>
        </div>
    </div>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `facebook-monitor-interactive-docs-${new Date().toISOString().split('T')[0]}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // تصدير JSON
  const exportAsJson = () => {
    const data = {
      projectStructure: filteredStructure,
      documentation: {
        projectDocs: projectDocumentation,
        siteMap: siteMapContent
      },
      metadata: {
        exportDate: new Date().toISOString(),
        version: "2.0",
        totalFiles: Object.keys(filteredStructure).length
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `facebook-monitor-complete-docs-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
        <h1 className="text-3xl font-bold mb-2">{text.title}</h1>
        <p className="text-blue-100">{text.description}</p>
      </div>

      {/* البحث */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={text.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        />
      </div>

      {/* هيكل المشروع التفاعلي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <TreePine className="w-6 h-6" />
            {text.fileStructure}
            <Badge variant="secondary" className="text-sm">
              {Object.keys(filteredStructure).length} عنصر
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(filteredStructure).map(([key, node]) => (
              <FileTreeNode key={key} node={node} path={key} />
            ))}
            {Object.keys(filteredStructure).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">لم يتم العثور على ملفات مطابقة للبحث</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* نصائح الاستخدام */}
      <Alert>
        <Info className="w-4 h-4" />
        <AlertDescription>
          <strong>نصائح الاستخدام:</strong>
          <ul className="mt-2 space-y-1">
            <li>• انقر على أي ملف لرؤية تفاصيله الكاملة</li>
            <li>• استخدم "عرض الكود" لرؤية الأكواد الفعلية</li>
            <li>• يمكنك نسخ أي كود بنقرة واحدة</li>
            <li>• استخدم البحث للعثور على ملفات محددة</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}