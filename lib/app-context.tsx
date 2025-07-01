"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface UserSettings {
  accessToken: string
  pageId: string
  groupIds: string[]
  refreshInterval: number
  autoRefresh: boolean
  darkMode: boolean
  language: "ar" | "en"
  phoneSearchEnabled: boolean
  enhancedDataCollection: boolean
  notifications: boolean
  exportFormat: "json" | "csv" | "xlsx"
}

interface AppContextType {
  userSettings: UserSettings
  updateSettings: (settings: Partial<UserSettings>) => void
  isAuthenticated: boolean
  setIsAuthenticated: (authenticated: boolean) => void
  currentUser: any
  setCurrentUser: (user: any) => void
}

const defaultSettings: UserSettings = {
  accessToken: "",
  pageId: "",
  groupIds: [],
  refreshInterval: 30,
  autoRefresh: false,
  darkMode: false,
  language: "ar",
  phoneSearchEnabled: true,
  enhancedDataCollection: true,
  notifications: true,
  exportFormat: "json",
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultSettings)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // تحميل الإعدادات من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedSettings = localStorage.getItem("facebook_monitor_settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setUserSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }

    const savedAuth = localStorage.getItem("facebook_monitor_auth")
    if (savedAuth === "true") {
      setIsAuthenticated(true)
    }

    const savedUser = localStorage.getItem("facebook_monitor_user")
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error loading user:", error)
      }
    }
  }, [])

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...userSettings, ...newSettings }
    setUserSettings(updatedSettings)
    localStorage.setItem("facebook_monitor_settings", JSON.stringify(updatedSettings))
  }

  const contextValue: AppContextType = {
    userSettings,
    updateSettings,
    isAuthenticated,
    setIsAuthenticated: (authenticated: boolean) => {
      setIsAuthenticated(authenticated)
      localStorage.setItem("facebook_monitor_auth", authenticated.toString())
    },
    currentUser,
    setCurrentUser: (user: any) => {
      setCurrentUser(user)
      localStorage.setItem("facebook_monitor_user", JSON.stringify(user))
    },
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
