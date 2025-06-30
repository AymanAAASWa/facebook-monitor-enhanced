"use client"

import { useState, useEffect, useRef } from "react"
import { PhoneSearchService } from "@/services/phone-search-service"
import { FirebaseService } from "@/services/firebase-service"
import { FacebookApiService } from "@/services/facebook-api-service"
import { extractFacebookId } from "@/lib/utils"
import type { Post, UserData, SavedPhone, FacebookSettings, FileStatus, SettingsMessage } from "@/types"
import type { LoadOptions } from "@/components/facebook-monitor/advanced-load-options"

export function useFacebookMonitor(user: any) {
  const [language, setLanguage] = useState<"ar" | "en">("ar")
  const [accessToken, setAccessToken] = useState("")
  const [groupIds, setGroupIds] = useState<string[]>([])
  const [pageIds, setPageIds] = useState<string[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [savedPhones, setSavedPhones] = useState<SavedPhone[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState<string>("")
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [phoneDataText, setPhoneDataText] = useState("")
  const [phoneFileName, setPhoneFileName] = useState("")
  const [phoneFileUrl, setPhoneFileUrl] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")
  const [searchingPhones, setSearchingPhones] = useState<Set<string>>(new Set())
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [autoReload, setAutoReload] = useState(false)
  const [sourceFilter, setSourceFilter] = useState<"all" | "groups" | "pages">("all")
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [phoneSearchResults, setPhoneSearchResults] = useState<{ [key: string]: string }>({})
  const [fileStatus, setFileStatus] = useState<FileStatus>({
    loaded: false,
    fileName: "",
    recordsCount: 0,
    fileSize: 0,
    indexed: false,
  })
  const [uploadingToFirebase, setUploadingToFirebase] = useState(false)
  const [phoneDataMap, setPhoneDataMap] = useState<Map<string, string>>(new Map())
  const [processingLargeFile, setProcessingLargeFile] = useState(false)
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null)
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const [nextPageTokens, setNextPageTokens] = useState<{ [key: string]: string }>({})
  const [savingSettings, setSavingSettings] = useState(false)
  const [loadingSettings, setLoadingSettings] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState<SettingsMessage | null>(null)
  const [sourceNames, setSourceNames] = useState<{ [key: string]: string }>({})
  const [apiConnectionTested, setApiConnectionTested] = useState(false)
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  const [restrictedSources, setRestrictedSources] = useState<Set<string>>(new Set())

  const phoneSearchService = useRef<PhoneSearchService | null>(null)
  const facebookApiService = useRef<FacebookApiService | null>(null)

  // Initialize services
  useEffect(() => {
    phoneSearchService.current = new PhoneSearchService()
    return () => {
      phoneSearchService.current?.destroy()
    }
  }, [])

  // Update Facebook API service when access token changes
  useEffect(() => {
    if (accessToken.trim()) {
      facebookApiService.current = new FacebookApiService(accessToken)
      setApiConnectionTested(false)
    } else {
      facebookApiService.current = null
      setApiConnectionTested(false)
    }
  }, [accessToken])

  // Update phone search service data
  useEffect(() => {
    if (phoneSearchService.current) {
      phoneSearchService.current.setPhoneDataText(phoneDataText)
      phoneSearchService.current.setPhoneDataMap(phoneDataMap)
      phoneSearchService.current.setSavedPhones(savedPhones)
    }
  }, [phoneDataText, phoneDataMap, savedPhones])

  // Auto-save settings (only after initial load)
  useEffect(() => {
    if (settingsLoaded && user?.uid && (accessToken || groupIds.length > 0 || pageIds.length > 0 || phoneFileUrl)) {
      const timeoutId = setTimeout(() => {
        saveSettingsToFirebase(true)
      }, 2000)
      return () => clearTimeout(timeoutId)
    }
  }, [accessToken, groupIds, pageIds, phoneFileUrl, user?.uid, settingsLoaded])

  // Load settings and data on mount - ONLY ONCE
  useEffect(() => {
    if (user?.uid && !settingsLoaded) {
      console.log("Loading settings for user:", user.uid)
      loadSettingsFromFirebase()
      loadSavedPhones()
    }
  }, [user?.uid, settingsLoaded])

  // Auto-hide settings message
  useEffect(() => {
    if (settingsMessage) {
      const timer = setTimeout(() => {
        setSettingsMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [settingsMessage])

  // Test API connection when access token is set
  const testApiConnection = async () => {
    if (!facebookApiService.current || !accessToken.trim()) {
      setSettingsMessage({ type: "error", message: "يرجى إدخال رمز الوصول أولاً" })
      return false
    }

    setLoadingStatus("🔍 اختبار الاتصال مع Facebook API...")

    try {
      const result = await facebookApiService.current.testConnection()

      if (result.success) {
        setApiConnectionTested(true)
        setLoadingStatus(`✅ تم الاتصال بنجاح! مرحباً ${result.user?.name}`)
        setSettingsMessage({
          type: "success",
          message: `تم الاتصال بنجاح مع Facebook API! مرحباً ${result.user?.name}`,
        })
        return true
      } else {
        setApiConnectionTested(false)
        setLoadingStatus(`❌ فشل الاتصال: ${result.error}`)
        setSettingsMessage({
          type: "error",
          message: `فشل الاتصال مع Facebook API: ${result.error}`,
        })
        return false
      }
    } catch (error) {
      setApiConnectionTested(false)
      const errorMessage = error instanceof Error ? error.message : "خطأ غير معروف"
      setLoadingStatus(`❌ خطأ في الاتصال: ${errorMessage}`)
      setSettingsMessage({
        type: "error",
        message: `خطأ في الاتصال: ${errorMessage}`,
      })
      return false
    }
  }

  // Load source names (groups and pages info)
  const loadSourceNames = async (processedGroupIds: string[], processedPageIds: string[]) => {
    if (!facebookApiService.current) return

    const newSourceNames: { [key: string]: string } = {}

    // Load group names
    for (const groupId of processedGroupIds) {
      try {
        setLoadingStatus(`📋 جاري تحميل معلومات الجروب: ${groupId}`)
        const groupInfo = await facebookApiService.current.getGroupInfo(groupId)
        newSourceNames[groupId] = groupInfo.name || `Group ${groupId}`
      } catch (error) {
        console.error(`Error loading group ${groupId}:`, error)
        newSourceNames[groupId] = `Group ${groupId}`
      }
    }

    // Load page names
    for (const pageId of processedPageIds) {
      try {
        setLoadingStatus(`📄 جاري تحميل معلومات الصفحة: ${pageId}`)
        const pageInfo = await facebookApiService.current.getPageInfo(pageId)
        newSourceNames[pageId] = pageInfo.name || `Page ${pageId}`
      } catch (error) {
        console.error(`Error loading page ${pageId}:`, error)
        newSourceNames[pageId] = `Page ${pageId}`
      }
    }

    setSourceNames((prev) => ({ ...prev, ...newSourceNames }))
  }

  const saveSettingsToFirebase = async (silent = false) => {
    if (!user?.uid) return

    if (!silent) setSavingSettings(true)
    if (!silent) setSettingsMessage(null)

    try {
      const settingsData: FacebookSettings = {
        accessToken,
        groupIds,
        pageIds,
        keywordFilters: [],
        excludeKeywords: [],
        lastUpdated: new Date(),
        phoneFileUrl,
      }

      await FirebaseService.saveSettings(user.uid, settingsData)
      console.log("Settings saved for user:", user.uid, settingsData)

      if (!silent) {
        setSettingsMessage({ type: "success", message: "✅ تم حفظ الإعدادات بنجاح" })
        setLoadingStatus("✅ تم حفظ الإعدادات")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      if (!silent) {
        setSettingsMessage({ type: "error", message: "❌ خطأ في حفظ الإعدادات" })
        setLoadingStatus("❌ خطأ في حفظ الإعدادات")
      }
    } finally {
      if (!silent) setSavingSettings(false)
    }
  }

  const loadSettingsFromFirebase = async () => {
    if (!user?.uid) return

    setLoadingSettings(true)
    setLoadingStatus("🔄 جاري تحميل الإعدادات المحفوظة...")

    try {
      const data = await FirebaseService.loadSettings(user.uid)
      if (data) {
        console.log("Settings loaded:", data)
        setAccessToken(data.accessToken || "")
        setGroupIds(data.groupIds || [])
        setPageIds(data.pageIds || [])
        setPhoneFileUrl(data.phoneFileUrl || "")

        // Test API connection if token exists
        if (data.accessToken) {
          setTimeout(() => {
            testApiConnection()
          }, 1000)
        }

        setSettingsMessage({ type: "success", message: "✅ تم تحميل الإعدادات المحفوظة بنجاح" })
        setLoadingStatus("✅ تم تحميل الإعدادات المحفوظة")
      } else {
        setLoadingStatus("ℹ️ لا توجد إعدادات محفوظة - يمكنك إدخال الإعدادات الآن")
      }
      setSettingsLoaded(true)
    } catch (error) {
      console.error("Error loading settings:", error)
      setSettingsMessage({ type: "error", message: "❌ خطأ في تحميل الإعدادات المحفوظة" })
      setLoadingStatus("❌ خطأ في تحميل الإعدادات")
      setSettingsLoaded(true)
    } finally {
      setLoadingSettings(false)
    }
  }

  const loadSavedPhones = async () => {
    if (!user?.uid) return

    try {
      const phones = await FirebaseService.loadSavedPhones(user.uid)
      setSavedPhones(phones)
    } catch (error) {
      console.error("Error loading saved phones:", error)
    }
  }

  const savePhoneToFirebase = async (userId: string, userName: string, phone: string, source: string) => {
    if (!user?.uid) return

    try {
      const phoneData: SavedPhone = {
        userId,
        userName,
        phone,
        discoveredAt: new Date(),
        source,
      }

      await FirebaseService.savePhone(user.uid, {
        ...phoneData,
        ownerId: user.uid,
      })

      setSavedPhones((prev) => [...prev, phoneData])
      setLoadingStatus(`✅ تم حفظ الرقم: ${userName} - ${phone}`)
    } catch (error) {
      console.error("Error saving phone:", error)
    }
  }

  const handlePhoneSearch = async (userId: string, userName: string, source: string) => {
    if (searchingPhones.has(userId) || !phoneSearchService.current) return

    setSearchingPhones((prev) => new Set(prev).add(userId))
    setPhoneSearchResults((prev) => ({ ...prev, [userId]: "جاري البحث..." }))

    try {
      const phone = await phoneSearchService.current.searchPhone(
        userId,
        user?.uid || "",
        phoneFileUrl,
        fileStatus.indexed,
      )

      if (phone) {
        await savePhoneToFirebase(userId, userName, phone, source)
        setPhoneSearchResults((prev) => ({ ...prev, [userId]: phone }))
        setLoadingStatus(`✅ تم العثور على رقم ${userName}: ${phone}`)
      } else {
        setPhoneSearchResults((prev) => ({ ...prev, [userId]: "لا يوجد رقم" }))
        setLoadingStatus(`❌ لم يتم العثور على رقم لـ ${userName}`)
      }
    } catch (error) {
      console.error("Error searching phone:", error)
      setPhoneSearchResults((prev) => ({ ...prev, [userId]: "خطأ في البحث" }))
      setLoadingStatus(`❌ خطأ في البحث عن رقم ${userName}`)
    } finally {
      setSearchingPhones((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  // Helper function to filter posts by date range
  const filterPostsByDateRange = (posts: Post[], options: LoadOptions): Post[] => {
    if (options.timeRange === "all") return posts

    const now = new Date()
    let startDate: Date

    switch (options.timeRange) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "custom":
        if (options.customStartDate) {
          startDate = new Date(options.customStartDate)
          const endDate = options.customEndDate ? new Date(options.customEndDate) : now
          return posts.filter((post) => {
            const postDate = new Date(post.created_time)
            return postDate >= startDate && postDate <= endDate
          })
        }
        return posts
      default:
        return posts
    }

    return posts.filter((post) => new Date(post.created_time) >= startDate)
  }

  // Enhanced loadPosts function with advanced options
  const loadPosts = async (isLoadingOlder = false, options?: LoadOptions) => {
    const processedGroupIds = groupIds.map(extractFacebookId).filter(Boolean)
    const processedPageIds = pageIds.map(extractFacebookId).filter(Boolean)

    // Apply source filtering if options provided
    let targetGroupIds = processedGroupIds
    let targetPageIds = processedPageIds

    if (options) {
      // Filter by source types
      if (!options.sourceTypes.includes("groups")) {
        targetGroupIds = []
      }
      if (!options.sourceTypes.includes("pages")) {
        targetPageIds = []
      }

      // Filter by specific sources
      if (options.selectedSources.length > 0) {
        targetGroupIds = targetGroupIds.filter((id) => options.selectedSources.includes(id))
        targetPageIds = targetPageIds.filter((id) => options.selectedSources.includes(id))
      }
    }

    const allSources = [
      ...targetGroupIds.map((id) => ({ id, type: "group" as const })),
      ...targetPageIds.map((id) => ({ id, type: "page" as const })),
    ]

    if (!accessToken || allSources.length === 0) {
      setSettingsMessage({
        type: "error",
        message: "⚠️ يرجى إدخال رمز الوصول ومعرفات الجروبات/الصفحات في الإعدادات أولاً",
      })
      return
    }

    // Test API connection first if not tested
    if (!apiConnectionTested) {
      const connectionSuccess = await testApiConnection()
      if (!connectionSuccess) {
        return
      }
    }

    if (isLoadingOlder) {
      setLoadingOlder(true)
    } else {
      setLoading(true)
      setPosts([])
      setNextPageTokens({})
      setHasMorePosts(true)
      setRestrictedSources(new Set())
    }

    const allPosts: Post[] = []
    const newNextPageTokens: { [key: string]: string } = { ...nextPageTokens }
    const newRestrictedSources = new Set(restrictedSources)
    let hasAnyMorePosts = false
    let successfulSources = 0
    let restrictedSourcesCount = 0

    // Determine posts limit
    const postsLimit = options?.postsLimit || 25

    try {
      setLoadingStatus(
        isLoadingOlder
          ? "🔄 جاري تحميل المنشورات الأقدم..."
          : `🔍 بدء تحميل ${postsLimit} منشور من ${allSources.length} مصدر...`,
      )

      // Load source names if not loaded
      if (Object.keys(sourceNames).length === 0) {
        await loadSourceNames(targetGroupIds, targetPageIds)
      }

      for (let i = 0; i < allSources.length; i++) {
        const source = allSources[i]
        const sourceKey = `${source.type}_${source.id}`
        const sourceName = sourceNames[source.id] || source.id

        setLoadingStatus(
          `📡 تحميل ${source.type === "group" ? "الجروب" : "الصفحة"} ${i + 1}/${allSources.length}: ${sourceName}`,
        )

        try {
          let postsData = null

          // Get pagination token for this source
          const afterToken = isLoadingOlder ? newNextPageTokens[sourceKey] : undefined

          if (source.type === "group") {
            postsData = await facebookApiService.current!.getGroupPosts(source.id, postsLimit, afterToken)
          } else {
            postsData = await facebookApiService.current!.getPagePosts(source.id, postsLimit, afterToken)
          }

          if (postsData.restricted || postsData.error) {
            // Handle restricted access
            newRestrictedSources.add(source.id)
            restrictedSourcesCount++
            setLoadingStatus(`⚠️ ${sourceName}: ${postsData.error || "الوصول مقيد"}`)
            continue
          }

          if (postsData && postsData.data && postsData.data.length > 0) {
            setLoadingStatus(`📝 تم العثور على ${postsData.data.length} منشور من ${sourceName}`)
            successfulSources++

            for (const post of postsData.data) {
              // Skip posts without content
              if (!post.message && !post.story && !post.full_picture && !post.attachments) {
                continue
              }

              const enhancedPost: Post = {
                ...post,
                source: source.id,
                source_type: source.type,
                source_name: sourceName,
              }

              allPosts.push(enhancedPost)
            }

            // Update pagination token
            if (postsData.paging?.next) {
              const nextUrl = new URL(postsData.paging.next)
              const afterParam = nextUrl.searchParams.get("after")
              if (afterParam) {
                newNextPageTokens[sourceKey] = afterParam
                hasAnyMorePosts = true
              }
            } else {
              delete newNextPageTokens[sourceKey]
            }
          } else {
            setLoadingStatus(`ℹ️ لا توجد منشورات من ${sourceName}`)
            delete newNextPageTokens[sourceKey]
          }
        } catch (sourceError) {
          console.error(`❌ خطأ في معالجة المصدر ${source.id}:`, sourceError)
          setLoadingStatus(`❌ خطأ في معالجة المصدر ${sourceName}: ${sourceError.message}`)
          newRestrictedSources.add(source.id)
          restrictedSourcesCount++
        }
      }

      // Apply date filtering if options provided
      let filteredPosts = allPosts
      if (options) {
        filteredPosts = filterPostsByDateRange(allPosts, options)
      }

      // Sort posts based on options
      if (options?.sortBy === "oldest") {
        filteredPosts.sort((a, b) => new Date(a.created_time).getTime() - new Date(b.created_time).getTime())
      } else if (options?.sortBy === "most_comments") {
        filteredPosts.sort((a, b) => (b.comments?.data?.length || 0) - (a.comments?.data?.length || 0))
      } else {
        // Default: newest first
        filteredPosts.sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime())
      }

      if (isLoadingOlder) {
        setPosts((prev) => [...prev, ...filteredPosts])
      } else {
        setPosts(filteredPosts)
      }

      setNextPageTokens(newNextPageTokens)
      setHasMorePosts(hasAnyMorePosts)
      setRestrictedSources(newRestrictedSources)
      setLastUpdate(new Date())

      // Show comprehensive status
      let statusMessage = ""
      if (isLoadingOlder) {
        statusMessage = `✅ تم تحميل ${filteredPosts.length} منشور أقدم`
      } else {
        statusMessage = `✅ تم تحميل ${filteredPosts.length} منشور من ${successfulSources} مصدر`
        if (restrictedSourcesCount > 0) {
          statusMessage += ` (${restrictedSourcesCount} مصدر مقيد الوصول)`
        }
        if (options?.timeRange && options.timeRange !== "all") {
          statusMessage += ` - الفترة: ${options.timeRange}`
        }
      }
      setLoadingStatus(statusMessage)

      // Show warning if some sources are restricted
      if (restrictedSourcesCount > 0 && !isLoadingOlder) {
        setSettingsMessage({
          type: "error",
          message: `⚠️ ${restrictedSourcesCount} مصدر لا يمكن الوصول إليه. تأكد من أنك عضو في الجروبات وأن لديك الصلاحيات المطلوبة.`,
        })
      }
    } catch (error) {
      console.error("❌ خطأ عام في تحميل المنشورات:", error)
      setLoadingStatus(`❌ خطأ في تحميل المنشورات: ${error.message}`)
      setSettingsMessage({
        type: "error",
        message: `خطأ في تحميل المنشورات: ${error.message}`,
      })
    } finally {
      if (isLoadingOlder) {
        setLoadingOlder(false)
      } else {
        setLoading(false)
      }
    }
  }

  return {
    // State
    language,
    setLanguage,
    accessToken,
    setAccessToken,
    groupIds,
    setGroupIds,
    pageIds,
    setPageIds,
    posts,
    users,
    savedPhones,
    searchQuery,
    setSearchQuery,
    loading,
    loadingOlder,
    loadingStatus,
    setLoadingStatus,
    expandedComments,
    setExpandedComments,
    phoneDataText,
    setPhoneDataText,
    phoneFileName,
    setPhoneFileName,
    phoneFileUrl,
    setPhoneFileUrl,
    darkMode,
    setDarkMode,
    activeTab,
    setActiveTab,
    searchingPhones,
    lastUpdate,
    autoReload,
    setAutoReload,
    sourceFilter,
    setSourceFilter,
    selectedSources,
    setSelectedSources,
    phoneSearchResults,
    fileStatus,
    setFileStatus,
    uploadingToFirebase,
    setUploadingToFirebase,
    phoneDataMap,
    setPhoneDataMap,
    processingLargeFile,
    setProcessingLargeFile,
    fullscreenVideo,
    setFullscreenVideo,
    hasMorePosts,
    nextPageTokens,
    savingSettings,
    loadingSettings,
    settingsMessage,
    sourceNames,
    apiConnectionTested,
    restrictedSources,

    // Functions
    handlePhoneSearch,
    loadPosts,
    saveSettingsToFirebase,
    loadSettingsFromFirebase,
    testApiConnection,
    phoneSearchService: phoneSearchService.current,
  }
}
