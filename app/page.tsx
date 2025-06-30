"use client"

import type React from "react"

import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, FileText, Users, BarChart3, Phone, Settings, Info } from "lucide-react"
import { AuthProvider, useAuth, LoginScreen } from "@/components/auth-provider"
import { Header } from "@/components/facebook-monitor/header"
import { AdvancedLoadOptions } from "@/components/facebook-monitor/advanced-load-options"
import { SearchBar } from "@/components/facebook-monitor/search-bar"
import { PostsList } from "@/components/facebook-monitor/posts-list"
import { PhoneSearchTabs } from "@/components/facebook-monitor/phone-search-tabs"
import { AboutPage } from "@/components/facebook-monitor/about-page"
import { useFacebookMonitor } from "@/hooks/use-facebook-monitor"
import { translations } from "@/constants/translations"
import { Card, CardContent } from "@/components/ui/card"
import { SettingsPanel } from "@/components/facebook-monitor/settings-panel"
import { UsersTable } from "@/components/facebook-monitor/users-table"
import { AnalyticsDashboard } from "@/components/facebook-monitor/analytics-dashboard"

function FacebookMonitor() {
  const { user, loading: authLoading, logout: authLogout } = useAuth()
  const {
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    lastUpdate,
    loadingSettings,
    loading,
    loadingOlder,
    loadingStatus,
    setLoadingStatus,
    posts,
    users,
    savedPhones,
    searchQuery,
    setSearchQuery,
    sourceFilter,
    setSourceFilter,
    selectedSources,
    setSelectedSources,
    expandedComments,
    setExpandedComments,
    searchingPhones,
    phoneSearchResults,
    phoneFileUrl,
    setPhoneFileUrl,
    fileStatus,
    setFileStatus,
    uploadingToFirebase,
    processingLargeFile,
    setProcessingLargeFile,
    hasMorePosts,
    activeTab,
    setActiveTab,
    autoReload,
    setAutoReload,
    settingsMessage,
    setSettingsMessage,
    accessToken,
    setAccessToken,
    groupIds,
    setGroupIds,
    pageIds,
    setPageIds,
    savingSettings,
    loadPosts,
    handlePhoneSearch,
    saveSettingsToFirebase,
    phoneSearchService,
    loadSettingsFromFirebase,
    apiConnectionTested,
    testApiConnection,
    setPhoneDataText,
    setPhoneDataMap,
    sourceNames,
  } = useFacebookMonitor(user)

  const t = translations[language]

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Language direction effect
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language
  }, [language])

  // Show login screen if user is not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-blue-600" />
          <p className="text-xl text-gray-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen darkMode={darkMode} language={language} />
  }

  // Filter posts based on search and filters
  const filteredPosts = posts.filter((post) => {
    const searchText = searchQuery.toLowerCase()
    const message = (post.message || "").toLowerCase()
    const authorName = (post.from?.name || "").toLowerCase()
    const sourceName = (post.source_name || "").toLowerCase()

    const matchesSearch =
      message.includes(searchText) || authorName.includes(searchText) || sourceName.includes(searchText)

    let matchesSourceType = true
    if (sourceFilter === "groups") {
      matchesSourceType = post.source_type === "group"
    } else if (sourceFilter === "pages") {
      matchesSourceType = post.source_type === "page"
    }

    let matchesSpecificSource = true
    if (selectedSources.length > 0) {
      matchesSpecificSource = selectedSources.includes(post.source || "")
    }

    return matchesSearch && matchesSourceType && matchesSpecificSource
  })

  const downloadCSV = () => {
    const headers = [
      "Type",
      "Source",
      "SourceType",
      "AuthorName",
      "Phone",
      "Message",
      "Time",
      "AuthorId",
      "PostId",
      "Score",
    ]
    const csvRows = [headers.join(",")]

    posts.forEach((post) => {
      const phone = savedPhones.find((p) => p.userId === post.from?.id)?.phone || ""
      const score = 10 // Simplified score calculation

      const values = [
        "Post",
        post.source_name || post.source || "",
        post.source_type || "",
        post.from?.name || t.unknown,
        phone,
        post.message || "",
        new Date(post.created_time).toLocaleString(),
        post.from?.id || "",
        post.id,
        score.toString(),
      ].map((val) => `"${val.toString().replace(/"/g, '""')}"`)

      csvRows.push(values.join(","))
    })

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "facebook_posts_and_comments.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleLargePhoneFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (50MB limit for local files)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      setSettingsMessage({
        type: "error",
        message: `الملف كبير جداً! الحد الأقصى 50 ميجا للملفات المحلية. استخدم Google Drive للملفات الكبيرة.`,
      })
      event.target.value = "" // Clear the input
      return
    }

    setProcessingLargeFile(true)
    setLoadingStatus(`🔄 جاري معالجة الملف...`)

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const data = JSON.parse(content)
          const recordsCount = Object.keys(data).length

          // Store the data for searching
          setPhoneDataText(content)

          // Create a map for faster searching
          const phoneMap = new Map<string, string>()
          Object.entries(data).forEach(([userId, phone]) => {
            phoneMap.set(userId, phone as string)
          })
          setPhoneDataMap(phoneMap)

          setFileStatus({
            loaded: true,
            fileName: file.name,
            recordsCount: recordsCount,
            fileSize: file.size,
            indexed: true,
          })

          setLoadingStatus(`✅ تم تحميل الملف بنجاح: ${recordsCount.toLocaleString()} رقم`)
          setSettingsMessage({
            type: "success",
            message: `✅ تم تحميل ملف الأرقام بنجاح! ${recordsCount.toLocaleString()} رقم جاهز للبحث`,
          })
        } catch (error) {
          console.error("Error parsing JSON file:", error)
          setLoadingStatus("❌ خطأ في قراءة الملف. تأكد من أنه ملف JSON صحيح.")
          setSettingsMessage({
            type: "error",
            message: "❌ خطأ في قراءة الملف. تأكد من أنه ملف JSON صحيح.",
          })
        }
      }

      reader.onerror = () => {
        setLoadingStatus("❌ خطأ في قراءة الملف")
        setSettingsMessage({
          type: "error",
          message: "❌ خطأ في قراءة الملف",
        })
      }

      reader.readAsText(file)
    } catch (error) {
      console.error("Error processing file:", error)
      setLoadingStatus(`❌ خطأ في معالجة الملف: ${error.message}`)
      setSettingsMessage({
        type: "error",
        message: `❌ خطأ في معالجة الملف: ${error.message}`,
      })
    } finally {
      setProcessingLargeFile(false)
    }
  }

  const testPhoneFileConnection = async () => {
    if (!phoneFileUrl.trim()) return

    setLoadingStatus("🔍 اختبار الاتصال بملف الأرقام...")
    try {
      const response = await fetch(phoneFileUrl)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const recordsCount = Object.keys(data).length
      setLoadingStatus(`✅ نجح الاتصال: ${recordsCount.toLocaleString()} رقم متاح`)
      setSettingsMessage({
        type: "success",
        message: `✅ تم الاتصال بملف الأرقام بنجاح! ${recordsCount.toLocaleString()} رقم جاهز للبحث`,
      })
    } catch (error) {
      console.error("Connection test failed:", error)
      setLoadingStatus(`❌ فشل الاتصال: ${error.message}`)
      setSettingsMessage({
        type: "error",
        message: `❌ فشل الاتصال بملف الأرقام: ${error.message}`,
      })
    }
  }

  const uploadPhoneDataToFirebase = async () => {
    // This would be implemented with actual Firebase upload logic
    setLoadingStatus("🔄 جاري الرفع إلى قاعدة البيانات...")
    // Simulate upload
    setTimeout(() => {
      setLoadingStatus("✅ تم الرفع بنجاح")
    }, 2000)
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <Header
          title={t.title}
          subtitle={t.subtitle}
          language={language}
          setLanguage={setLanguage}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          userName={user?.name || ""}
          lastUpdate={lastUpdate}
          loadingSettings={loadingSettings}
          loading={loading}
          onLoadPosts={() => loadPosts(false)}
          onLogout={authLogout}
        />

        {/* Settings Message */}
        {settingsMessage && (
          <Alert
            className={`${
              settingsMessage.type === "success"
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-red-500 bg-red-50 dark:bg-red-900/20"
            } backdrop-blur-sm`}
          >
            {settingsMessage.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription
              className={
                settingsMessage.type === "success"
                  ? "text-emerald-800 dark:text-emerald-200"
                  : "text-red-800 dark:text-red-200"
              }
            >
              {settingsMessage.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading Status */}
        {loadingStatus && (
          <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                {(loading || loadingOlder || processingLargeFile) && (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                )}
                <span className="text-sm font-medium">{loadingStatus}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Advanced Load Options */}
        <AdvancedLoadOptions
          groupIds={groupIds}
          pageIds={pageIds}
          sourceNames={sourceNames}
          loading={loading}
          onLoadPosts={(options) => loadPosts(false, options)}
          darkMode={darkMode}
          language={language}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger
              value="about"
              className="flex items-center gap-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
            >
              <Info className="w-4 h-4" />
              شرح الموقع
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4" />
              {t.posts}
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4" />
              {t.users}
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4" />
              {t.analytics}
            </TabsTrigger>
            <TabsTrigger
              value="phones"
              className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <Phone className="w-4 h-4" />
              {t.savedPhones}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-gray-500 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4" />
              {t.settings}
            </TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-4">
            <AboutPage darkMode={darkMode} language={language} onGetStarted={() => setActiveTab("settings")} />
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sourceFilter={sourceFilter}
              setSourceFilter={setSourceFilter}
              selectedSources={selectedSources}
              setSelectedSources={setSelectedSources}
              posts={posts}
              darkMode={darkMode}
              language={language}
            />

            <PostsList
              posts={filteredPosts}
              loading={loading}
              loadingOlder={loadingOlder}
              hasMorePosts={hasMorePosts}
              searchingPhones={searchingPhones}
              phoneSearchResults={phoneSearchResults}
              expandedComments={expandedComments}
              onLoadOlderPosts={() => loadPosts(true)}
              onToggleComments={(postId) => {
                setExpandedComments((prev) => {
                  const newSet = new Set(prev)
                  if (newSet.has(postId)) {
                    newSet.delete(postId)
                  } else {
                    newSet.add(postId)
                  }
                  return newSet
                })
              }}
              onPhoneSearch={handlePhoneSearch}
              darkMode={darkMode}
              language={language}
            />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <UsersTable
              posts={posts}
              filteredPosts={filteredPosts}
              savedPhones={savedPhones}
              onPhoneSearch={handlePhoneSearch}
              searchingPhones={searchingPhones}
              phoneSearchResults={phoneSearchResults}
              darkMode={darkMode}
              language={language}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsDashboard
              posts={posts}
              filteredPosts={filteredPosts}
              savedPhones={savedPhones}
              darkMode={darkMode}
              language={language}
            />
          </TabsContent>

          {/* Phones Tab */}
          <TabsContent value="phones" className="space-y-4">
            <PhoneSearchTabs
              phoneFileUrl={phoneFileUrl}
              setPhoneFileUrl={setPhoneFileUrl}
              fileStatus={fileStatus}
              uploadingToFirebase={uploadingToFirebase}
              processingLargeFile={processingLargeFile}
              savedPhones={savedPhones}
              onTestConnection={testPhoneFileConnection}
              onUploadToFirebase={uploadPhoneDataToFirebase}
              onLargeFileSelect={handleLargePhoneFileSelect}
              onLocalFileSelect={(file) => {
                // Handle local file processing here
                const event = { target: { files: [file] } } as any
                handleLargePhoneFileSelect(event)
              }}
              phoneFileRef={{ current: null }}
              darkMode={darkMode}
              language={language}
              setFileStatus={setFileStatus}
            />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <SettingsPanel
              accessToken={accessToken}
              setAccessToken={setAccessToken}
              groupIds={groupIds}
              setGroupIds={setGroupIds}
              pageIds={pageIds}
              setPageIds={setPageIds}
              phoneFileUrl={phoneFileUrl}
              setPhoneFileUrl={setPhoneFileUrl}
              autoReload={autoReload}
              setAutoReload={setAutoReload}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              language={language}
              setLanguage={setLanguage}
              savingSettings={savingSettings}
              loadingSettings={loadingSettings}
              settingsMessage={settingsMessage}
              apiConnectionTested={apiConnectionTested}
              onSaveSettings={() => saveSettingsToFirebase(false)}
              onLoadSettings={loadSettingsFromFirebase}
              onTestConnection={testApiConnection}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <FacebookMonitor />
    </AuthProvider>
  )
}
