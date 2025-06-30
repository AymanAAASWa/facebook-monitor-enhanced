"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Link,
  Database,
  FileText,
  CheckCircle,
  Loader2,
  Phone,
  Users,
  HardDrive,
  AlertCircle,
  ExternalLink,
  Copy,
  Info,
} from "lucide-react"
import { formatFileSize } from "@/lib/utils"
import type { SavedPhone, FileStatus } from "@/types"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PhoneSearchTabsProps {
  phoneFileUrl: string
  setPhoneFileUrl: (url: string) => void
  fileStatus: FileStatus
  uploadingToFirebase: boolean
  processingLargeFile: boolean
  savedPhones: SavedPhone[]
  onTestConnection: () => void
  onUploadToFirebase: () => void
  onLargeFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  onLocalFileSelect?: (file: File) => void // Add this new prop
  phoneFileRef: React.RefObject<HTMLInputElement> | { current: null }
  darkMode: boolean
  language: "ar" | "en"
  setFileStatus: (fileStatus: FileStatus) => void
}

export function PhoneSearchTabs({
  phoneFileUrl,
  setPhoneFileUrl,
  fileStatus,
  uploadingToFirebase,
  processingLargeFile,
  savedPhones,
  onTestConnection,
  onUploadToFirebase,
  onLargeFileSelect,
  onLocalFileSelect, // Add this
  phoneFileRef,
  darkMode,
  language,
  setFileStatus,
}: PhoneSearchTabsProps) {
  const t = {
    ar: {
      phoneSearchMethods: "طرق البحث عن الأرقام",
      method1: "الطريقة الأولى: رابط مباشر للملف",
      method2: "الطريقة الثانية: رفع إلى قاعدة البيانات",
      method3: "الطريقة الثالثة: ملف محلي صغير (حتى 50 ميجا)",
      phoneFileUrl: "رابط ملف الأرقام",
      enterPhoneFileUrl: "أدخل رابط ملف الأرقام (JSON)",
      phoneFileUrlDesc: "رابط مباشر لملف JSON يحتوي على الأرقام",
      googleDriveSupport: "يدعم روابط جوجل درايف",
      testConnection: "اختبار الاتصال",
      uploadToFirebase: "رفع إلى قاعدة البيانات",
      uploadingToFirebase: "جاري الرفع...",
      selectPhoneFile: "اختيار ملف الأرقام",
      phoneFileDesc: "اختر ملف JSON صغير يحتوي على أرقام التليفونات (حتى 50 ميجا فقط)",
      smallFileSupport: "يدعم الملفات الصغيرة فقط (حتى 50 ميجا)",
      processingFile: "جاري معالجة الملف...",
      fileSize: "حجم الملف",
      recordsCount: "عدد السجلات",
      fileIndexed: "تم تحميل الملف بنجاح",
      savedPhones: "الأرقام المحفوظة",
      noSavedPhones: "لا توجد أرقام محفوظة",
      phone: "الرقم",
      userName: "اسم المستخدم",
      source: "المصدر",
      discoveredAt: "تاريخ الاكتشاف",
      googleDriveGuide: "كيفية استخدام Google Drive",
      step1: "الخطوة 1: رفع الملف إلى Google Drive",
      step2: "الخطوة 2: مشاركة الملف",
      step3: "الخطوة 3: نسخ الرابط",
      step4: "الخطوة 4: لصق الرابط هنا",
      uploadToDrive: "ارفع ملف JSON إلى Google Drive",
      rightClickShare: "اضغط بالزر الأيمن على الملف واختر 'مشاركة'",
      changePermissions: "غير الإذن إلى 'أي شخص لديه الرابط'",
      copyLink: "انسخ الرابط",
      pasteHere: "الصق الرابط في الحقل أعلاه",
      exampleUrl: "مثال على الرابط:",
      warningTitle: "تحذير مهم",
      warningDesc: "الملفات المحلية لا تعمل في المتصفح لأسباب أمنية. استخدم Google Drive أو رفع إلى قاعدة البيانات.",
      recommendedMethod: "الطريقة المُوصى بها",
      whyGoogleDrive: "لماذا Google Drive؟",
      reason1: "✅ يعمل مع الملفات الكبيرة (حتى عدة جيجا)",
      reason2: "✅ سريع في التحميل والبحث",
      reason3: "✅ آمن ومحمي",
      reason4: "✅ يمكن الوصول إليه من أي مكان",
      fileTooLarge: "الملف كبير جداً! الحد الأقصى 50 ميجا للملفات المحلية",
      useGoogleDrive: "استخدم Google Drive للملفات الكبيرة",
    },
    en: {
      phoneSearchMethods: "Phone Search Methods",
      method1: "Method 1: Direct File URL",
      method2: "Method 2: Upload to Database",
      method3: "Method 3: Small Local File (up to 50MB)",
      phoneFileUrl: "Phone File URL",
      enterPhoneFileUrl: "Enter phone file URL (JSON)",
      phoneFileUrlDesc: "Direct link to JSON file containing phone numbers",
      googleDriveSupport: "Supports Google Drive links",
      testConnection: "Test Connection",
      uploadToFirebase: "Upload to Database",
      uploadingToFirebase: "Uploading...",
      selectPhoneFile: "Select Phone File",
      phoneFileDesc: "Select a small JSON file containing phone numbers (up to 50MB only)",
      smallFileSupport: "Supports small files only (up to 50MB)",
      processingFile: "Processing file...",
      fileSize: "File Size",
      recordsCount: "Records Count",
      fileIndexed: "File loaded successfully",
      savedPhones: "Saved Phones",
      noSavedPhones: "No saved phones",
      phone: "Phone",
      userName: "User Name",
      source: "Source",
      discoveredAt: "Discovered At",
      googleDriveGuide: "How to use Google Drive",
      step1: "Step 1: Upload file to Google Drive",
      step2: "Step 2: Share the file",
      step3: "Step 3: Copy the link",
      step4: "Step 4: Paste the link here",
      uploadToDrive: "Upload JSON file to Google Drive",
      rightClickShare: "Right-click on the file and select 'Share'",
      changePermissions: "Change permission to 'Anyone with the link'",
      copyLink: "Copy the link",
      pasteHere: "Paste the link in the field above",
      exampleUrl: "Example URL:",
      warningTitle: "Important Warning",
      warningDesc: "Local files don't work in browsers for security reasons. Use Google Drive or upload to database.",
      recommendedMethod: "Recommended Method",
      whyGoogleDrive: "Why Google Drive?",
      reason1: "✅ Works with large files (up to several GB)",
      reason2: "✅ Fast loading and searching",
      reason3: "✅ Safe and secure",
      reason4: "✅ Accessible from anywhere",
      fileTooLarge: "File too large! Maximum 50MB for local files",
      useGoogleDrive: "Use Google Drive for large files",
    },
  }

  const text = t[language]

  const handleLocalFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (50MB limit for local files)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      alert(`${text.fileTooLarge}\n${text.useGoogleDrive}`)
      event.target.value = "" // Clear the input
      return
    }

    // Call the parent callback if provided
    if (onLocalFileSelect) {
      onLocalFileSelect(file)
    } else {
      // Fallback to the existing onLargeFileSelect
      onLargeFileSelect(event)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            {text.phoneSearchMethods}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                {text.method1}
                <Badge variant="secondary" className="ml-1 bg-green-100 text-green-800">
                  مُوصى
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                {text.method2}
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                {text.method3}
              </TabsTrigger>
            </TabsList>

            {/* Method 1: Direct URL (Google Drive) */}
            <TabsContent value="url" className="space-y-4">
              <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>{text.recommendedMethod}</strong> - {text.whyGoogleDrive}
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="phoneFileUrl">{text.phoneFileUrl}</Label>
                  <Input
                    id="phoneFileUrl"
                    type="url"
                    value={phoneFileUrl}
                    onChange={(e) => setPhoneFileUrl(e.target.value)}
                    placeholder={text.enterPhoneFileUrl}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">{text.phoneFileUrlDesc}</p>
                  <p className="text-xs text-blue-600 mt-1">✅ {text.googleDriveSupport}</p>
                </div>
                <Button
                  onClick={onTestConnection}
                  variant="outline"
                  disabled={!phoneFileUrl.trim()}
                  className="w-full bg-transparent"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {text.testConnection}
                </Button>
              </div>

              {/* Google Drive Guide */}
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    {text.googleDriveGuide}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium">{text.step1}</p>
                        <p className="text-sm text-gray-600">{text.uploadToDrive}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium">{text.step2}</p>
                        <p className="text-sm text-gray-600">{text.rightClickShare}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium">{text.step3}</p>
                        <p className="text-sm text-gray-600">{text.changePermissions}</p>
                        <p className="text-sm text-gray-600">{text.copyLink}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">
                        4
                      </div>
                      <div>
                        <p className="font-medium">{text.step4}</p>
                        <p className="text-sm text-gray-600">{text.pasteHere}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium mb-2">{text.exampleUrl}</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded flex-1 overflow-hidden">
                        https://drive.google.com/file/d/1ABC...XYZ/view?usp=sharing
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard("https://drive.google.com/file/d/1ABC...XYZ/view?usp=sharing")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium text-green-700 dark:text-green-300">{text.whyGoogleDrive}</p>
                    <div className="text-sm space-y-1">
                      <p>{text.reason1}</p>
                      <p>{text.reason2}</p>
                      <p>{text.reason3}</p>
                      <p>{text.reason4}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Method 2: Upload to Database */}
            <TabsContent value="database" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-4">رفع ملف JSON إلى قاعدة البيانات للبحث السريع</p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        // Handle file upload to Firebase
                        console.log("File selected for Firebase upload:", file.name)
                      }
                    }}
                    className="hidden"
                    id="firebase-upload"
                  />
                  <Label htmlFor="firebase-upload" className="cursor-pointer">
                    <Button variant="outline" className="w-full bg-transparent" disabled={uploadingToFirebase}>
                      {uploadingToFirebase ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {text.uploadingToFirebase}
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          {text.uploadToFirebase}
                        </>
                      )}
                    </Button>
                  </Label>
                </div>
              </div>
            </TabsContent>

            {/* Method 3: Small Local File */}
            <TabsContent value="file" className="space-y-4">
              <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-900/20">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  <strong>{text.warningTitle}:</strong> {text.warningDesc}
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <HardDrive className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-4">{text.phoneFileDesc}</p>
                  <p className="text-xs text-orange-600 mb-4">⚠️ {text.smallFileSupport}</p>

                  <input
                    type="file"
                    accept=".json"
                    onChange={handleLocalFileSelect}
                    className="hidden"
                    id="local-file-upload"
                    ref={phoneFileRef as React.RefObject<HTMLInputElement>}
                  />
                  <Label htmlFor="local-file-upload" className="cursor-pointer">
                    <Button variant="outline" className="w-full bg-transparent" disabled={processingLargeFile}>
                      {processingLargeFile ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {text.processingFile}
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          {text.selectPhoneFile}
                        </>
                      )}
                    </Button>
                  </Label>
                </div>

                {/* File Status */}
                {fileStatus.loaded && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-200">{text.fileIndexed}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">{text.fileSize}:</span>
                        <span className="ml-2 font-medium">{formatFileSize(fileStatus.fileSize)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">{text.recordsCount}:</span>
                        <span className="ml-2 font-medium">{fileStatus.recordsCount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ExternalLink className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">للملفات الكبيرة (أكثر من 50 ميجا)</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      استخدم الطريقة الأولى (Google Drive) للملفات الكبيرة - أسرع وأكثر أماناً
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Switch to Google Drive tab
                        const urlTab = document.querySelector('[value="url"]') as HTMLElement
                        urlTab?.click()
                      }}
                      className="w-full"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      استخدم Google Drive بدلاً من ذلك
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Saved Phones */}
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {text.savedPhones}
            <Badge variant="secondary">{savedPhones.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {savedPhones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Phone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>{text.noSavedPhones}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {savedPhones.map((phone, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{phone.userName}</span>
                      <Badge variant="outline" className="text-xs">
                        {phone.source}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-mono">{phone.phone}</span>
                      <span className="mx-2">•</span>
                      <span>{phone.discoveredAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(phone.phone)}
                    className="hover:bg-blue-100"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
