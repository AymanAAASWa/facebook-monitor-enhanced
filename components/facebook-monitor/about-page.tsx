"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Target,
  Eye,
  Users,
  Phone,
  BarChart3,
  Settings,
  FileText,
  Search,
  Download,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Database,
  Cloud,
  MessageSquare,
  Filter,
  RefreshCw,
  Info,
  ExternalLink,
} from "lucide-react"

interface AboutPageProps {
  darkMode: boolean
  language: "ar" | "en"
  onGetStarted: () => void
}

export function AboutPage({ darkMode, language, onGetStarted }: AboutPageProps) {
  const t = {
    ar: {
      title: "مراقب فيسبوك المتقدم",
      subtitle: "أداة شاملة لمراقبة وتحليل المنشورات والمستخدمين على فيسبوك",
      vision: "الرؤية",
      visionText:
        "أن نكون الأداة الرائدة في مراقبة وسائل التواصل الاجتماعي، نوفر حلول ذكية ومتقدمة للشركات والأفراد لفهم وتحليل التفاعلات الرقمية بطريقة فعالة وآمنة.",
      goals: "الأهداف",
      goal1: "توفير مراقبة شاملة للمنشورات والتعليقات",
      goal2: "تحليل البيانات وتقديم إحصائيات مفيدة",
      goal3: "البحث السريع عن أرقام الهواتف",
      goal4: "حفظ وتنظيم البيانات بشكل آمن",
      goal5: "واجهة سهلة الاستخدام ومتعددة اللغات",
      features: "الميزات الرئيسية",
      howToUse: "طريقة الاستخدام",
      step1: "إعداد الحساب",
      step1Desc: "قم بتسجيل الدخول وإعداد رمز الوصول من Facebook",
      step2: "إضافة المصادر",
      step2Desc: "أضف معرفات الجروبات والصفحات التي تريد مراقبتها",
      step3: "رفع ملف الأرقام",
      step3Desc: "ارفع ملف JSON يحتوي على أرقام الهواتف أو استخدم Google Drive",
      step4: "بدء المراقبة",
      step4Desc: "احمل المنشورات وابدأ في البحث والتحليل",
      step5: "تحليل البيانات",
      step5Desc: "استخدم لوحة التحليلات لفهم الإحصائيات والاتجاهات",
      getStarted: "ابدأ الآن",
      learnMore: "تعلم المزيد",
      keyFeatures: "الميزات الأساسية",
      advancedFeatures: "الميزات المتقدمة",
      security: "الأمان والخصوصية",
      securityDesc: "جميع البيانات محمية ومشفرة، مع إمكانية التحكم الكامل في الخصوصية",
      realTime: "المراقبة الفورية",
      realTimeDesc: "تحديث المنشورات والتعليقات في الوقت الفعلي",
      analytics: "تحليلات متقدمة",
      analyticsDesc: "إحصائيات شاملة ورسوم بيانية تفاعلية",
      phoneSearch: "البحث عن الأرقام",
      phoneSearchDesc: "بحث سريع وذكي عن أرقام الهواتف في قاعدة البيانات",
      multiSource: "مصادر متعددة",
      multiSourceDesc: "مراقبة عدة جروبات وصفحات في نفس الوقت",
      export: "تصدير البيانات",
      exportDesc: "تصدير النتائج بصيغة CSV للتحليل الخارجي",
      cloudSync: "المزامنة السحابية",
      cloudSyncDesc: "حفظ الإعدادات والبيانات في السحابة مع Firebase",
      smartFilter: "الفلترة الذكية",
      smartFilterDesc: "فلترة المنشورات حسب التاريخ والمصدر والكلمات المفتاحية",
      autoReload: "التحديث التلقائي",
      autoReloadDesc: "تحديث المنشورات تلقائياً كل فترة زمنية محددة",
      darkMode: "الوضع الليلي",
      darkModeDesc: "واجهة مريحة للعين مع دعم الوضع الليلي",
      multiLang: "متعدد اللغات",
      multiLangDesc: "دعم اللغة العربية والإنجليزية مع تخطيط RTL",
      techStack: "التقنيات المستخدمة",
      nextjs: "Next.js 15",
      react: "React 18",
      typescript: "TypeScript",
      tailwind: "Tailwind CSS",
      firebase: "Firebase",
      facebook: "Facebook Graph API",
      support: "الدعم والمساعدة",
      supportDesc: "فريق دعم متخصص متاح لمساعدتك في أي وقت",
      documentation: "التوثيق الشامل",
      docDesc: "دليل مفصل لجميع الميزات وطرق الاستخدام",
      updates: "التحديثات المستمرة",
      updatesDesc: "تحديثات دورية لإضافة ميزات جديدة وتحسينات",
    },
    en: {
      title: "Advanced Facebook Monitor",
      subtitle: "Comprehensive tool for monitoring and analyzing Facebook posts and users",
      vision: "Vision",
      visionText:
        "To be the leading social media monitoring tool, providing smart and advanced solutions for businesses and individuals to understand and analyze digital interactions effectively and securely.",
      goals: "Goals",
      goal1: "Provide comprehensive monitoring of posts and comments",
      goal2: "Analyze data and provide useful statistics",
      goal3: "Quick search for phone numbers",
      goal4: "Save and organize data securely",
      goal5: "Easy-to-use multilingual interface",
      features: "Key Features",
      howToUse: "How to Use",
      step1: "Account Setup",
      step1Desc: "Login and set up Facebook access token",
      step2: "Add Sources",
      step2Desc: "Add group and page IDs you want to monitor",
      step3: "Upload Phone File",
      step3Desc: "Upload JSON file containing phone numbers or use Google Drive",
      step4: "Start Monitoring",
      step4Desc: "Load posts and start searching and analyzing",
      step5: "Analyze Data",
      step5Desc: "Use analytics dashboard to understand statistics and trends",
      getStarted: "Get Started",
      learnMore: "Learn More",
      keyFeatures: "Key Features",
      advancedFeatures: "Advanced Features",
      security: "Security & Privacy",
      securityDesc: "All data is protected and encrypted with full privacy control",
      realTime: "Real-time Monitoring",
      realTimeDesc: "Real-time updates of posts and comments",
      analytics: "Advanced Analytics",
      analyticsDesc: "Comprehensive statistics and interactive charts",
      phoneSearch: "Phone Search",
      phoneSearchDesc: "Quick and smart search for phone numbers in database",
      multiSource: "Multiple Sources",
      multiSourceDesc: "Monitor multiple groups and pages simultaneously",
      export: "Data Export",
      exportDesc: "Export results in CSV format for external analysis",
      cloudSync: "Cloud Sync",
      cloudSyncDesc: "Save settings and data in cloud with Firebase",
      smartFilter: "Smart Filtering",
      smartFilterDesc: "Filter posts by date, source, and keywords",
      autoReload: "Auto Reload",
      autoReloadDesc: "Automatically refresh posts at specified intervals",
      darkMode: "Dark Mode",
      darkModeDesc: "Eye-friendly interface with dark mode support",
      multiLang: "Multi-language",
      multiLangDesc: "Support for Arabic and English with RTL layout",
      techStack: "Technology Stack",
      nextjs: "Next.js 15",
      react: "React 18",
      typescript: "TypeScript",
      tailwind: "Tailwind CSS",
      firebase: "Firebase",
      facebook: "Facebook Graph API",
      support: "Support & Help",
      supportDesc: "Specialized support team available to help you anytime",
      documentation: "Comprehensive Documentation",
      docDesc: "Detailed guide for all features and usage methods",
      updates: "Continuous Updates",
      updatesDesc: "Regular updates to add new features and improvements",
    },
  }

  const text = t[language]

  const keyFeatures = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: text.realTime,
      description: text.realTimeDesc,
      color: "bg-blue-500",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: text.analytics,
      description: text.analyticsDesc,
      color: "bg-purple-500",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: text.phoneSearch,
      description: text.phoneSearchDesc,
      color: "bg-green-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: text.multiSource,
      description: text.multiSourceDesc,
      color: "bg-orange-500",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: text.export,
      description: text.exportDesc,
      color: "bg-red-500",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: text.security,
      description: text.securityDesc,
      color: "bg-gray-500",
    },
  ]

  const advancedFeatures = [
    {
      icon: <Cloud className="w-5 h-5" />,
      title: text.cloudSync,
      description: text.cloudSyncDesc,
    },
    {
      icon: <Filter className="w-5 h-5" />,
      title: text.smartFilter,
      description: text.smartFilterDesc,
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: text.autoReload,
      description: text.autoReloadDesc,
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: text.darkMode,
      description: text.darkModeDesc,
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: text.multiLang,
      description: text.multiLangDesc,
    },
  ]

  const steps = [
    {
      number: "1",
      title: text.step1,
      description: text.step1Desc,
      icon: <Settings className="w-6 h-6" />,
    },
    {
      number: "2",
      title: text.step2,
      description: text.step2Desc,
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "3",
      title: text.step3,
      description: text.step3Desc,
      icon: <Database className="w-6 h-6" />,
    },
    {
      number: "4",
      title: text.step4,
      description: text.step4Desc,
      icon: <Search className="w-6 h-6" />,
    },
    {
      number: "5",
      title: text.step5,
      description: text.step5Desc,
      icon: <BarChart3 className="w-6 h-6" />,
    },
  ]

  const techStack = [
    { name: text.nextjs, color: "bg-black text-white" },
    { name: text.react, color: "bg-blue-500 text-white" },
    { name: text.typescript, color: "bg-blue-600 text-white" },
    { name: text.tailwind, color: "bg-cyan-500 text-white" },
    { name: text.firebase, color: "bg-orange-500 text-white" },
    { name: text.facebook, color: "bg-blue-700 text-white" },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {text.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{text.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <TrendingUp className="w-3 h-3 mr-1" />
            مراقبة فورية
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Phone className="w-3 h-3 mr-1" />
            البحث عن الأرقام
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <BarChart3 className="w-3 h-3 mr-1" />
            تحليلات متقدمة
          </Badge>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            <Shield className="w-3 h-3 mr-1" />
            آمن ومحمي
          </Badge>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Star className="w-4 h-4 mr-2" />
            {text.getStarted}
          </Button>
          <Button variant="outline" size="lg">
            <Info className="w-4 h-4 mr-2" />
            {text.learnMore}
          </Button>
        </div>
      </div>

      {/* Vision & Goals */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              {text.vision}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{text.visionText}</p>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              {text.goals}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[text.goal1, text.goal2, text.goal3, text.goal4, text.goal5].map((goal, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">{goal}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Key Features */}
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            {text.keyFeatures}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div
                  className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            {text.howToUse}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {step.number}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-blue-500">{step.icon}</div>
                    <h3 className="font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
                {index < steps.length - 1 && <ArrowRight className="w-5 h-5 text-gray-400 mt-2" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            {text.advancedFeatures}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {advancedFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="text-purple-500">{feature.icon}</div>
                <div>
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-500" />
            {text.techStack}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech, index) => (
              <Badge key={index} className={`${tech.color} px-3 py-1`}>
                {tech.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Google Drive Integration Alert */}
      <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-900/20">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <div className="space-y-2">
            <p className="font-medium">📁 تكامل Google Drive للأرقام:</p>
            <p>
              يمكنك رفع ملف الأرقام على Google Drive ووضع الرابط في الإعدادات. سيتم حفظ الرابط تلقائياً مع إعداداتك في
              Firebase ويعود معك عند تسجيل الدخول مرة أخرى.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">تأكد من جعل الملف قابل للمشاركة (Anyone with the link can view)</span>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Support Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm text-center`}>
          <CardContent className="p-6">
            <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{text.support}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{text.supportDesc}</p>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm text-center`}>
          <CardContent className="p-6">
            <FileText className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{text.documentation}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{text.docDesc}</p>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm text-center`}>
          <CardContent className="p-6">
            <RefreshCw className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{text.updates}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{text.updatesDesc}</p>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card
        className={`${darkMode ? "bg-gradient-to-r from-blue-900 to-purple-900" : "bg-gradient-to-r from-blue-500 to-purple-600"} text-white`}
      >
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">جاهز للبدء؟</h2>
          <p className="text-blue-100 mb-6">ابدأ في مراقبة وتحليل منشورات فيسبوك الآن مع أدواتنا المتقدمة</p>
          <Button
            onClick={onGetStarted}
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <Star className="w-4 h-4 mr-2" />
            ابدأ الآن مجاناً
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
