"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, LogIn, UserPlus, Loader2, Facebook, Shield } from "lucide-react"
import { firebaseService } from "@/lib/firebase-service"

interface LoginFormProps {
  onLogin: (user: any) => void
  darkMode: boolean
  language: "ar" | "en"
}

export function LoginForm({ onLogin, darkMode, language }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("login")

  const t = {
    ar: {
      title: "FB Tracker Pro",
      subtitle: "نظام مراقبة وتحليل شامل لفيسبوك",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب جديد",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      passwordPlaceholder: "أدخل كلمة المرور",
      loginButton: "دخول",
      signupButton: "إنشاء حساب",
      showPassword: "إظهار كلمة المرور",
      hidePassword: "إخفاء كلمة المرور",
      loggingIn: "جاري تسجيل الدخول...",
      signingUp: "جاري إنشاء الحساب...",
      features: "الميزات الرئيسية",
      feature1: "مراقبة المنشورات والتعليقات",
      feature2: "البحث في قاعدة بيانات الأرقام",
      feature3: "تحليلات متقدمة ورسوم بيانية",
      feature4: "حفظ آمن في السحابة",
      feature5: "واجهات متجاوبة لجميع الأجهزة",
      feature6: "تصدير التقارير والبيانات",
      security: "أمان البيانات",
      securityDesc: "جميع بياناتك محمية ومشفرة في Firebase",
    },
    en: {
      title: "FB Tracker Pro",
      subtitle: "Comprehensive Facebook monitoring and analysis system",
      login: "Login",
      signup: "Sign Up",
      email: "Email",
      password: "Password",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      loginButton: "Login",
      signupButton: "Sign Up",
      showPassword: "Show password",
      hidePassword: "Hide password",
      loggingIn: "Logging in...",
      signingUp: "Signing up...",
      features: "Key Features",
      feature1: "Monitor posts and comments",
      feature2: "Search phone number database",
      feature3: "Advanced analytics and charts",
      feature4: "Secure cloud storage",
      feature5: "Responsive design for all devices",
      feature6: "Export reports and data",
      security: "Data Security",
      securityDesc: "All your data is protected and encrypted in Firebase",
    },
  }

  const text = t[language]

  const handleSubmit = async (isSignUp: boolean) => {
    if (!email || !password) {
      setError("يرجى ملء جميع الحقول")
      return
    }

    setLoading(true)
    setError("")

    try {
      const result = isSignUp
        ? await firebaseService.signUp(email, password)
        : await firebaseService.signIn(email, password)

      if (result.success && result.user) {
        onLogin(result.user)
      } else {
        setError(result.error || "حدث خطأ غير متوقع")
      }
    } catch (error: any) {
      setError(error.message || "حدث خطأ في الاتصال")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Features */}
        <div className="space-y-8">
          <div className="text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-end gap-3 mb-4">
              <Facebook className="w-12 h-12 text-blue-600" />
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {text.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{text.subtitle}</p>
              </div>
            </div>
          </div>

          <Card className={`${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/70"} backdrop-blur-sm`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                {text.features}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[text.feature1, text.feature2, text.feature3, text.feature4, text.feature5, text.feature6].map(
                  (feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ),
                )}
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-300">{text.security}</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-400">{text.securityDesc}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Login Form */}
        <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm shadow-2xl`}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{text.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  {text.login}
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  {text.signup}
                </TabsTrigger>
              </TabsList>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">{text.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={text.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="password">{text.password}</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={text.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="sr-only">{showPassword ? text.hidePassword : text.showPassword}</span>
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <TabsContent value="login" className="mt-6">
                  <Button
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {text.loggingIn}
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        {text.loginButton}
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="mt-6">
                  <Button
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {text.signingUp}
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        {text.signupButton}
                      </>
                    )}
                  </Button>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
