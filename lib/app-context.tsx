"use client"

import { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from "react"
import type { User } from "firebase/auth"
import type { FacebookPost } from "./facebook-service"
import { processFacebookData, type AppData } from "./data-processor"
import { firebaseService, type UserSettings } from "./firebase-service"

interface AppContextType {
  data: AppData
  loading: boolean
  error: string | null
  user: User | null
  userSettings: UserSettings | null
  fetchData: () => Promise<void>
  setUser: (user: User | null) => void
  loadUserSettings: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>({
    posts: [],
    users: new Map(),
    analytics: {
      totalPosts: 0,
      totalComments: 0,
      totalUsers: 0,
      sourceCounts: {},
      topUsers: [],
      activityByHour: {},
      activityByDay: {},
      mediaStats: { images: 0, videos: 0, totalMedia: 0 },
    },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)

  // تحميل إعدادات المستخدم من Firebase
  const loadUserSettings = useCallback(async () => {
    if (!user) return

    try {
      const result = await firebaseService.getUserSettings(user.uid)
      if (result.success && result.data) {
        setUserSettings(result.data)
      }
    } catch (error: any) {
      console.error("Error loading user settings:", error)
      setError("خطأ في تحميل إعدادات المستخدم")
    }
  }, [user])

  // تحميل إعدادات المستخدم عند تغيير المستخدم
  useEffect(() => {
    if (user) {
      loadUserSettings()
    } else {
      setUserSettings(null)
    }
  }, [user, loadUserSettings])

  // مراقبة حالة المصادقة
  useEffect(() => {
    const unsubscribe = firebaseService.onAuthStateChange((authUser) => {
      setUser(authUser)
    })

    return () => unsubscribe()
  }, [])

  const fetchData = useCallback(async () => {
    if (!user || !userSettings) {
      setError("يرجى تسجيل الدخول أولاً")
      return
    }

    if (!userSettings.accessToken) {
      setError("يرجى إدخال رمز الوصول (Access Token) في الإعدادات أولاً.")
      return
    }

    if (!userSettings.sources || userSettings.sources.length === 0) {
      setData({
        posts: [],
        users: new Map(),
        analytics: {
          totalPosts: 0,
          totalComments: 0,
          totalUsers: 0,
          sourceCounts: {},
          topUsers: [],
          activityByHour: {},
          activityByDay: {},
          mediaStats: { images: 0, videos: 0, totalMedia: 0 },
        },
      })
      setError("يرجى إضافة مصادر (مجموعات أو صفحات) في الإعدادات")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const allPosts: (FacebookPost & { source_id: string; source_name: string })[] = []

      // تحديد المصادر المراد جلب البيانات منها
      const sourcesToFetch = userSettings.selectedSourceId 
        ? userSettings.sources.filter(source => source.id === userSettings.selectedSourceId)
        : userSettings.sources

      console.log(`Fetching data from ${sourcesToFetch.length} source(s)...`)

      // Process sources one by one to avoid overwhelming the API
      for (const source of sourcesToFetch) {
        try {
          console.log(`Fetching posts from ${source.name} (${source.type})...`)

          const response = await fetch("/api/facebook/posts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sourceId: source.id,
              sourceType: source.type,
              accessToken: userSettings.accessToken,
              limit: Math.min(userSettings.monitoring?.maxPosts || 15, 25), // Increased limit for single source
            }),
          })

          const result = await response.json()

          if (result.error) {
            console.error(`Error fetching posts from ${source.name}:`, result.error)
            setError(`خطأ في جلب البيانات من ${source.name}: ${result.error}`)
            // Continue with other sources instead of stopping
            continue
          }

          if (result.data && result.data.length > 0) {
            const postsWithSource = result.data.map((p: FacebookPost) => ({
              ...p,
              source_id: source.id,
              source_name: source.name,
              source_type: source.type,
            }))
            allPosts.push(...postsWithSource)
            console.log(`Successfully fetched ${result.data.length} posts from ${source.name}`)
          } else {
            console.log(`No posts found from ${source.name}`)
          }

          // Add a small delay between requests to avoid rate limiting (only if fetching multiple sources)
          if (sourcesToFetch.length > 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        } catch (sourceError) {
          console.error(`Failed to fetch from source ${source.name}:`, sourceError)
          // Continue with other sources
          continue
        }
      }

      if (allPosts.length === 0) {
        setError("لم يتم العثور على منشورات من المصادر المحددة. تحقق من صحة المعرفات والصلاحيات.")
        return
      }

      const processedData = processFacebookData(allPosts)
      setData(processedData)

      console.log(`Successfully processed ${allPosts.length} posts from ${userSettings.sources.length} sources`)

      // حفظ المنشورات في Firebase (اختياري)
      if (allPosts.length > 0) {
        try {
          await firebaseService.savePost(user.uid, allPosts, "facebook_api")
        } catch (saveError) {
          console.error("Error saving posts to Firebase:", saveError)
        }
      }
    } catch (err: any) {
      console.error("Data fetch error:", err)
      setError(err.message || "حدث خطأ أثناء جلب البيانات.")
    } finally {
      setLoading(false)
    }
  }, [user, userSettings])

  return (
    <AppContext.Provider
      value={{
        data,
        loading,
        error,
        user,
        userSettings,
        fetchData,
        setUser,
        loadUserSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
