"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Save,
  RefreshCw,
  Key,
  Palette,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
  TestTube,
  Info,
  HelpCircle,
} from "lucide-react"
import { extractFacebookId } from "@/lib/utils"
import { TokenGuide } from "./token-guide"
import type { SettingsMessage } from "@/types"

interface SettingsPanelProps {
  accessToken: string
  setAccessToken: (token: string) => void
  groupIds: string[]
  setGroupIds: (ids: string[]) => void
  pageIds: string[]
  setPageIds: (ids: string[]) => void
  phoneFileUrl: string
  setPhoneFileUrl: (url: string) => void
  autoReload: boolean
  setAutoReload: (auto: boolean) => void
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
  language: "ar" | "en"
  setLanguage: (lang: "ar" | "en") => void
  savingSettings: boolean
  loadingSettings: boolean
  settingsMessage: SettingsMessage | null
  apiConnectionTested: boolean
  onSaveSettings: () => void
  onLoadSettings: () => void
  onTestConnection: () => void
}

export function SettingsPanel({
  accessToken,
  setAccessToken,
  groupIds,
  setGroupIds,
  pageIds,
  setPageIds,
  phoneFileUrl,
  setPhoneFileUrl,
  autoReload,
  setAutoReload,
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  savingSettings,
  loadingSettings,
  settingsMessage,
  apiConnectionTested,
  onSaveSettings,
  onLoadSettings,
  onTestConnection,
}: SettingsPanelProps) {
  const [groupIdsText, setGroupIdsText] = useState(groupIds.join("\n"))
  const [pageIdsText, setPageIdsText] = useState(pageIds.join("\n"))
  const [testingConnection, setTestingConnection] = useState(false)
  const [activeSettingsTab, setActiveSettingsTab] = useState("facebook")

  const t = {
    ar: {
      facebookSettings: "إعدادات فيسبوك",
      appSettings: "إعدادات التطبيق",
      tokenGuide: "دليل Token",
      accessToken: "رمز الوصول",
      enterAccessToken: "أدخل رمز الوصول الخاص بك",
      accessTokenDesc: "احصل على رمز الوصول من Facebook Developer Console",
      accessTokenHelp: "يجب أن يحتوي الرمز على صلاحيات: groups_access_member_info, pages_read_engagement",
      groupIds: "معرفات الجروبات",
      enterGroupUrls: "أدخل روابط الجروبات أو المعرفات (واحد في كل سطر)",
      groupIdsDesc: "معرف الجروب يمكن العثور عليه في رابط الجروب",
      pageIds: "معرفات الصفحات",
      enterPageUrls: "أدخل روابط الصفحات أو المعرفات (واحد في كل سطر)",
      pageIdsDesc: "معرف الصفحة يمكن العثور عليه في رابط الصفحة",
      urlSupport: "يدعم الروابط والمعرفات",
      phoneFileUrl: "رابط ملف الأرقام",
      enterPhoneFileUrl: "أدخل رابط ملف الأرقام (JSON)",
      phoneFileUrlDesc: "رابط مباشر لملف JSON يحتوي على الأرقام",
      autoReload: "التحديث التلقائي",
      autoReloadDesc: "تحديث المنشورات تلقائياً كل 5 دقائق",
      notifications: "الإشعارات",
      notificationsDesc: "إظهار إشعارات للمنشورات الجديدة",
      autoSave: "الحفظ التلقائي",
      autoSaveDesc: "حفظ الإعدادات تلقائياً عند التغيير",
      darkMode: "الوضع الليلي",
      darkModeDesc: "تفعيل الوضع الليلي للواجهة",
      language: "اللغة",
      languageDesc: "اختيار لغة الواجهة",
      arabic: "العربية",
      english: "الإنجليزية",
      saveSettings: "حفظ الإعدادات",
      loadSettings: "تحميل الإعدادات",
      testConnection: "اختبار الاتصال",
      saving: "جاري الحفظ...",
      loading: "جاري التحميل...",
      testing: "جاري الاختبار...",
      connectionStatus: "حالة الاتصال",
      connected: "متصل",
      notConnected: "غير متصل",
      connectionRequired: "يجب اختبار الاتصال أولاً",
      needHelp: "تحتاج مساعدة؟",
      checkGuide: "راجع دليل الحصول على Token",
    },
    en: {
      facebookSettings: "Facebook Settings",
      appSettings: "App Settings",
      tokenGuide: "Token Guide",
      accessToken: "Access Token",
      enterAccessToken: "Enter your access token",
      accessTokenDesc: "Get access token from Facebook Developer Console",
      accessTokenHelp: "Token must have permissions: groups_access_member_info, pages_read_engagement",
      groupIds: "Group IDs",
      enterGroupUrls: "Enter group URLs or IDs (one per line)",
      groupIdsDesc: "Group ID can be found in the group URL",
      pageIds: "Page IDs",
      enterPageUrls: "Enter page URLs or IDs (one per line)",
      pageIdsDesc: "Page ID can be found in the page URL",
      urlSupport: "Supports URLs and IDs",
      phoneFileUrl: "Phone File URL",
      enterPhoneFileUrl: "Enter phone file URL (JSON)",
      phoneFileUrlDesc: "Direct link to JSON file containing phone numbers",
      autoReload: "Auto Reload",
      autoReloadDesc: "Automatically refresh posts every 5 minutes",
      notifications: "Notifications",
      notificationsDesc: "Show notifications for new posts",
      autoSave: "Auto Save",
      autoSaveDesc: "Automatically save settings when changed",
      darkMode: "Dark Mode",
      darkModeDesc: "Enable dark mode for the interface",
      language: "Language",
      languageDesc: "Choose interface language",
      arabic: "Arabic",
      english: "English",
      saveSettings: "Save Settings",
      loadSettings: "Load Settings",
      testConnection: "Test Connection",
      saving: "Saving...",
      loading: "Loading...",
      testing: "Testing...",
      connectionStatus: "Connection Status",
      connected: "Connected",
      notConnected: "Not Connected",
      connectionRequired: "Connection test required first",
      needHelp: "Need Help?",
      checkGuide: "Check the Token Guide",
    },
  }

  const text = t[language]

  useEffect(() => {
    setGroupIdsText(groupIds.join("\n"))
    setPageIdsText(pageIds.join("\n"))
  }, [groupIds, pageIds])

  const handleSave = async () => {
    // تحديث المعرفات من النص
    const newGroupIds = groupIdsText
      .split("\n")
      .map((line) => extractFacebookId(line.trim()))
      .filter(Boolean)

    const newPageIds = pageIdsText
      .split("\n")
      .map((line) => extractFacebookId(line.trim()))
      .filter(Boolean)

    setGroupIds(newGroupIds)
    setPageIds(newPageIds)

    // حفظ الإعدادات
    await onSaveSettings()
  }

  const handleTestConnection = async () => {
    setTestingConnection(true)
    await onTestConnection()
    setTestingConnection(false)
  }

  return (
    <div className="space-y-6">
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

      {/* Connection Status */}
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${apiConnectionTested ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="font-medium">{text.connectionStatus}</span>
              <Badge variant={apiConnectionTested ? "default" : "destructive"}>
                {apiConnectionTested ? text.connected : text.notConnected}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleTestConnection}
                variant="outline"
                size="sm"
                disabled={!accessToken.trim() || testingConnection}
              >
                {testingConnection ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <TestTube className="w-4 h-4 mr-2" />
                )}
                {testingConnection ? text.testing : text.testConnection}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setActiveSettingsTab("guide")}>
                <HelpCircle className="w-4 h-4 mr-2" />
                {text.needHelp}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs value={activeSettingsTab} onValueChange={setActiveSettingsTab}>
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            {text.facebookSettings}
          </TabsTrigger>
          <TabsTrigger value="app" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            {text.appSettings}
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            {text.tokenGuide}
          </TabsTrigger>
        </TabsList>

        {/* Facebook Settings Tab */}
        <TabsContent value="facebook" className="space-y-6">
          <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                {text.facebookSettings}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Access Token */}
              <div className="space-y-2">
                <Label htmlFor="accessToken">{text.accessToken}</Label>
                <Input
                  id="accessToken"
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder={text.enterAccessToken}
                />
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">{text.accessTokenDesc}</p>
                  <p className="text-xs text-blue-600">{text.accessTokenHelp}</p>
                  <Button variant="outline" size="sm" onClick={() => setActiveSettingsTab("guide")}>
                    <HelpCircle className="w-3 h-3 mr-1" />
                    {text.checkGuide}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Group IDs */}
              <div className="space-y-2">
                <Label htmlFor="groupIds">{text.groupIds}</Label>
                <Textarea
                  id="groupIds"
                  value={groupIdsText}
                  onChange={(e) => setGroupIdsText(e.target.value)}
                  placeholder={text.enterGroupUrls}
                  rows={4}
                />
                <p className="text-xs text-gray-500">{text.groupIdsDesc}</p>
                <p className="text-xs text-blue-600">✅ {text.urlSupport}</p>
                {groupIds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {groupIds.map((id, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {id}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Page IDs */}
              <div className="space-y-2">
                <Label htmlFor="pageIds">{text.pageIds}</Label>
                <Textarea
                  id="pageIds"
                  value={pageIdsText}
                  onChange={(e) => setPageIdsText(e.target.value)}
                  placeholder={text.enterPageUrls}
                  rows={4}
                />
                <p className="text-xs text-gray-500">{text.pageIdsDesc}</p>
                <p className="text-xs text-blue-600">✅ {text.urlSupport}</p>
                {pageIds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {pageIds.map((id, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {id}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Phone File URL */}
              <div className="space-y-2">
                <Label htmlFor="phoneFileUrl">{text.phoneFileUrl}</Label>
                <Input
                  id="phoneFileUrl"
                  type="url"
                  value={phoneFileUrl}
                  onChange={(e) => setPhoneFileUrl(e.target.value)}
                  placeholder={text.enterPhoneFileUrl}
                />
                <p className="text-xs text-gray-500">{text.phoneFileUrlDesc}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleSave} disabled={savingSettings} className="flex-1">
                  {savingSettings ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {savingSettings ? text.saving : text.saveSettings}
                </Button>
                <Button onClick={onLoadSettings} variant="outline" disabled={loadingSettings}>
                  {loadingSettings ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  {loadingSettings ? text.loading : text.loadSettings}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Warning for API Connection */}
          {!apiConnectionTested && accessToken && (
            <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
              <Info className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                {text.connectionRequired}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* App Settings Tab */}
        <TabsContent value="app" className="space-y-6">
          <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {text.appSettings}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto Reload */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{text.autoReload}</Label>
                  <p className="text-xs text-gray-500">{text.autoReloadDesc}</p>
                </div>
                <Switch checked={autoReload} onCheckedChange={setAutoReload} />
              </div>

              <Separator />

              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    {text.darkMode}
                  </Label>
                  <p className="text-xs text-gray-500">{text.darkModeDesc}</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <Separator />

              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{text.autoSave}</Label>
                  <p className="text-xs text-gray-500">{text.autoSaveDesc}</p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <Separator />

              {/* Language */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {text.language}
                  </Label>
                  <p className="text-xs text-gray-500">{text.languageDesc}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={language === "ar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("ar")}
                  >
                    {text.arabic}
                  </Button>
                  <Button
                    variant={language === "en" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("en")}
                  >
                    {text.english}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Token Guide Tab */}
        <TabsContent value="guide">
          <TokenGuide darkMode={darkMode} language={language} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
