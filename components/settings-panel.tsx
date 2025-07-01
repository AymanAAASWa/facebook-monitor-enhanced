"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Settings,
  Plus,
  Trash2,
  Save,
  TestTube,
  Key,
  Database,
  Bell,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  BookOpen,
  Cloud,
  Download,
  Upload,
} from "lucide-react"
import { DocumentationExport } from "./documentation-export"
import { firebaseService, type UserSettings } from "@/lib/firebase-service"

interface SettingsPanelProps {
  onDataRefresh: () => void
  darkMode: boolean
  language: "ar" | "en"
  userId: string
}

export function SettingsPanel({ onDataRefresh, darkMode, language, userId }: SettingsPanelProps) {
  const [settings, setSettings] = useState<UserSettings>({
    accessToken: "",
    sources: [],
    keywords: [],
    notifications: {
      enabled: true,
      keywords: true,
      newPosts: false,
      phoneFound: true,
    },
    monitoring: {
      interval: 300,
      autoRefresh: true,
      maxPosts: 100,
    },
    phoneDatabase: {},
  })

  const [newSource, setNewSource] = useState({ id: "", name: "", type: "group" as "group" | "page" })
  const [newKeyword, setNewKeyword] = useState("")
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const t = {
    ar: {
      settings: "الإعدادات",
      apiSettings: "إعدادات API",
      sources: "المصادر",
      keywords: "الكلمات المفتاحية",
      notifications: "الإشعارات",
      monitoring: "المراقبة",
      accessToken: "رمز الوصول",
      accessTokenPlaceholder: "أدخل رمز الوصول من Facebook",
      testConnection: "اختبار الاتصال",
      testing: "جاري الاختبار...",
      testSuccess: "تم الاختبار بنجاح!",
      testFailed: "فشل الاختبار:",
      addSource: "إضافة مصدر",
      sourceName: "اسم المصدر",
      sourceId: "معرف المصدر",
      sourceType: "نوع المصدر",
      group: "مجموعة",
      page: "صفحة",
      add: "إضافة",
      remove: "حذف",
      addKeyword: "إضافة كلمة مفتاحية",
      keywordPlaceholder: "أدخل كلمة مفتاحية",
      enableNotifications: "تفعيل الإشعارات",
      keywordAlerts: "تنبيهات الكلمات المفتاحية",
      newPostAlerts: "تنبيهات المنشورات الجديدة",
      phoneFoundAlerts: "تنبيهات العثور على أرقام",
      autoRefresh: "التحديث التلقائي",
      refreshInterval: "فترة التحديث (ثانية)",
      maxPosts: "الحد الأقصى للمنشورات",
      save: "حفظ الإعدادات",
      saving: "جاري الحفظ...",
      saved: "تم الحفظ بنجاح!",
      exportSettings: "تصدير الإعدادات",
      importSettings: "استيراد الإعدادات",
      docs: "التوثيق",
      cloudSync: "مزامنة السحابة",
      loading: "جاري التحميل...",
      loadingSettings: "جاري تحميل الإعدادات من السحابة...",
    },
    en: {
      settings: "Settings",
      apiSettings: "API Settings",
      sources: "Sources",
      keywords: "Keywords",
      notifications: "Notifications",
      monitoring: "Monitoring",
      accessToken: "Access Token",
      accessTokenPlaceholder: "Enter Facebook access token",
      testConnection: "Test Connection",
      testing: "Testing...",
      testSuccess: "Test successful!",
      testFailed: "Test failed:",
      addSource: "Add Source",
      sourceName: "Source Name",
      sourceId: "Source ID",
      sourceType: "Source Type",
      group: "Group",
      page: "Page",
      add: "Add",
      remove: "Remove",
      addKeyword: "Add Keyword",
      keywordPlaceholder: "Enter keyword",
      enableNotifications: "Enable Notifications",
      keywordAlerts: "Keyword Alerts",
      newPostAlerts: "New Post Alerts",
      phoneFoundAlerts: "Phone Found Alerts",
      autoRefresh: "Auto Refresh",
      refreshInterval: "Refresh Interval (seconds)",
      maxPosts: "Max Posts",
      save: "Save Settings",
      saving: "Saving...",
      saved: "Saved successfully!",
      exportSettings: "Export Settings",
      importSettings: "Import Settings",
      docs: "Documentation",
      cloudSync: "Cloud Sync",
      loading: "Loading...",
      loadingSettings: "Loading settings from cloud...",
    },
  }

  const text = t[language]

  useEffect(() => {
    loadSettings()
  }, [userId])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const result = await firebaseService.getUserSettings(userId)
      if (result.success && result.data) {
        setSettings(result.data)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const result = await firebaseService.saveUserSettings(userId, settings)
      if (result.success) {
        setTestResult({ success: true, message: text.saved })
        // إعادة تحميل الإعدادات والبيانات
        setTimeout(() => {
          onDataRefresh()
        }, 500)
      } else {
        setTestResult({ success: false, message: result.error || "خطأ في الحفظ" })
      }
    } catch (error: any) {
      setTestResult({ success: false, message: error.message })
    } finally {
      setSaving(false)
      setTimeout(() => setTestResult(null), 3000)
    }
  }

  const handleTestConnection = async () => {
    if (!settings.accessToken) {
      setTestResult({ success: false, message: "Access token is required" })
      return
    }

    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/facebook/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: settings.accessToken }),
      })

      const result = await response.json()

      if (result.isValid) {
        setTestResult({ success: true, message: text.testSuccess })
      } else {
        setTestResult({ success: false, message: result.error || "Token validation failed" })
      }
    } catch (error) {
      setTestResult({ success: false, message: "Network error occurred" })
    } finally {
      setTesting(false)
    }
  }

  const handleAddSource = () => {
    if (newSource.id && newSource.name) {
      setSettings((prev) => ({
        ...prev,
        sources: [...prev.sources, { ...newSource }],
      }))
      setNewSource({ id: "", name: "", type: "group" })
    }
  }

  const handleRemoveSource = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index),
    }))
  }

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setSettings((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }))
      setNewKeyword("")
    }
  }

  const handleRemoveKeyword = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }))
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `facebook-monitor-settings-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string)
        setSettings(importedSettings)
        setTestResult({ success: true, message: "تم استيراد الإعدادات بنجاح" })
      } catch (error) {
        setTestResult({ success: false, message: "خطأ في قراءة ملف الإعدادات" })
      }
    }
    reader.readAsText(file)
  }

  if (loading) {
    return (
      <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
          <p className="text-gray-500">{text.loadingSettings}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {text.settings}
            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
              <Cloud className="w-3 h-3 mr-1" />
              {text.cloudSync}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="api" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                API
              </TabsTrigger>
              <TabsTrigger value="sources" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                {text.sources}
              </TabsTrigger>
              <TabsTrigger value="keywords" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {text.keywords}
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                {text.notifications}
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {text.docs}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="api" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="accessToken">{text.accessToken}</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="accessToken"
                      type="password"
                      placeholder={text.accessTokenPlaceholder}
                      value={settings.accessToken}
                      onChange={(e) => setSettings((prev) => ({ ...prev, accessToken: e.target.value }))}
                      className="flex-1"
                    />
                    <Button onClick={handleTestConnection} disabled={testing} variant="outline">
                      {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                      {testing ? text.testing : text.testConnection}
                    </Button>
                  </div>
                  {testResult && (
                    <div
                      className={`flex items-center gap-2 mt-2 p-2 rounded ${
                        testResult.success
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {testResult.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span className="text-sm">{testResult.message}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={exportSettings} variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    {text.exportSettings}
                  </Button>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      className="hidden"
                      id="import-settings"
                    />
                    <Button
                      onClick={() => document.getElementById("import-settings")?.click()}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {text.importSettings}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sources" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <Input
                    placeholder={text.sourceName}
                    value={newSource.name}
                    onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  />
                  <Input
                    placeholder={text.sourceId}
                    value={newSource.id}
                    onChange={(e) => setNewSource({ ...newSource, id: e.target.value })}
                  />
                  <Select
                    value={newSource.type}
                    onValueChange={(value: "group" | "page") => setNewSource({ ...newSource, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="group">{text.group}</SelectItem>
                      <SelectItem value="page">{text.page}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddSource} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    {text.add}
                  </Button>
                </div>

                <div className="space-y-2">
                  {settings.sources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant={source.type === "group" ? "default" : "secondary"}>
                          {source.type === "group" ? text.group : text.page}
                        </Badge>
                        <div>
                          <p className="font-medium">{source.name}</p>
                          <p className="text-sm text-gray-500">{source.id}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSource(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="keywords" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={text.keywordPlaceholder}
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddKeyword()}
                  className="flex-1"
                />
                <Button onClick={handleAddKeyword}>
                  <Plus className="w-4 h-4 mr-2" />
                  {text.add}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {settings.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {keyword}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveKeyword(index)}
                      className="h-4 w-4 p-0 hover:bg-red-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableNotifications">{text.enableNotifications}</Label>
                  <Switch
                    id="enableNotifications"
                    checked={settings.notifications.enabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, enabled: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="keywordAlerts">{text.keywordAlerts}</Label>
                  <Switch
                    id="keywordAlerts"
                    checked={settings.notifications.keywords}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, keywords: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="newPostAlerts">{text.newPostAlerts}</Label>
                  <Switch
                    id="newPostAlerts"
                    checked={settings.notifications.newPosts}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, newPosts: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="phoneFoundAlerts">{text.phoneFoundAlerts}</Label>
                  <Switch
                    id="phoneFoundAlerts"
                    checked={settings.notifications.phoneFound}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, phoneFound: checked },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">{text.refreshInterval}</Label>
                  <Input
                    id="refreshInterval"
                    type="number"
                    min="60"
                    max="3600"
                    value={settings.monitoring.interval}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        monitoring: { ...prev.monitoring, interval: Number.parseInt(e.target.value) || 300 },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPosts">{text.maxPosts}</Label>
                  <Input
                    id="maxPosts"
                    type="number"
                    min="10"
                    max="500"
                    value={settings.monitoring.maxPosts}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        monitoring: { ...prev.monitoring, maxPosts: Number.parseInt(e.target.value) || 100 },
                      }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="docs">
              <DocumentationExport darkMode={darkMode} language={language} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-6 border-t">
            <Button onClick={handleSaveSettings} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saving ? text.saving : text.save}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
