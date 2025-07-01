"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  Building,
  Users,
  Search,
  Download,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Globe,
  Star,
  MessageCircle,
  TrendingUp,
  Activity,
  BarChart3,
  Database,
  RefreshCw,
  AlertCircle,
  Plus,
} from "lucide-react"
import { EnhancedUserDetails } from "./enhanced-user-details"
import { EnhancedPageDetails } from "./enhanced-page-details"
import { EnhancedGroupDetails } from "./enhanced-group-details"
import {
  firebaseEnhancedService,
  type EnhancedUserRecord,
  type EnhancedPageRecord,
  type EnhancedGroupRecord,
} from "@/lib/firebase-enhanced-service"

interface EnhancedDataViewerProps {
  darkMode: boolean
  language: "ar" | "en"
  userId?: string
}

export function EnhancedDataViewer({ darkMode, language, userId }: EnhancedDataViewerProps) {
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState<EnhancedUserRecord[]>([])
  const [pages, setPages] = useState<EnhancedPageRecord[]>([])
  const [groups, setGroups] = useState<EnhancedGroupRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)

  // Filters
  const [userFilters, setUserFilters] = useState({
    source_type: "all",
    category: "",
    is_active: undefined as boolean | undefined,
    location: "",
  })

  const [pageFilters, setPageFilters] = useState({
    category: "",
    city: "",
    country: "",
    is_verified: undefined as boolean | undefined,
  })

  const t = {
    ar: {
      users: "المستخدمون",
      pages: "الصفحات",
      groups: "المجموعات",
      analytics: "التحليلات",
      search: "البحث...",
      filters: "الفلاتر",
      category: "الفئة",
      location: "الموقع",
      active: "نشط",
      verified: "موثق",
      all: "الكل",
      yes: "نعم",
      no: "لا",
      loadData: "تحميل البيانات",
      exportData: "تصدير البيانات",
      viewDetails: "عرض التفاصيل",
      totalUsers: "إجمالي المستخدمين",
      totalPages: "إجمالي الصفحات",
      totalGroups: "إجمالي المجموعات",
      activeUsers: "المستخدمون النشطون",
      verifiedPages: "الصفحات الموثقة",
      highEngagement: "تفاعل عالي",
      recentActivity: "النشاط الأخير",
      unrespondedComments: "تعليقات غير مجاب عليها",
      name: "الاسم",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      hometown: "المدينة الأصلية",
      currentLocation: "الموقع الحالي",
      work: "العمل",
      education: "التعليم",
      friends: "الأصدقاء",
      posts: "المنشورات",
      photos: "الصور",
      engagement: "التفاعل",
      lastActive: "آخر نشاط",
      discoveredDate: "تاريخ الاكتشاف",
      fanCount: "المعجبون",
      followersCount: "المتابعون",
      website: "الموقع الإلكتروني",
      address: "العنوان",
      rating: "التقييم",
      memberCount: "عدد الأعضاء",
      privacy: "الخصوصية",
      description: "الوصف",
      loading: "جاري التحميل...",
      noData: "لا توجد بيانات",
      error: "حدث خطأ",
      close: "إغلاق",
      addTestData: "إضافة بيانات تجريبية",
      testDataAdded: "تم إضافة البيانات التجريبية",
      retry: "إعادة المحاولة",
    },
    en: {
      users: "Users",
      pages: "Pages",
      groups: "Groups",
      analytics: "Analytics",
      search: "Search...",
      filters: "Filters",
      category: "Category",
      location: "Location",
      active: "Active",
      verified: "Verified",
      all: "All",
      yes: "Yes",
      no: "No",
      loadData: "Load Data",
      exportData: "Export Data",
      viewDetails: "View Details",
      totalUsers: "Total Users",
      totalPages: "Total Pages",
      totalGroups: "Total Groups",
      activeUsers: "Active Users",
      verifiedPages: "Verified Pages",
      highEngagement: "High Engagement",
      recentActivity: "Recent Activity",
      unrespondedComments: "Unresponded Comments",
      name: "Name",
      email: "Email",
      phone: "Phone",
      hometown: "Hometown",
      currentLocation: "Current Location",
      work: "Work",
      education: "Education",
      friends: "Friends",
      posts: "Posts",
      photos: "Photos",
      engagement: "Engagement",
      lastActive: "Last Active",
      discoveredDate: "Discovered Date",
      fanCount: "Fans",
      followersCount: "Followers",
      website: "Website",
      address: "Address",
      rating: "Rating",
      memberCount: "Members",
      privacy: "Privacy",
      description: "Description",
      loading: "Loading...",
      noData: "No data available",
      error: "Error occurred",
      close: "Close",
      addTestData: "Add Test Data",
      testDataAdded: "Test data added successfully",
      retry: "Retry",
    },
  }

  const text = t[language]

  useEffect(() => {
    loadAnalytics()
  }, [])

  useEffect(() => {
    if (activeTab === "users") {
      loadUsers()
    } else if (activeTab === "pages") {
      loadPages()
    } else if (activeTab === "groups") {
      loadGroups()
    }
  }, [activeTab, userFilters, pageFilters, searchTerm])

  const loadAnalytics = async () => {
    try {
      setError(null)
      const analyticsData = await firebaseEnhancedService.getAnalyticsSummary()
      setAnalytics(analyticsData)
    } catch (error) {
      console.error("Error loading analytics:", error)
      setError("فشل في تحميل الإحصائيات")
    }
  }

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      let userData: EnhancedUserRecord[] = []

      if (searchTerm || Object.values(userFilters).some((v) => v && v !== "all")) {
        // Use filtered search
        const filters = {
          ...userFilters,
          source_type: userFilters.source_type === "all" ? undefined : userFilters.source_type,
        }
        userData = await firebaseEnhancedService.searchEnhancedUsers(filters)

        // Apply search term client-side
        if (searchTerm) {
          userData = userData.filter(
            (user) =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (user.phone && user.phone.includes(searchTerm)),
          )
        }
      } else {
        // Load all users
        userData = await firebaseEnhancedService.getAllUsers()
      }

      setUsers(userData)
    } catch (error) {
      console.error("Error loading users:", error)
      setError("فشل في تحميل المستخدمين")
    } finally {
      setLoading(false)
    }
  }

  const loadPages = async () => {
    setLoading(true)
    setError(null)
    try {
      let pageData: EnhancedPageRecord[] = []

      if (searchTerm || Object.values(pageFilters).some((v) => v && v !== "all")) {
        // Use filtered search
        pageData = await firebaseEnhancedService.searchEnhancedPages(pageFilters)

        // Apply search term client-side
        if (searchTerm) {
          pageData = pageData.filter(
            (page) =>
              page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (page.category && page.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (page.website && page.website.toLowerCase().includes(searchTerm.toLowerCase())),
          )
        }
      } else {
        // Load all pages
        pageData = await firebaseEnhancedService.getAllPages()
      }

      setPages(pageData)
    } catch (error) {
      console.error("Error loading pages:", error)
      setError("فشل في تحميل الصفحات")
    } finally {
      setLoading(false)
    }
  }

  const loadGroups = async () => {
    setLoading(true)
    setError(null)
    try {
      let groupData: EnhancedGroupRecord[] = []

      if (searchTerm) {
        // Load all and filter client-side
        groupData = await firebaseEnhancedService.getAllGroups()
        groupData = groupData.filter(
          (group) =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase())),
        )
      } else {
        groupData = await firebaseEnhancedService.getAllGroups()
      }

      setGroups(groupData)
    } catch (error) {
      console.error("Error loading groups:", error)
      setError("فشل في تحميل المجموعات")
    } finally {
      setLoading(false)
    }
  }

  const addTestData = async () => {
    setLoading(true)
    setError(null)
    try {
      // إضافة بيانات تجريبية للمستخدمين
      const testUsers: EnhancedUserRecord[] = [
        {
          id: "test_user_1",
          name: "أحمد محمد",
          email: "ahmed@example.com",
          phone: "+201234567890",
          location: "القاهرة، مصر",
          friends_count: 150,
          posts_count: 45,
          photos_count: 120,
          engagement_rate: 75.5,
          source: "facebook_group_1",
          source_type: "user",
          discovered_date: new Date(),
          last_updated: new Date(),
          is_active: true,
          is_verified: false,
          category: "عام",
        },
        {
          id: "test_user_2",
          name: "فاطمة علي",
          email: "fatima@example.com",
          phone: "+201987654321",
          location: "الإسكندرية، مصر",
          friends_count: 200,
          posts_count: 67,
          photos_count: 89,
          engagement_rate: 82.3,
          source: "facebook_page_1",
          source_type: "page",
          discovered_date: new Date(),
          last_updated: new Date(),
          is_active: true,
          is_verified: true,
          category: "تجارة",
        },
        {
          id: "test_user_3",
          name: "محمد حسن",
          email: "mohamed@example.com",
          location: "الجيزة، مصر",
          friends_count: 89,
          posts_count: 23,
          photos_count: 56,
          engagement_rate: 45.2,
          source: "facebook_group_2",
          source_type: "group",
          discovered_date: new Date(),
          last_updated: new Date(),
          is_active: false,
          is_verified: false,
          category: "تعليم",
        },
      ]

      // إضافة بيانات تجريبية للصفحات
      const testPages: EnhancedPageRecord[] = [
        {
          id: "test_page_1",
          name: "متجر الإلكترونيات الحديثة",
          category: "تجارة إلكترونية",
          website: "https://electronics-store.com",
          phone: "+201111111111",
          city: "القاهرة",
          country: "مصر",
          fan_count: 15000,
          followers_count: 18500,
          average_rating: 4.5,
          source: "facebook_ads",
          discovered_date: new Date(),
          last_updated: new Date(),
          is_verified: true,
          is_active: true,
        },
        {
          id: "test_page_2",
          name: "مطعم الأصالة",
          category: "مطاعم",
          website: "https://asala-restaurant.com",
          phone: "+202222222222",
          city: "الإسكندرية",
          country: "مصر",
          fan_count: 8500,
          followers_count: 9200,
          average_rating: 4.2,
          source: "facebook_search",
          discovered_date: new Date(),
          last_updated: new Date(),
          is_verified: false,
          is_active: true,
        },
      ]

      // إضافة بيانات تجريبية للمجموعات
      const testGroups: EnhancedGroupRecord[] = [
        {
          id: "test_group_1",
          name: "مجموعة التكنولوجيا والبرمجة",
          description: "مجموعة لمناقشة أحدث التطورات في عالم التكنولوجيا والبرمجة",
          privacy: "public",
          member_count: 25000,
          admin_count: 5,
          posts_count: 1250,
          source: "facebook_search",
          discovered_date: new Date(),
          last_updated: new Date(),
          is_active: true,
        },
        {
          id: "test_group_2",
          name: "سوق السيارات المستعملة",
          description: "بيع وشراء السيارات المستعملة بأفضل الأسعار",
          privacy: "closed",
          member_count: 12000,
          admin_count: 3,
          posts_count: 890,
          source: "facebook_groups",
          discovered_date: new Date(),
          last_updated: new Date(),
          is_active: true,
        },
      ]

      // حفظ البيانات التجريبية
      await Promise.all([
        firebaseEnhancedService.bulkSaveUsers(testUsers),
        firebaseEnhancedService.bulkSavePages(testPages),
        firebaseEnhancedService.bulkSaveGroups(testGroups),
      ])

      // إعادة تحميل البيانات
      await Promise.all([loadUsers(), loadPages(), loadGroups(), loadAnalytics()])

      alert(text.testDataAdded)
    } catch (error) {
      console.error("Error adding test data:", error)
      setError("فشل في إضافة البيانات التجريبية")
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    let dataToExport: any[] = []
    let filename = ""

    switch (activeTab) {
      case "users":
        dataToExport = users
        filename = "enhanced_users.json"
        break
      case "pages":
        dataToExport = pages
        filename = "enhanced_pages.json"
        break
      case "groups":
        dataToExport = groups
        filename = "enhanced_groups.json"
        break
      case "analytics":
        dataToExport = [analytics]
        filename = "analytics_summary.json"
        break
    }

    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // عرض تفاصيل المستخدم المحسنة
  if (selectedUserId) {
    return (
      <EnhancedUserDetails
        userId={selectedUserId}
        darkMode={darkMode}
        language={language}
        onClose={() => setSelectedUserId(null)}
      />
    )
  }

  // عرض تفاصيل الصفحة المحسنة
  if (selectedPageId) {
    return (
      <EnhancedPageDetails
        pageId={selectedPageId}
        darkMode={darkMode}
        language={language}
        onClose={() => setSelectedPageId(null)}
      />
    )
  }

  // عرض تفاصيل المجموعة المحسنة
  if (selectedGroupId) {
    return (
      <EnhancedGroupDetails
        groupId={selectedGroupId}
        darkMode={darkMode}
        language={language}
        onClose={() => setSelectedGroupId(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={() => setError(null)} className="ml-auto">
                {text.close}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Summary */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardContent className="p-4 text-center">
              <User className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-lg font-bold">{analytics.total_users}</p>
              <p className="text-xs text-gray-500">{text.totalUsers}</p>
            </CardContent>
          </Card>

          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardContent className="p-4 text-center">
              <Building className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-lg font-bold">{analytics.total_pages}</p>
              <p className="text-xs text-gray-500">{text.totalPages}</p>
            </CardContent>
          </Card>

          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <p className="text-lg font-bold">{analytics.total_groups}</p>
              <p className="text-xs text-gray-500">{text.totalGroups}</p>
            </CardContent>
          </Card>

          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardContent className="p-4 text-center">
              <Activity className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <p className="text-lg font-bold">{analytics.active_users}</p>
              <p className="text-xs text-gray-500">{text.activeUsers}</p>
            </CardContent>
          </Card>

          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-lg font-bold">{analytics.verified_pages}</p>
              <p className="text-xs text-gray-500">{text.verifiedPages}</p>
            </CardContent>
          </Card>

          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <p className="text-lg font-bold">{analytics.high_engagement_users}</p>
              <p className="text-xs text-gray-500">{text.highEngagement}</p>
            </CardContent>
          </Card>

          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
              <p className="text-lg font-bold">{analytics.unresponded_comments}</p>
              <p className="text-xs text-gray-500">{text.unrespondedComments}</p>
            </CardContent>
          </Card>

          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-pink-500" />
              <p className="text-lg font-bold">{analytics.recent_activity}</p>
              <p className="text-xs text-gray-500">{text.recentActivity}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              البيانات المحسنة
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button onClick={addTestData} variant="outline" size="sm" disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                {text.addTestData}
              </Button>
              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                {text.exportData}
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                {text.loadData}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {text.users}
              </TabsTrigger>
              <TabsTrigger value="pages" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                {text.pages}
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {text.groups}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {text.analytics}
              </TabsTrigger>
            </TabsList>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 my-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={text.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {activeTab === "users" && (
                <>
                  <Select
                    value={userFilters.source_type}
                    onValueChange={(value) => setUserFilters({ ...userFilters, source_type: value })}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={text.all} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{text.all}</SelectItem>
                      <SelectItem value="user">مستخدم</SelectItem>
                      <SelectItem value="page">صفحة</SelectItem>
                      <SelectItem value="group">مجموعة</SelectItem>
                      <SelectItem value="comment">تعليق</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={userFilters.is_active?.toString() || "all"}
                    onValueChange={(value) =>
                      setUserFilters({
                        ...userFilters,
                        is_active: value === "all" ? undefined : value === "true",
                      })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder={text.active} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{text.all}</SelectItem>
                      <SelectItem value="true">{text.yes}</SelectItem>
                      <SelectItem value="false">{text.no}</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}

              {activeTab === "pages" && (
                <>
                  <Input
                    placeholder={text.category}
                    value={pageFilters.category}
                    onChange={(e) => setPageFilters({ ...pageFilters, category: e.target.value })}
                    className="w-40"
                  />

                  <Select
                    value={pageFilters.is_verified?.toString() || "all"}
                    onValueChange={(value) =>
                      setPageFilters({
                        ...pageFilters,
                        is_verified: value === "all" ? undefined : value === "true",
                      })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder={text.verified} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{text.all}</SelectItem>
                      <SelectItem value="true">{text.yes}</SelectItem>
                      <SelectItem value="false">{text.no}</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p>{text.loading}</p>
                </div>
              ) : users.length > 0 ? (
                <div className="space-y-4">
                  {users.map((user) => (
                    <Card key={user.id} className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">{user.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                {user.email && (
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {user.email}
                                  </span>
                                )}
                                {user.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {user.phone}
                                  </span>
                                )}
                                {user.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {user.location}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                                <span>الأصدقاء: {user.friends_count || 0}</span>
                                <span>المنشورات: {user.posts_count || 0}</span>
                                <span>الصور: {user.photos_count || 0}</span>
                                {user.engagement_rate && <span>التفاعل: {user.engagement_rate.toFixed(1)}%</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {user.is_active && <Badge variant="secondary">نشط</Badge>}
                            {user.is_verified && <Badge variant="outline">موثق</Badge>}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUserId(user.id)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              {text.viewDetails}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">{text.noData}</p>
                  <p className="text-sm mb-4">لا توجد بيانات مستخدمين محفوظة</p>
                  <Button onClick={addTestData} variant="outline" disabled={loading}>
                    <Plus className="w-4 h-4 mr-2" />
                    {text.addTestData}
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Pages Tab */}
            <TabsContent value="pages" className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p>{text.loading}</p>
                </div>
              ) : pages.length > 0 ? (
                <div className="space-y-4">
                  {pages.map((page) => (
                    <Card key={page.id} className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white">
                              <Building className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">{page.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                {page.category && <span>{page.category}</span>}
                                {page.website && (
                                  <span className="flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    {page.website}
                                  </span>
                                )}
                                {page.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {page.phone}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                                <span>المعجبون: {page.fan_count?.toLocaleString() || 0}</span>
                                <span>المتابعون: {page.followers_count?.toLocaleString() || 0}</span>
                                {page.average_rating && (
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    {page.average_rating.toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {page.is_verified && <Badge variant="outline">موثق</Badge>}
                            {page.is_active && <Badge variant="secondary">نشط</Badge>}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPageId(page.id)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              {text.viewDetails}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">{text.noData}</p>
                  <p className="text-sm mb-4">لا توجد بيانات صفحات محفوظة</p>
                  <Button onClick={addTestData} variant="outline" disabled={loading}>
                    <Plus className="w-4 h-4 mr-2" />
                    {text.addTestData}
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Groups Tab */}
            <TabsContent value="groups" className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p>{text.loading}</p>
                </div>
              ) : groups.length > 0 ? (
                <div className="space-y-4">
                  {groups.map((group) => (
                    <Card key={group.id} className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                              <Users className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">{group.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <Badge variant="outline">{group.privacy}</Badge>
                                <span>الأعضاء: {group.member_count?.toLocaleString() || 0}</span>
                                <span>المشرفون: {group.admin_count || 0}</span>
                              </div>
                              {group.description && (
                                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{group.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {group.is_active && <Badge variant="secondary">نشط</Badge>}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedGroupId(group.id)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              {text.viewDetails}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">{text.noData}</p>
                  <p className="text-sm mb-4">لا توجد بيانات مجموعات محفوظة</p>
                  <Button onClick={addTestData} variant="outline" disabled={loading}>
                    <Plus className="w-4 h-4 mr-2" />
                    {text.addTestData}
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              {analytics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
                    <CardHeader>
                      <CardTitle className="text-lg">إحصائيات المستخدمين</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>إجمالي المستخدمين:</span>
                        <span className="font-bold">{analytics.total_users}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>المستخدمون النشطون:</span>
                        <span className="font-bold text-green-600">{analytics.active_users}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>تفاعل عالي:</span>
                        <span className="font-bold text-blue-600">{analytics.high_engagement_users}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
                    <CardHeader>
                      <CardTitle className="text-lg">إحصائيات الصفحات</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>إجمالي الصفحات:</span>
                        <span className="font-bold">{analytics.total_pages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>الصفحات الموثقة:</span>
                        <span className="font-bold text-blue-600">{analytics.verified_pages}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
                    <CardHeader>
                      <CardTitle className="text-lg">النشاط الأخير</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>النشاط الأسبوعي:</span>
                        <span className="font-bold text-orange-600">{analytics.recent_activity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>تعليقات غير مجاب عليها:</span>
                        <span className="font-bold text-red-600">{analytics.unresponded_comments}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">{text.noData}</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
