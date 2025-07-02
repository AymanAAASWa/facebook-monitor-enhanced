
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Users,
  Calendar,
  Briefcase,
  GraduationCap,
  Star,
  Award,
  Gift,
  TrendingUp,
  Globe,
  Building,
  Heart
} from "lucide-react"

interface UserDemographic {
  id: string
  name: string
  age?: number
  location?: string
  work?: string
  education?: string
  birthday?: string
  activityScore: number
  influenceScore: number
  isVIP?: boolean
}

interface DemographicsMapViewerProps {
  users: UserDemographic[]
  darkMode: boolean
  language: "ar" | "en"
}

export function DemographicsMapViewer({ users, darkMode, language }: DemographicsMapViewerProps) {
  const [selectedTab, setSelectedTab] = useState("map")
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  const t = {
    ar: {
      demographics: "الديموغرافيا والخريطة",
      map: "الخريطة",
      ages: "الأعمار",
      locations: "المواقع",
      vipUsers: "المستخدمون المميزون",
      birthdays: "أعياد الميلاد",
      totalUsers: "إجمالي المستخدمين",
      averageAge: "متوسط العمر",
      topLocation: "أكثر المواقع نشاطاً",
      vipCount: "المستخدمون المميزون",
      upcomingBirthdays: "أعياد الميلاد القادمة",
      userDistribution: "توزيع المستخدمين",
      ageGroups: "الفئات العمرية",
      topLocations: "أهم المواقع",
      celebrateWith: "احتفل مع",
      viewProfile: "عرض الملف",
      highActivity: "نشاط عالي",
      influencer: "مؤثر",
      newUser: "مستخدم جديد",
      years: "سنة",
      users: "مستخدم",
      unknown: "غير محدد",
      today: "اليوم",
      tomorrow: "غداً",
      thisWeek: "هذا الأسبوع",
      thisMonth: "هذا الشهر",
      workAnalysis: "تحليل العمل",
      educationAnalysis: "تحليل التعليم",
    },
    en: {
      demographics: "Demographics & Map",
      map: "Map",
      ages: "Ages",
      locations: "Locations", 
      vipUsers: "VIP Users",
      birthdays: "Birthdays",
      totalUsers: "Total Users",
      averageAge: "Average Age",
      topLocation: "Top Location",
      vipCount: "VIP Users",
      upcomingBirthdays: "Upcoming Birthdays",
      userDistribution: "User Distribution",
      ageGroups: "Age Groups",
      topLocations: "Top Locations",
      celebrateWith: "Celebrate with",
      viewProfile: "View Profile",
      highActivity: "High Activity",
      influencer: "Influencer",
      newUser: "New User",
      years: "years",
      users: "users",
      unknown: "Unknown",
      today: "Today",
      tomorrow: "Tomorrow",
      thisWeek: "This Week",
      thisMonth: "This Month",
      workAnalysis: "Work Analysis",
      educationAnalysis: "Education Analysis",
    },
  }

  const text = t[language]

  // تحليل البيانات الديموغرافية
  const demographics = useMemo(() => {
    const validAges = users.filter(u => u.age).map(u => u.age!)
    const averageAge = validAges.length > 0 ? Math.round(validAges.reduce((a, b) => a + b, 0) / validAges.length) : 0

    // تجميع الأعمار
    const ageGroups = {
      "18-24": users.filter(u => u.age && u.age >= 18 && u.age <= 24).length,
      "25-34": users.filter(u => u.age && u.age >= 25 && u.age <= 34).length,
      "35-44": users.filter(u => u.age && u.age >= 35 && u.age <= 44).length,
      "45-54": users.filter(u => u.age && u.age >= 45 && u.age <= 54).length,
      "55+": users.filter(u => u.age && u.age >= 55).length,
      "غير محدد": users.filter(u => !u.age).length,
    }

    // تجميع المواقع
    const locationCounts = users.reduce((acc, user) => {
      const location = user.location || "غير محدد"
      acc[location] = (acc[location] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topLocations = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    // تحليل العمل
    const workCounts = users.reduce((acc, user) => {
      const work = user.work || "غير محدد"
      acc[work] = (acc[work] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topWork = Object.entries(workCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    // المستخدمون المميزون (نشاط عالي + تأثير كبير)
    const vipUsers = users
      .filter(u => u.activityScore > 100 || u.influenceScore > 50)
      .sort((a, b) => (b.activityScore + b.influenceScore) - (a.activityScore + a.influenceScore))
      .slice(0, 20)

    // أعياد الميلاد القادمة
    const upcomingBirthdays = users
      .filter(u => u.birthday)
      .map(u => {
        const today = new Date()
        const birthday = new Date(u.birthday!)
        const thisYear = today.getFullYear()
        
        // تعديل السنة للسنة الحالية
        birthday.setFullYear(thisYear)
        
        // إذا مر عيد الميلاد هذا العام، جعله للسنة القادمة
        if (birthday < today) {
          birthday.setFullYear(thisYear + 1)
        }
        
        const daysUntil = Math.ceil((birthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        return {
          ...u,
          daysUntil,
          birthdayDate: birthday
        }
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 10)

    return {
      averageAge,
      ageGroups,
      locationCounts,
      topLocations,
      workCounts,
      topWork,
      vipUsers,
      upcomingBirthdays
    }
  }, [users])

  const getTimePeriod = (days: number) => {
    if (days === 0) return text.today
    if (days === 1) return text.tomorrow
    if (days <= 7) return text.thisWeek
    if (days <= 30) return text.thisMonth
    return `${days} يوم`
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-sm text-gray-500">{text.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{demographics.averageAge}</div>
            <div className="text-sm text-gray-500">{text.averageAge}</div>
