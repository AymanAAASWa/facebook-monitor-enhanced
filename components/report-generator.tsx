
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  FileText, 
  Download, 
  Printer,
  Share2,
  Settings,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  MessageCircle,
  Activity
} from "lucide-react"

interface ReportGeneratorProps {
  data: any
  darkMode: boolean
  language: "ar" | "en"
}

export function ReportGenerator({ data, darkMode, language }: ReportGeneratorProps) {
  const [selectedSections, setSelectedSections] = useState({
    overview: true,
    analytics: true,
    users: true,
    posts: true,
    engagement: true,
    fileStructure: false,
    recommendations: true
  })
  
  const [generating, setGenerating] = useState(false)
  const [reportFormat, setReportFormat] = useState<'pdf' | 'html' | 'txt'>('pdf')
  
  const t = {
    ar: {
      title: "مولد التقارير المتقدم",
      description: "إنشاء تقارير مخصصة شاملة مع إحصائيات مفصلة",
      selectSections: "اختر أقسام التقرير",
      overview: "نظرة عامة",
      analytics: "التحليلات",
      users: "المستخدمون",
      posts: "المنشورات",
      engagement: "التفاعل",
      fileStructure: "هيكل الملفات",
      recommendations: "التوصيات",
      format: "تنسيق التقرير",
      generate: "إنشاء التقرير",
      generating: "جاري الإنشاء...",
      preview: "معاينة التقرير",
      estimatedSize: "الحجم المتوقع",
      estimatedTime: "الوقت المتوقع",
      pages: "صفحة",
      minutes: "دقيقة"
    },
    en: {
      title: "Advanced Report Generator",
      description: "Create comprehensive custom reports with detailed analytics",
      selectSections: "Select Report Sections",
      overview: "Overview",
      analytics: "Analytics",
      users: "Users",
      posts: "Posts", 
      engagement: "Engagement",
      fileStructure: "File Structure",
      recommendations: "Recommendations",
      format: "Report Format",
      generate: "Generate Report",
      generating: "Generating...",
      preview: "Report Preview",
      estimatedSize: "Estimated Size",
      estimatedTime: "Estimated Time",
      pages: "pages",
      minutes: "minutes"
    }
  }
  
  const text = t[language]
  
  const sections = [
    { 
      key: 'overview', 
      title: text.overview, 
      icon: BarChart3, 
      description: "الإحصائيات العامة والملخص التنفيذي",
      estimatedPages: 2
    },
    { 
      key: 'analytics', 
      title: text.analytics, 
      icon: PieChart, 
      description: "التحليلات المفصلة والرسوم البيانية",
      estimatedPages: 4
    },
    { 
      key: 'users', 
      title: text.users, 
      icon: Users, 
      description: "تحليل المستخدمين والسلوك",
      estimatedPages: 3
    },
    { 
      key: 'posts', 
      title: text.posts, 
      icon: MessageCircle, 
      description: "إحصائيات المنشورات والمحتوى",
      estimatedPages: 3
    },
    { 
      key: 'engagement', 
      title: text.engagement, 
      icon: TrendingUp, 
      description: "تحليل التفاعل والاتجاهات",
      estimatedPages: 2
    },
    { 
      key: 'fileStructure', 
      title: text.fileStructure, 
      icon: FileText, 
      description: "هيكل المشروع والملفات",
      estimatedPages: 5
    },
    { 
      key: 'recommendations', 
      title: text.recommendations, 
      icon: CheckCircle, 
      description: "التوصيات والاقتراحات",
      estimatedPages: 1
    }
  ]
  
  const toggleSection = (key: string) => {
    setSelectedSections(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }
  
  const calculateEstimates = () => {
    const selectedCount = Object.values(selectedSections).filter(Boolean).length
    const totalPages = sections
      .filter(section => selectedSections[section.key as keyof typeof selectedSections])
      .reduce((sum, section) => sum + section.estimatedPages, 0)
    
    return {
      pages: totalPages,
      timeMinutes: Math.ceil(totalPages * 0.5), // نصف دقيقة لكل صفحة
      sizeMB: totalPages * 0.3 // 300KB لكل صفحة تقريباً
    }
  }
  
  const generateReport = async () => {
    setGenerating(true)
    
    try {
      // محاكاة إنشاء التقرير مع progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // هنا سيتم استدعاء وظيفة الإنشاء الفعلية حسب التنسيق المختار
      if (reportFormat === 'pdf') {
        await generatePdfReport()
      } else if (reportFormat === 'html') {
        await generateHtmlReport()
      } else {
        await generateTextReport()
      }
      
    } catch (error) {
      console.error('خطأ في إنشاء التقرير:', error)
    } finally {
      setGenerating(false)
    }
  }
  
  const generatePdfReport = async () => {
    // استدعاء وظيفة PDF من DocumentationExport
    console.log('Generating PDF report with sections:', selectedSections)
  }
  
  const generateHtmlReport = async () => {
    // استدعاء وظيفة HTML محسنة
    console.log('Generating HTML report with sections:', selectedSections)
  }
  
  const generateTextReport = async () => {
    // إنشاء تقرير نصي
    console.log('Generating text report with sections:', selectedSections)
  }
  
  const estimates = calculateEstimates()
  
  return (
    <div className="space-y-6">
      <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="w-5 h-5" />
            {text.title}
          </CardTitle>
          <p className="text-sm text-gray-500">{text.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* اختيار أقسام التقرير */}
          <div>
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {text.selectSections}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section) => {
                const Icon = section.icon
                const isSelected = selectedSections[section.key as keyof typeof selectedSections]
                
                return (
                  <Card 
                    key={section.key}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => toggleSection(section.key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          checked={isSelected}
                          onChange={() => toggleSection(section.key)}
                        />
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`} />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{section.title}</h5>
                          <p className="text-xs text-gray-500 mt-1">{section.description}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {section.estimatedPages} {text.pages}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
          
          {/* اختيار تنسيق التقرير */}
          <div>
            <h4 className="font-medium mb-3">{text.format}</h4>
            <div className="flex gap-3">
              {[
                { key: 'pdf', label: 'PDF', icon: FileText, color: 'text-red-500' },
                { key: 'html', label: 'HTML', icon: FileText, color: 'text-blue-500' },
                { key: 'txt', label: 'TXT', icon: FileText, color: 'text-green-500' }
              ].map((format) => {
                const Icon = format.icon
                return (
                  <Button
                    key={format.key}
                    variant={reportFormat === format.key ? "default" : "outline"}
                    onClick={() => setReportFormat(format.key as any)}
                    className="flex items-center gap-2"
                  >
                    <Icon className={`w-4 h-4 ${format.color}`} />
                    {format.label}
                  </Button>
                )
              })}
            </div>
          </div>
          
          {/* الإحصائيات المتوقعة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-lg font-bold">{estimates.pages}</p>
                <p className="text-xs text-gray-500">{text.estimatedSize} ({estimates.pages} {text.pages})</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-lg font-bold">{estimates.timeMinutes}</p>
                <p className="text-xs text-gray-500">{text.estimatedTime} ({estimates.timeMinutes} {text.minutes})</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Download className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <p className="text-lg font-bold">{estimates.sizeMB.toFixed(1)}MB</p>
                <p className="text-xs text-gray-500">حجم الملف المتوقع</p>
              </CardContent>
            </Card>
          </div>
          
          {/* زر الإنشاء */}
          <div className="flex gap-3">
            <Button 
              onClick={generateReport}
              disabled={generating || Object.values(selectedSections).every(v => !v)}
              className="flex items-center gap-2 flex-1"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {text.generating}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  {text.generate}
                </>
              )}
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              مشاركة
            </Button>
          </div>
          
          {/* شريط التقدم أثناء الإنشاء */}
          {generating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>جاري إنشاء التقرير...</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          )}
          
        </CardContent>
      </Card>
    </div>
  )
}
