"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Key, CheckCircle, AlertTriangle, Info, Copy, Eye, EyeOff, Shield } from "lucide-react"
import { useState } from "react"

interface TokenGuideProps {
  darkMode: boolean
  language: "ar" | "en"
}

export function TokenGuide({ darkMode, language }: TokenGuideProps) {
  const [showToken, setShowToken] = useState(false)
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const t = {
    ar: {
      title: "دليل الحصول على Access Token",
      subtitle: "اتبع هذه الخطوات للحصول على رمز الوصول من Facebook",
      step1: "إنشاء تطبيق Facebook",
      step1Desc: "اذهب إلى Facebook Developer Console وأنشئ تطبيق جديد",
      step2: "إعداد الصلاحيات",
      step2Desc: "أضف الصلاحيات المطلوبة لقراءة المنشورات",
      step3: "الحصول على Token",
      step3Desc: "احصل على Access Token من Graph API Explorer",
      step4: "اختبار Token",
      step4Desc: "تأكد من صحة Token وأنه يعمل",
      requiredPermissions: "الصلاحيات المطلوبة",
      openDeveloperConsole: "فتح Developer Console",
      openGraphExplorer: "فتح Graph API Explorer",
      testToken: "اختبار Token",
      tokenExample: "مثال على Token",
      securityNote: "ملاحظة أمنية",
      securityDesc: "لا تشارك Access Token مع أي شخص آخر",
      troubleshooting: "حل المشاكل الشائعة",
      issue1: "خطأ في الصلاحيات",
      issue1Solution: "تأكد من إضافة جميع الصلاحيات المطلوبة",
      issue2: "Token منتهي الصلاحية",
      issue2Solution: "احصل على Token جديد من Graph API Explorer",
      issue3: "خطأ في معرف الجروب",
      issue3Solution: "تأكد من أن معرف الجروب صحيح وأنك عضو فيه",
      issue4: "لا يمكن الوصول للمنشورات",
      issue4Solution: "الجروب قد يكون خاص أو يتطلب صلاحيات خاصة",
      copyUrl: "نسخ الرابط",
      copied: "تم النسخ!",
      importantNotes: "ملاحظات مهمة",
      note1: "بعض الجروبات الخاصة لا تسمح بقراءة المنشورات",
      note2: "يجب أن تكون عضو في الجروب لقراءة منشوراته",
      note3: "صلاحيات Facebook تتغير باستمرار",
      note4: "استخدم أحدث إصدار من Graph API",
      groupAccess: "الوصول للجروبات",
      groupAccessDesc: "معظم الجروبات تتطلب عضوية للوصول للمنشورات",
    },
    en: {
      title: "Access Token Guide",
      subtitle: "Follow these steps to get an access token from Facebook",
      step1: "Create Facebook App",
      step1Desc: "Go to Facebook Developer Console and create a new app",
      step2: "Setup Permissions",
      step2Desc: "Add required permissions to read posts",
      step3: "Get Token",
      step3Desc: "Get Access Token from Graph API Explorer",
      step4: "Test Token",
      step4Desc: "Verify that the token is valid and working",
      requiredPermissions: "Required Permissions",
      openDeveloperConsole: "Open Developer Console",
      openGraphExplorer: "Open Graph API Explorer",
      testToken: "Test Token",
      tokenExample: "Token Example",
      securityNote: "Security Note",
      securityDesc: "Never share your Access Token with anyone",
      troubleshooting: "Common Issues",
      issue1: "Permission Error",
      issue1Solution: "Make sure to add all required permissions",
      issue2: "Token Expired",
      issue2Solution: "Get a new token from Graph API Explorer",
      issue3: "Invalid Group ID",
      issue3Solution: "Make sure the group ID is correct and you're a member",
      issue4: "Cannot Access Posts",
      issue4Solution: "Group may be private or require special permissions",
      copyUrl: "Copy URL",
      copied: "Copied!",
      importantNotes: "Important Notes",
      note1: "Some private groups don't allow reading posts",
      note2: "You must be a member of the group to read its posts",
      note3: "Facebook permissions change frequently",
      note4: "Use the latest version of Graph API",
      groupAccess: "Group Access",
      groupAccessDesc: "Most groups require membership to access posts",
    },
  }

  const text = t[language]

  const copyToClipboard = async (textToCopy: string, stepNumber: number) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopiedStep(stepNumber)
      setTimeout(() => setCopiedStep(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const steps = [
    {
      title: text.step1,
      description: text.step1Desc,
      url: "https://developers.facebook.com/apps/",
      action: text.openDeveloperConsole,
    },
    {
      title: text.step2,
      description: text.step2Desc,
      permissions: [
        "pages_read_engagement",
        "pages_show_list",
        "groups_access_member_info",
        "public_profile",
        "user_posts",
      ],
    },
    {
      title: text.step3,
      description: text.step3Desc,
      url: "https://developers.facebook.com/tools/explorer/",
      action: text.openGraphExplorer,
    },
    {
      title: text.step4,
      description: text.step4Desc,
      action: text.testToken,
    },
  ]

  return (
    <div className="space-y-6">
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            {text.title}
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">{text.subtitle}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{step.description}</p>

                  {step.permissions && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">{text.requiredPermissions}:</p>
                      <div className="flex flex-wrap gap-2">
                        {step.permissions.map((permission, permIndex) => (
                          <Badge key={permIndex} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.url && (
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => window.open(step.url, "_blank")}>
                        <ExternalLink className="w-3 h-3 mr-1" />
                        {step.action}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(step.url!, index)}>
                        {copiedStep === index ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                            {text.copied}
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 mr-1" />
                            {text.copyUrl}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="border-l-2 border-gray-200 dark:border-gray-700 ml-4 h-4"></div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-900/20">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>{text.groupAccess}:</strong> {text.groupAccessDesc}
        </AlertDescription>
      </Alert>

      {/* Token Example */}
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            {text.tokenExample}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-sm flex-1 font-mono">
                {showToken
                  ? "EAABwzLixnjYBO7ZCvno5ZCuZBa8ZCZCQwE1ZBmZBZCQwE1ZBmZBZCQwE1ZBm..."
                  : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
              </code>
              <Button variant="outline" size="sm" onClick={() => setShowToken(!showToken)}>
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">Token يبدأ عادة بـ EAA ويكون طويل جداً (حوالي 200+ حرف)</p>
          </div>
        </CardContent>
      </Card>

      {/* Security Warning */}
      <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          <strong>{text.securityNote}:</strong> {text.securityDesc}
        </AlertDescription>
      </Alert>

      {/* Troubleshooting */}
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            {text.troubleshooting}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-red-600">{text.issue1}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{text.issue1Solution}</p>
            </div>
            <div>
              <h4 className="font-medium text-red-600">{text.issue2}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{text.issue2Solution}</p>
            </div>
            <div>
              <h4 className="font-medium text-red-600">{text.issue3}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{text.issue3Solution}</p>
            </div>
            <div>
              <h4 className="font-medium text-red-600">{text.issue4}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{text.issue4Solution}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            {text.importantNotes}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>{text.note1}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>{text.note2}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>{text.note3}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>{text.note4}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
