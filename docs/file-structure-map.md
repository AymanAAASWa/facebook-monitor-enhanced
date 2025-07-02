
# خريطة الملفات التفصيلية مع الأكواد - مراقب فيسبوك المتقدم

## 📁 الهيكل العام للمشروع مع تفاصيل الأكواد

```
facebook-monitor-enhanced/
├── 📱 app/                          # تطبيق Next.js الرئيسي
├── 🧩 components/                   # مكونات React القابلة لإعادة الاستخدام
├── 📚 lib/                          # مكتبات ووظائف مساعدة
├── 🎨 styles/                       # ملفات التنسيق
├── 📊 data/                         # بيانات تجريبية وثابتة
├── 📖 docs/                         # التوثيق والدلائل
├── 🎯 types/                        # تعريفات الأنواع TypeScript
├── 🪝 hooks/                        # React Hooks المخصصة
└── ⚙️ config files                  # ملفات الإعداد
```

## 📱 مجلد التطبيق (`app/`) - التفاصيل التقنية

### 🏠 الصفحات الأساسية

#### `app/page.tsx` - الصفحة الرئيسية
```typescript
// العمليات الأساسية:
// 1. عرض الإحصائيات العامة
// 2. لوحة تحكم تفاعلية
// 3. إدارة حالة التطبيق العامة

export default function HomePage() {
  // إدارة حالة البيانات
  const [stats, setStats] = useState<Stats>()
  const [loading, setLoading] = useState(true)
  
  // جلب البيانات من Firebase
  useEffect(() => {
    fetchDashboardStats()
  }, [])
  
  // وظائف التحديث التلقائي
  const refreshData = useCallback(() => {
    // تحديث الإحصائيات كل 30 ثانية
  }, [])
  
  return (
    <div className="container mx-auto p-4">
      {/* عرض مكونات لوحة التحكم */}
      <FacebookMonitor />
      <AnalyticsDashboard />
      <EnhancedDataViewer />
    </div>
  )
}
```

**التبعيات المستخدمة:**
- `components/facebook-monitor`
- `components/analytics-dashboard`
- `lib/firebase-service`
- `lib/app-context`

#### `app/layout.tsx` - تخطيط التطبيق العام
```typescript
// العمليات:
// 1. إعداد السياق العام للتطبيق
// 2. إدارة الثيم (فاتح/داكن)
// 3. إعداد الـ providers
// 4. تخطيط الصفحات العام

import { AppContextProvider } from '@/lib/app-context'
import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <ThemeProvider>
          <AppContextProvider>
            <div className="min-h-screen bg-background">
              {/* شريط التنقل العلوي */}
              <header className="border-b">
                <nav className="container mx-auto">
                  {/* قائمة التنقل الرئيسية */}
                </nav>
              </header>
              
              {/* المحتوى الرئيسي */}
              <main className="container mx-auto p-4">
                {children}
              </main>
              
              {/* التذييل */}
              <footer className="border-t mt-auto">
                {/* معلومات التطبيق */}
              </footer>
            </div>
          </AppContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

#### `app/globals.css` - التنسيقات العامة
```css
/* متغيرات الألوان */
:root {
  --primary: 222.2 84% 4.9%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

/* تنسيقات خاصة بالتطبيق */
.arabic-text {
  font-family: 'Cairo', 'Segoe UI', sans-serif;
  direction: rtl;
  text-align: right;
}

.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

/* تنسيقات الجداول */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: right;
  border-bottom: 1px solid var(--border);
}

/* تنسيقات متجاوبة */
@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
  }
  
  .responsive-grid {
    grid-template-columns: 1fr;
  }
}
```

### 🔗 API Routes - الواجهات البرمجية

#### `app/api/facebook/posts/route.ts` - API جلب المنشورات
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { FacebookService } from '@/lib/facebook-service'
import { FirebaseService } from '@/lib/firebase-service'

// GET: جلب المنشورات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source') // صفحة أو مجموعة
    const limit = parseInt(searchParams.get('limit') || '25')
    const after = searchParams.get('after') // للترقيم
    
    // جلب من Facebook API
    const facebookService = new FacebookService()
    const posts = await facebookService.getPosts({
      source,
      limit,
      after
    })
    
    // حفظ في Firebase
    const firebaseService = new FirebaseService()
    await firebaseService.savePosts(posts)
    
    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        hasNext: posts.length === limit,
        nextCursor: posts[posts.length - 1]?.id
      }
    })
  } catch (error) {
    console.error('خطأ في جلب المنشورات:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المنشورات' },
      { status: 500 }
    )
  }
}

// POST: إنشاء منشور جديد (للاختبار)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, images, targetId } = body
    
    const facebookService = new FacebookService()
    const result = await facebookService.createPost({
      content,
      images,
      targetId
    })
    
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

#### `app/api/facebook/comments/route.ts` - API إدارة التعليقات
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { FacebookCommentsService } from '@/lib/facebook-comments-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const userId = searchParams.get('userId')
    
    const commentsService = new FacebookCommentsService()
    
    if (postId) {
      // جلب تعليقات منشور محدد
      const comments = await commentsService.getPostComments(postId)
      return NextResponse.json({ success: true, data: comments })
    }
    
    if (userId) {
      // جلب تعليقات مستخدم محدد
      const comments = await commentsService.getUserComments(userId)
      return NextResponse.json({ success: true, data: comments })
    }
    
    // جلب جميع التعليقات
    const allComments = await commentsService.getAllComments()
    return NextResponse.json({ success: true, data: allComments })
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, content, parentId } = body
    
    const commentsService = new FacebookCommentsService()
    const result = await commentsService.addComment({
      postId,
      content,
      parentId // للردود
    })
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

#### `app/api/facebook/validate/route.ts` - API التحقق من صحة Token
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()
    
    // التحقق من Facebook API
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,permissions`
    )
    
    if (!response.ok) {
      throw new Error('رمز الوصول غير صحيح')
    }
    
    const userData = await response.json()
    
    // التحقق من الصلاحيات المطلوبة
    const requiredPermissions = [
      'pages_read_engagement',
      'pages_show_list',
      'groups_access_member_info',
      'publish_to_groups'
    ]
    
    const userPermissions = userData.permissions?.data || []
    const missingPermissions = requiredPermissions.filter(
      perm => !userPermissions.find(up => up.permission === perm && up.status === 'granted')
    )
    
    return NextResponse.json({
      success: true,
      data: {
        user: userData,
        permissions: userPermissions,
        missingPermissions,
        isValid: missingPermissions.length === 0
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
```

## 🧩 مجلد المكونات (`components/`) - التفاصيل التقنية

### 🔐 مكونات التوثيق

#### `components/auth/facebook-login-form.tsx`
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FacebookOAuthService } from '@/lib/facebook-oauth-service'

interface FacebookLoginFormProps {
  onSuccess: (token: string) => void
  onError: (error: string) => void
}

export function FacebookLoginForm({ onSuccess, onError }: FacebookLoginFormProps) {
  const [accessToken, setAccessToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  
  // التحقق من صحة الرمز
  const validateToken = async () => {
    if (!accessToken.trim()) {
      onError('يرجى إدخال رمز الوصول')
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/facebook/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setValidationResult(result.data)
        if (result.data.isValid) {
          onSuccess(accessToken)
        } else {
          onError(`صلاحيات مفقودة: ${result.data.missingPermissions.join(', ')}`)
        }
      } else {
        onError(result.error)
      }
    } catch (error) {
      onError('خطأ في التحقق من الرمز')
    } finally {
      setLoading(false)
    }
  }
  
  // تسجيل الدخول عبر OAuth
  const handleOAuthLogin = async () => {
    setLoading(true)
    try {
      const oauthService = new FacebookOAuthService()
      const token = await oauthService.authenticate()
      setAccessToken(token)
      await validateToken()
    } catch (error) {
      onError('فشل في تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">تسجيل دخول Facebook</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* إدخال الرمز يدوياً */}
        <div className="space-y-2">
          <label className="text-sm font-medium">رمز الوصول</label>
          <Input
            type="password"
            placeholder="أدخل رمز الوصول..."
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            className="direction-ltr"
          />
        </div>
        
        {/* أزرار التحكم */}
        <div className="space-y-2">
          <Button 
            onClick={validateToken} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'جاري التحقق...' : 'تحقق من الرمز'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleOAuthLogin}
            disabled={loading}
            className="w-full"
          >
            تسجيل دخول تلقائي
          </Button>
        </div>
        
        {/* نتائج التحقق */}
        {validationResult && (
          <div className="mt-4 p-3 border rounded">
            <h4 className="font-medium">معلومات الحساب:</h4>
            <p>الاسم: {validationResult.user.name}</p>
            <p>المعرف: {validationResult.user.id}</p>
            
            {validationResult.missingPermissions.length > 0 && (
              <div className="mt-2">
                <p className="text-red-600">صلاحيات مفقودة:</p>
                <ul className="text-sm text-red-500">
                  {validationResult.missingPermissions.map((perm: string) => (
                    <li key={perm}>• {perm}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

### 📊 مكونات البيانات والتحليلات

#### `components/enhanced-posts-list.tsx` - قائمة المنشورات المحسنة
```typescript
'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Calendar, 
  User, 
  MessageSquare, 
  Heart, 
  Share2, 
  Eye,
  FileText,
  BarChart3,
  Phone,
  ExternalLink,
  Image as ImageIcon,
  Video,
  Link,
  ThumbsUp,
  ThumbsDown,
  Smile,
  MapPin
} from 'lucide-react'
import { EnhancedFacebookService } from "@/lib/enhanced-facebook-service"
import { PhoneSearchService } from "@/lib/phone-search-service"
import { UserAnalyticsViewer } from './user-analytics-viewer'

// تعريف الأنواع
interface Post {
  id: string
  content: string
  author: {
    id: string
    name: string
    profilePicture?: string
    phoneNumber?: string
  }
  timestamp: string
  source: {
    type: 'page' | 'group' | 'profile'
    id: string
    name: string
  }
  engagement: {
    likes: number
    comments: number
    shares: number
    reactions: {
      like: number
      love: number
      laugh: number
      angry: number
      sad: number
    }
  }
  media?: {
    type: 'image' | 'video' | 'link'
    url: string
    thumbnail?: string
  }[]
  location?: {
    name: string
    coordinates?: { lat: number, lng: number }
  }
  isSponsored?: boolean
  originalUrl: string
}

interface EnhancedPostsListProps {
  darkMode?: boolean
  language?: "ar" | "en"
}

export function EnhancedPostsList({ darkMode = false, language = "ar" }: EnhancedPostsListProps) {
  // إدارة الحالة
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'timestamp' | 'engagement' | 'author'>('timestamp')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [userAnalytics, setUserAnalytics] = useState<string | null>(null)
  const [phoneSearchResults, setPhoneSearchResults] = useState<any[]>([])
  
  // خدمات البيانات
  const facebookService = useMemo(() => new EnhancedFacebookService(), [])
  const phoneService = useMemo(() => new PhoneSearchService(), [])
  
  // جلب البيانات
  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const fetchedPosts = await facebookService.getEnhancedPosts({
        includeEngagement: true,
        includeMedia: true,
        includeLocation: true,
        limit: 100
      })
      setPosts(fetchedPosts)
    } catch (error) {
      console.error('خطأ في جلب المنشورات:', error)
    } finally {
      setLoading(false)
    }
  }, [facebookService])
  
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])
  
  // البحث والفلترة
  const filteredPosts = useMemo(() => {
    let result = posts
    
    // البحث في النص
    if (searchTerm) {
      result = result.filter(post => 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.source.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // فلترة المصدر
    if (selectedSource !== 'all') {
      result = result.filter(post => post.source.type === selectedSource)
    }
    
    // فلترة النوع
    if (selectedType !== 'all') {
      result = result.filter(post => {
        switch (selectedType) {
          case 'media': return post.media && post.media.length > 0
          case 'text': return !post.media || post.media.length === 0
          case 'sponsored': return post.isSponsored
          case 'location': return post.location
          default: return true
        }
      })
    }
    
    // الترتيب
    result.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'timestamp':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          break
        case 'engagement':
          const aEngagement = a.engagement.likes + a.engagement.comments + a.engagement.shares
          const bEngagement = b.engagement.likes + b.engagement.comments + b.engagement.shares
          comparison = aEngagement - bEngagement
          break
        case 'author':
          comparison = a.author.name.localeCompare(b.author.name)
          break
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })
    
    return result
  }, [posts, searchTerm, selectedSource, selectedType, sortBy, sortOrder])
  
  // البحث عن رقم هاتف المستخدم
  const searchUserPhone = useCallback(async (userId: string, userName: string) => {
    try {
      const results = await phoneService.searchByName(userName)
      setPhoneSearchResults(results)
    } catch (error) {
      console.error('خطأ في البحث عن الرقم:', error)
    }
  }, [phoneService])
  
  // تنسيق الوقت
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'الآن'
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`
    if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`
    return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`
  }
  
  // حساب إجمالي التفاعل
  const getTotalEngagement = (engagement: Post['engagement']) => {
    return engagement.likes + engagement.comments + engagement.shares
  }
  
  return (
    <div className="space-y-6">
      {/* شريط البحث والفلاتر */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* البحث */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في المنشورات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            {/* فلترة المصدر */}
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger>
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="المصدر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المصادر</SelectItem>
                <SelectItem value="page">الصفحات</SelectItem>
                <SelectItem value="group">المجموعات</SelectItem>
                <SelectItem value="profile">الملفات الشخصية</SelectItem>
              </SelectContent>
            </Select>
            
            {/* نوع المنشور */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="نوع المحتوى" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="text">نص فقط</SelectItem>
                <SelectItem value="media">يحتوي على وسائط</SelectItem>
                <SelectItem value="sponsored">منشورات مدفوعة</SelectItem>
                <SelectItem value="location">يحتوي على موقع</SelectItem>
              </SelectContent>
            </Select>
            
            {/* الترتيب */}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy as any}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timestamp">التاريخ</SelectItem>
                  <SelectItem value="engagement">التفاعل</SelectItem>
                  <SelectItem value="author">الكاتب</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredPosts.length}</div>
            <div className="text-sm text-gray-600">إجمالي المنشورات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredPosts.reduce((sum, post) => sum + getTotalEngagement(post.engagement), 0)}
            </div>
            <div className="text-sm text-gray-600">إجمالي التفاعل</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(filteredPosts.map(post => post.author.id)).size}
            </div>
            <div className="text-sm text-gray-600">عدد المؤلفين</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {filteredPosts.filter(post => post.media && post.media.length > 0).length}
            </div>
            <div className="text-sm text-gray-600">منشورات بوسائط</div>
          </CardContent>
        </Card>
      </div>
      
      {/* قائمة المنشورات */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">جاري تحميل المنشورات...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">لا توجد منشورات تطابق معايير البحث</p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* رأس المنشور */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    {/* صورة المؤلف */}
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author.profilePicture} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    {/* معلومات المؤلف */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm truncate">{post.author.name}</h3>
                        
                        {/* أزرار المستخدم - منفصلة ومختلفة */}
                        <div className="flex gap-1">
                          {/* زر عرض المنشورات */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => setSelectedPost(post)}
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                منشورات
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>منشورات {post.author.name}</DialogTitle>
                              </DialogHeader>
                              {selectedPost && (
                                <div className="space-y-4">
                                  {/* عرض منشورات المستخدم */}
                                  <div className="text-sm text-gray-600">
                                    عرض جميع منشورات هذا المستخدم...
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          {/* زر عرض التحليلات */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => setUserAnalytics(post.author.id)}
                              >
                                <BarChart3 className="w-3 h-3 mr-1" />
                                تحليلات
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>تحليلات {post.author.name}</DialogTitle>
                              </DialogHeader>
                              {userAnalytics && (
                                <UserAnalyticsViewer 
                                  userId={userAnalytics}
                                  userName={post.author.name}
                                  darkMode={darkMode}
                                  language={language}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                        
                        {/* رقم الهاتف */}
                        {post.author.phoneNumber && (
                          <Badge variant="outline" className="text-xs">
                            <Phone className="w-3 h-3 mr-1" />
                            {post.author.phoneNumber}
                          </Badge>
                        )}
                        
                        {/* البحث عن رقم */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => searchUserPhone(post.author.id, post.author.name)}
                        >
                          <Search className="w-3 h-3 mr-1" />
                          بحث رقم
                        </Button>
                      </div>
                      
                      {/* معلومات المصدر والوقت */}
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Badge variant="secondary" className="text-xs">
                          {post.source.type === 'page' ? '📄' : post.source.type === 'group' ? '👥' : '👤'}
                          {post.source.name}
                        </Badge>
                        <span>•</span>
                        <span>{formatTimeAgo(post.timestamp)}</span>
                        {post.isSponsored && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">مدفوع</Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* رابط المنشور الأصلي */}
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <a href={post.originalUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
                
                {/* محتوى المنشور */}
                <div className="mb-4">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {post.content.length > 300 ? (
                      <>
                        {post.content.substring(0, 300)}
                        <span className="text-gray-500">... </span>
                        <Button variant="link" className="p-0 h-auto text-xs">
                          عرض المزيد
                        </Button>
                      </>
                    ) : (
                      post.content
                    )}
                  </p>
                </div>
                
                {/* الوسائط */}
                {post.media && post.media.length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {post.media.slice(0, 6).map((media, index) => (
                        <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          {media.type === 'image' ? (
                            <>
                              <img 
                                src={media.thumbnail || media.url} 
                                alt="صورة المنشور"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 left-2">
                                <Badge variant="secondary" className="text-xs">
                                  <ImageIcon className="w-3 h-3 mr-1" />
                                  صورة
                                </Badge>
                              </div>
                            </>
                          ) : media.type === 'video' ? (
                            <>
                              <img 
                                src={media.thumbnail} 
                                alt="مقطع فيديو"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black bg-opacity-50 rounded-full p-2">
                                  <Video className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <div className="absolute top-2 left-2">
                                <Badge variant="secondary" className="text-xs">
                                  <Video className="w-3 h-3 mr-1" />
                                  فيديو
                                </Badge>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <div className="text-center">
                                <Link className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <Badge variant="secondary" className="text-xs">
                                  رابط
                                </Badge>
                              </div>
                            </div>
                          )}
                          
                          {/* عداد الوسائط الإضافية */}
                          {index === 5 && post.media.length > 6 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white font-bold">
                                +{post.media.length - 6}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* الموقع */}
                {post.location && (
                  <div className="mb-4">
                    <Badge variant="outline" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {post.location.name}
                    </Badge>
                  </div>
                )}
                
                <Separator className="my-4" />
                
                {/* إحصائiات التفاعل */}
                <div className="flex items-center justify-between">
                  {/* التفاعلات */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4 text-blue-600" />
                      <span>{post.engagement.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                      <span>{post.engagement.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-4 h-4 text-purple-600" />
                      <span>{post.engagement.shares}</span>
                    </div>
                  </div>
                  
                  {/* التفاعلات التفصيلية */}
                  <div className="flex items-center gap-2">
                    {post.engagement.reactions.love > 0 && (
                      <Badge variant="outline" className="text-xs">
                        ❤️ {post.engagement.reactions.love}
                      </Badge>
                    )}
                    {post.engagement.reactions.laugh > 0 && (
                      <Badge variant="outline" className="text-xs">
                        😆 {post.engagement.reactions.laugh}
                      </Badge>
                    )}
                    {post.engagement.reactions.angry > 0 && (
                      <Badge variant="outline" className="text-xs">
                        😠 {post.engagement.reactions.angry}
                      </Badge>
                    )}
                    {post.engagement.reactions.sad > 0 && (
                      <Badge variant="outline" className="text-xs">
                        😢 {post.engagement.reactions.sad}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* نتائج البحث عن الأرقام */}
      {phoneSearchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>نتائج البحث عن الأرقام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {phoneSearchResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{result.name}</span>
                  <Badge variant="outline">{result.phone}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

## 📚 مجلد المكتبات (`lib/`) - الخدمات التقنية

### 🔗 خدمات Facebook API

#### `lib/enhanced-facebook-service.ts` - خدمة Facebook المحسنة
```typescript
interface FacebookPost {
  id: string
  message?: string
  story?: string
  created_time: string
  from: {
    id: string
    name: string
    picture?: {
      data: {
        url: string
      }
    }
  }
  attachments?: {
    data: Array<{
      type: string
      media?: {
        image?: {
          src: string
        }
      }
      target?: {
        url: string
      }
      title?: string
      description?: string
    }>
  }
  likes?: {
    summary: {
      total_count: number
    }
  }
  comments?: {
    summary: {
      total_count: number
    }
    data?: Array<{
      id: string
      message: string
      created_time: string
      from: {
        id: string
        name: string
      }
    }>
  }
  shares?: {
    count: number
  }
  reactions?: {
    summary: {
      total_count: number
    }
    data?: Array<{
      type: string
      id: string
    }>
  }
  place?: {
    name: string
    location?: {
      latitude: number
      longitude: number
    }
  }
  permalink_url: string
}

export class EnhancedFacebookService {
  private accessToken: string
  private baseUrl = 'https://graph.facebook.com/v18.0'
  
  constructor(accessToken?: string) {
    this.accessToken = accessToken || this.getStoredToken()
  }
  
  private getStoredToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('facebook_access_token') || ''
    }
    return ''
  }
  
  // جلب المنشورات المحسنة مع جميع البيانات
  async getEnhancedPosts(options: {
    sources?: string[]
    includeComments?: boolean
    includeEngagement?: boolean
    includeMedia?: boolean
    includeLocation?: boolean
    limit?: number
    since?: string
    until?: string
  } = {}): Promise<Post[]> {
    const {
      sources = [],
      includeComments = true,
      includeEngagement = true,
      includeMedia = true,
      includeLocation = true,
      limit = 25,
      since,
      until
    } = options
    
    // بناء حقول الاستعلام
    const fields = [
      'id',
      'message',
      'story',
      'created_time',
      'from{id,name,picture}',
      'permalink_url'
    ]
    
    if (includeEngagement) {
      fields.push(
        'likes.summary(true)',
        'comments.summary(true)',
        'shares',
        'reactions.summary(total_count).as(reactions_summary)',
        'reactions.type(LIKE).summary(total_count).as(reactions_like)',
        'reactions.type(LOVE).summary(total_count).as(reactions_love)',
        'reactions.type(HAHA).summary(total_count).as(reactions_laugh)',
        'reactions.type(ANGRY).summary(total_count).as(reactions_angry)',
        'reactions.type(SAD).summary(total_count).as(reactions_sad)'
      )
    }
    
    if (includeComments) {
      fields.push('comments{id,message,created_time,from{id,name},likes.summary(true)}')
    }
    
    if (includeMedia) {
      fields.push('attachments{type,media,target,title,description}')
    }
    
    if (includeLocation) {
      fields.push('place{name,location}')
    }
    
    const allPosts: Post[] = []
    
    // إذا لم يتم تحديد مصادر، استخدم المصادر المحفوظة
    const targetSources = sources.length > 0 ? sources : await this.getSavedSources()
    
    for (const sourceId of targetSources) {
      try {
        const posts = await this.fetchPostsFromSource(sourceId, {
          fields: fields.join(','),
          limit,
          since,
          until
        })
        
        const enhancedPosts = await Promise.all(
          posts.map(post => this.enhancePost(post))
        )
        
        allPosts.push(...enhancedPosts)
      } catch (error) {
        console.error(`خطأ في جلب منشورات المصدر ${sourceId}:`, error)
      }
    }
    
    // ترتيب حسب التاريخ
    return allPosts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }
  
  // جلب منشورات من مصدر واحد
  private async fetchPostsFromSource(
    sourceId: string, 
    params: Record<string, any>
  ): Promise<FacebookPost[]> {
    const queryParams = new URLSearchParams({
      access_token: this.accessToken,
      ...params
    })
    
    const response = await fetch(
      `${this.baseUrl}/${sourceId}/posts?${queryParams}`
    )
    
    if (!response.ok) {
      throw new Error(`خطأ في API: ${response.status}`)
    }
    
    const data = await response.json()
    return data.data || []
  }
  
  // تحسين بيانات المنشور
  private async enhancePost(facebookPost: FacebookPost): Promise<Post> {
    // البحث عن رقم هاتف المؤلف
    const authorPhoneNumber = await this.searchAuthorPhone(
      facebookPost.from.id,
      facebookPost.from.name
    )
    
    // تحديد نوع المصدر
    const sourceType = await this.determineSourceType(facebookPost.from.id)
    
    // تحسين الوسائط
    const enhancedMedia = this.enhanceMedia(facebookPost.attachments?.data || [])
    
    return {
      id: facebookPost.id,
      content: facebookPost.message || facebookPost.story || '',
      author: {
        id: facebookPost.from.id,
        name: facebookPost.from.name,
        profilePicture: facebookPost.from.picture?.data?.url,
        phoneNumber: authorPhoneNumber
      },
      timestamp: facebookPost.created_time,
      source: {
        type: sourceType,
        id: facebookPost.from.id,
        name: facebookPost.from.name
      },
      engagement: {
        likes: facebookPost.likes?.summary?.total_count || 0,
        comments: facebookPost.comments?.summary?.total_count || 0,
        shares: facebookPost.shares?.count || 0,
        reactions: {
          like: this.getReactionCount(facebookPost, 'reactions_like'),
          love: this.getReactionCount(facebookPost, 'reactions_love'),
          laugh: this.getReactionCount(facebookPost, 'reactions_laugh'),
          angry: this.getReactionCount(facebookPost, 'reactions_angry'),
          sad: this.getReactionCount(facebookPost, 'reactions_sad')
        }
      },
      media: enhancedMedia,
      location: facebookPost.place ? {
        name: facebookPost.place.name,
        coordinates: facebookPost.place.location ? {
          lat: facebookPost.place.location.latitude,
          lng: facebookPost.place.location.longitude
        } : undefined
      } : undefined,
      isSponsored: this.checkIfSponsored(facebookPost),
      originalUrl: facebookPost.permalink_url
    }
  }
  
  // البحث عن رقم هاتف المؤلف
  private async searchAuthorPhone(userId: string, userName: string): Promise<string | undefined> {
    try {
      // البحث في قاعدة البيانات المحلية
      const phoneService = new PhoneSearchService()
      const results = await phoneService.searchByName(userName)
      
      if (results.length > 0) {
        return results[0].phone
      }
      
      // البحث في Facebook (إذا كان متاحاً)
      const userInfo = await this.getUserInfo(userId)
      return userInfo.phoneNumber
    } catch (error) {
      console.error('خطأ في البحث عن رقم الهاتف:', error)
      return undefined
    }
  }
  
  // تحديد نوع المصدر
  private async determineSourceType(sourceId: string): Promise<'page' | 'group' | 'profile'> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${sourceId}?fields=category&access_token=${this.accessToken}`
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.category) {
          return 'page'
        }
      }
      
      // تحقق من كونه مجموعة
      const groupResponse = await fetch(
        `${this.baseUrl}/${sourceId}?fields=privacy&access_token=${this.accessToken}`
      )
      
      if (groupResponse.ok) {
        const groupData = await groupResponse.json()
        if (groupData.privacy) {
          return 'group'
        }
      }
      
      return 'profile'
    } catch (error) {
      return 'profile'
    }
  }
  
  // تحسين بيانات الوسائط
  private enhanceMedia(attachments: any[]): Post['media'] {
    return attachments.map(attachment => {
      switch (attachment.type) {
        case 'photo':
          return {
            type: 'image',
            url: attachment.media?.image?.src || '',
            thumbnail: attachment.media?.image?.src
          }
        case 'video_inline':
        case 'video_share':
          return {
            type: 'video',
            url: attachment.target?.url || '',
            thumbnail: attachment.media?.image?.src
          }
        case 'share':
        case 'link':
          return {
            type: 'link',
            url: attachment.target?.url || ''
          }
        default:
          return {
            type: 'link',
            url: attachment.target?.url || ''
          }
      }
    }).filter(media => media.url)
  }
  
  // الحصول على عدد التفاعلات
  private getReactionCount(post: any, reactionType: string): number {
    return post[reactionType]?.summary?.total_count || 0
  }
  
  // فحص المنشورات المدفوعة
  private checkIfSponsored(post: FacebookPost): boolean {
    // فحص وجود كلمات دلالية أو علامات المنشورات المدفوعة
    const sponsoredKeywords = ['ممول', 'مدفوع', 'sponsored', 'promoted']
    const content = (post.message || post.story || '').toLowerCase()
    
    return sponsoredKeywords.some(keyword => 
      content.includes(keyword.toLowerCase())
    )
  }
  
  // جلب معلومات المستخدم
  private async getUserInfo(userId: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${userId}?fields=id,name,email,picture&access_token=${this.accessToken}`
      )
      
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('خطأ في جلب معلومات المستخدم:', error)
    }
    
    return {}
  }
  
  // جلب المصادر المحفوظة
  private async getSavedSources(): Promise<string[]> {
    try {
      // جلب من التخزين المحلي أو قاعدة البيانات
      const saved = localStorage.getItem('facebook_sources')
      if (saved) {
        return JSON.parse(saved)
      }
      
      // المصادر الافتراضية (صفحات وMجموعات شائعة)
      return [
        'me', // منشورات المستخدم
        // يمكن إضافة معرفات الصفحات والمجموعات هنا
      ]
    } catch (error) {
      return ['me']
    }
  }
  
  // حفظ المصادر
  async saveSources(sources: string[]): Promise<void> {
    localStorage.setItem('facebook_sources', JSON.stringify(sources))
  }
  
  // جلب التعليقات المحسنة
  async getEnhancedComments(postId: string): Promise<any[]> {
    const fields = [
      'id',
      'message',
      'created_time',
      'from{id,name,picture}',
      'likes.summary(true)',
      'comments{id,message,created_time,from{id,name}}'
    ].join(',')
    
    const response = await fetch(
      `${this.baseUrl}/${postId}/comments?fields=${fields}&access_token=${this.accessToken}`
    )
    
    if (!response.ok) {
      throw new Error(`خطأ في جلب التعليقات: ${response.status}`)
    }
    
    const data = await response.json()
    return data.data || []
  }
  
  // إحصائيات متقدمة للمستخدم
  async getUserAdvancedStats(userId: string): Promise<any> {
    try {
      // جلب منشورات المستخدم
      const userPosts = await this.fetchPostsFromSource(userId, {
        fields: 'id,message,created_time,likes.summary(true),comments.summary(true),shares',
        limit: 100
      })
      
      // حساب الإحصائيات
      const totalPosts = userPosts.length
      const totalLikes = userPosts.reduce((sum, post) => 
        sum + (post.likes?.summary?.total_count || 0), 0
      )
      const totalComments = userPosts.reduce((sum, post) => 
        sum + (post.comments?.summary?.total_count || 0), 0
      )
      const totalShares = userPosts.reduce((sum, post) => 
        sum + (post.shares?.count || 0), 0
      )
      
      // تحليل الأوقات
      const postTimes = userPosts.map(post => new Date(post.created_time))
      const hourAnalysis = this.analyzePostingHours(postTimes)
      const dayAnalysis = this.analyzePostingDays(postTimes)
      
      // متوسط طول المنشور
      const avgPostLength = userPosts.reduce((sum, post) => 
        sum + (post.message?.length || 0), 0
      ) / totalPosts || 0
      
      return {
        totalPosts,
        totalLikes,
        totalComments,
        totalShares,
        totalEngagement: totalLikes + totalComments + totalShares,
        avgEngagementPerPost: totalPosts > 0 ? 
          (totalLikes + totalComments + totalShares) / totalPosts : 0,
        avgPostLength: Math.round(avgPostLength),
        mostActiveHour: hourAnalysis.mostActive,
        mostActiveDay: dayAnalysis.mostActive,
        activityPattern: {
          hourly: hourAnalysis.distribution,
          daily: dayAnalysis.distribution
        },
        recentPosts: userPosts.slice(0, 10)
      }
    } catch (error) {
      console.error('خطأ في جلب إحصائيات المستخدم:', error)
      return {
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalEngagement: 0,
        avgEngagementPerPost: 0,
        avgPostLength: 0,
        mostActiveHour: 'غير محدد',
        mostActiveDay: 'غير محدد',
        activityPattern: { hourly: {}, daily: {} },
        recentPosts: []
      }
    }
  }
  
  // تحليل ساعات النشر
  private analyzePostingHours(dates: Date[]): any {
    const hourCounts: { [hour: number]: number } = {}
    
    dates.forEach(date => {
      const hour = date.getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })
    
    const mostActiveHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0]
    
    return {
      mostActive: mostActiveHour ? `${mostActiveHour}:00` : 'غير محدد',
      distribution: hourCounts
    }
  }
  
  // تحليل أيام النشر
  private analyzePostingDays(dates: Date[]): any {
    const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    const dayCounts: { [day: string]: number } = {}
    
    dates.forEach(date => {
      const dayName = dayNames[date.getDay()]
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1
    })
    
    const mostActiveDay = Object.entries(dayCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0]
    
    return {
      mostActive: mostActiveDay || 'غير محدد',
      distribution: dayCounts
    }
  }
}
```

#### `lib/phone-search-service.ts` - خدمة البحث عن الأرقام
```typescript
interface PhoneRecord {
  name: string
  phone: string
  location?: string
  source?: string
  lastUpdated?: string
}

interface SearchOptions {
  exactMatch?: boolean
  includePartialMatches?: boolean
  maxResults?: number
  sources?: string[]
}

export class PhoneSearchService {
  private database: PhoneRecord[] = []
  private indexedData: Map<string, PhoneRecord[]> = new Map()
  private isInitialized = false
  
  constructor() {
    this.initializeService()
  }
  
  // تهيئة الخدمة
  private async initializeService(): Promise<void> {
    if (this.isInitialized) return
    
    try {
      // تحميل البيانات من مصادر مختلفة
      await this.loadFromLocalStorage()
      await this.loadFromFiles()
      await this.loadFromDatabase()
      
      // بناء الفهارس للبحث السريع
      this.buildSearchIndexes()
      
      this.isInitialized = true
      console.log(`تم تحميل ${this.database.length} سجل هاتف`)
    } catch (error) {
      console.error('خطأ في تهيئة خدمة البحث:', error)
    }
  }
  
  // تحميل من التخزين المحلي
  private async loadFromLocalStorage(): Promise<void> {
    try {
      const stored = localStorage.getItem('phone_database')
      if (stored) {
        const data = JSON.parse(stored)
        this.database.push(...data)
      }
    } catch (error) {
      console.error('خطأ في تحميل البيانات من التخزين المحلي:', error)
    }
  }
  
  // تحميل من الملفات
  private async loadFromFiles(): Promise<void> {
    try {
      // تحميل ملف البيانات التجريبية
      const response = await fetch('/data/test-phone-data.json')
      if (response.ok) {
        const data = await response.json()
        this.database.push(...data)
      }
      
      // يمكن إضافة مصادر أخرى هنا
      await this.loadFromGoogleDrive()
    } catch (error) {
      console.error('خطأ في تحميل البيانات من الملفات:', error)
    }
  }
  
  // تحميل من Google Drive
  private async loadFromGoogleDrive(): Promise<void> {
    try {
      // استخدام خدمة Google Drive لتحميل ملفات الأرقام
      const driveService = new GoogleDriveService()
      const phoneFiles = await driveService.searchFiles({
        query: "name contains 'phone' or name contains 'هاتف'",
        mimeType: 'application/json'
      })
      
      for (const file of phoneFiles) {
        try {
          const content = await driveService.downloadFile(file.id)
          const data = JSON.parse(content)
          this.database.push(...data)
        } catch (error) {
          console.error(`خطأ في تحميل ملف ${file.name}:`, error)
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل البيانات من Google Drive:', error)
    }
  }
  
  // تحميل من قاعدة البيانات
  private async loadFromDatabase(): Promise<void> {
    try {
      const firebaseService = new FirebaseService()
      const phoneRecords = await firebaseService.getCollection('phone_numbers')
      this.database.push(...phoneRecords)
    } catch (error) {
      console.error('خطأ في تحميل البيانات من قاعدة البيانات:', error)
    }
  }
  
  // بناء فهارس البحث
  private buildSearchIndexes(): void {
    // فهرس الأسماء
    const nameIndex = new Map<string, PhoneRecord[]>()
    
    // فهرس الأرقام
    const phoneIndex = new Map<string, PhoneRecord[]>()
    
    this.database.forEach(record => {
      // فهرسة الاسم
      const nameParts = this.extractSearchTerms(record.name)
      nameParts.forEach(part => {
        if (!nameIndex.has(part)) {
          nameIndex.set(part, [])
        }
        nameIndex.get(part)!.push(record)
      })
      
      // فهرسة الرقم
      const phoneParts = this.extractPhoneParts(record.phone)
      phoneParts.forEach(part => {
        if (!phoneIndex.has(part)) {
          phoneIndex.set(part, [])
        }
        phoneIndex.get(part)!.push(record)
      })
    })
    
    this.indexedData.set('names', nameIndex)
    this.indexedData.set('phones', phoneIndex)
  }
  
  // استخراج مصطلحات البحث من الاسم
  private extractSearchTerms(name: string): string[] {
    const normalized = name.toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/[ة]/g, 'ه')
      .replace(/[ى]/g, 'ي')
    
    const terms = []
    
    // الاسم كاملاً
    terms.push(normalized)
    
    // أجزاء الاسم
    const parts = normalized.split(/\s+/)
    terms.push(...parts)
    
    // مقاطع الاسم (للبحث الجزئي)
    for (let i = 0; i < normalized.length - 2; i++) {
      terms.push(normalized.substring(i, i + 3))
    }
    
    return [...new Set(terms)].filter(term => term.length >= 2)
  }
  
  // استخراج أجزاء الرقم
  private extractPhoneParts(phone: string): string[] {
    const cleaned = phone.replace(/\D/g, '')
    const parts = []
    
    // الرقم كاملاً
    parts.push(cleaned)
    
    // أجزاء الرقم
    if (cleaned.length >= 4) {
      for (let i = 0; i <= cleaned.length - 4; i++) {
        parts.push(cleaned.substring(i, i + 4))
      }
    }
    
    return [...new Set(parts)]
  }
  
  // البحث بالاسم
  async searchByName(
    name: string, 
    options: SearchOptions = {}
  ): Promise<PhoneRecord[]> {
    await this.initializeService()
    
    const {
      exactMatch = false,
      includePartialMatches = true,
      maxResults = 50,
      sources = []
    } = options
    
    const searchTerms = this.extractSearchTerms(name)
    const results = new Set<PhoneRecord>()
    
    const nameIndex = this.indexedData.get('names')
    if (!nameIndex) return []
    
    // البحث الدقيق
    if (exactMatch) {
      const exactMatches = nameIndex.get(name.toLowerCase()) || []
      exactMatches.forEach(record => results.add(record))
    }
    
    // البحث الجزئي
    if (includePartialMatches) {
      searchTerms.forEach(term => {
        const matches = nameIndex.get(term) || []
        matches.forEach(record => results.add(record))
      })
    }
    
    // فلترة المصادر
    let filteredResults = Array.from(results)
    if (sources.length > 0) {
      filteredResults = filteredResults.filter(record => 
        !record.source || sources.includes(record.source)
      )
    }
    
    // ترتيب النتائج حسب الصلة
    const sortedResults = this.sortByRelevance(filteredResults, name)
    
    return sortedResults.slice(0, maxResults)
  }
  
  // البحث بالرقم
  async searchByPhone(
    phone: string, 
    options: SearchOptions = {}
  ): Promise<PhoneRecord[]> {
    await this.initializeService()
    
    const {
      exactMatch = false,
      includePartialMatches = true,
      maxResults = 50
    } = options
    
    const phoneParts = this.extractPhoneParts(phone)
    const results = new Set<PhoneRecord>()
    
    const phoneIndex = this.indexedData.get('phones')
    if (!phoneIndex) return []
    
    // البحث الدقيق
    if (exactMatch) {
      const cleaned = phone.replace(/\D/g, '')
      const exactMatches = phoneIndex.get(cleaned) || []
      exactMatches.forEach(record => results.add(record))
    }
    
    // البحث الجزئي
    if (includePartialMatches) {
      phoneParts.forEach(part => {
        const matches = phoneIndex.get(part) || []
        matches.forEach(record => results.add(record))
      })
    }
    
    return Array.from(results).slice(0, maxResults)
  }
  
  // البحث المتقدم
  async advancedSearch(query: {
    name?: string
    phone?: string
    location?: string
    source?: string
    dateRange?: {
      from: string
      to: string
    }
  }): Promise<PhoneRecord[]> {
    await this.initializeService()
    
    let results = this.database
    
    // فلترة الاسم
    if (query.name) {
      const nameResults = await this.searchByName(query.name, {
        includePartialMatches: true
      })
      const nameIds = new Set(nameResults.map(r => `${r.name}-${r.phone}`))
      results = results.filter(r => nameIds.has(`${r.name}-${r.phone}`))
    }
    
    // فلترة الرقم
    if (query.phone) {
      const phoneResults = await this.searchByPhone(query.phone, {
        includePartialMatches: true
      })
      const phoneIds = new Set(phoneResults.map(r => `${r.name}-${r.phone}`))
      results = results.filter(r => phoneIds.has(`${r.name}-${r.phone}`))
    }
    
    // فلترة الموقع
    if (query.location) {
      results = results.filter(r => 
        r.location?.toLowerCase().includes(query.location!.toLowerCase())
      )
    }
    
    // فلترة المصدر
    if (query.source) {
      results = results.filter(r => r.source === query.source)
    }
    
    // فلترة التاريخ
    if (query.dateRange) {
      const fromDate = new Date(query.dateRange.from)
      const toDate = new Date(query.dateRange.to)
      
      results = results.filter(r => {
        if (!r.lastUpdated) return true
        const recordDate = new Date(r.lastUpdated)
        return recordDate >= fromDate && recordDate <= toDate
      })
    }
    
    return results
  }
  
  // ترتيب النتائج حسب الصلة
  private sortByRelevance(records: PhoneRecord[], searchTerm: string): PhoneRecord[] {
    const normalized = searchTerm.toLowerCase()
    
    return records.sort((a, b) => {
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()
      
      // أولوية للتطابق الدقيق
      if (aName === normalized && bName !== normalized) return -1
      if (bName === normalized && aName !== normalized) return 1
      
      // أولوية للبداية بالكلمة
      const aStartsWith = aName.startsWith(normalized)
      const bStartsWith = bName.startsWith(normalized)
      if (aStartsWith && !bStartsWith) return -1
      if (bStartsWith && !aStartsWith) return 1
      
      // أولوية للأسماء الأقصر (أكثر دقة)
      return aName.length - bName.length
    })
  }
  
  // إضافة سجل جديد
  async addRecord(record: PhoneRecord): Promise<void> {
    // التحقق من عدم التكرار
    const existing = this.database.find(r => 
      r.name === record.name && r.phone === record.phone
    )
    
    if (existing) {
      // تحديث السجل الموجود
      Object.assign(existing, {
        ...record,
        lastUpdated: new Date().toISOString()
      })
    } else {
      // إضافة سجل جديد
      this.database.push({
        ...record,
        lastUpdated: new Date().toISOString()
      })
    }
    
    // إعادة بناء الفهارس
    this.buildSearchIndexes()
    
    // حفظ في التخزين المحلي
    this.saveToLocalStorage()
  }
  
  // حفظ في التخزين المحلي
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('phone_database', JSON.stringify(this.database))
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error)
    }
  }
  
  // تصدير البيانات
  async exportData(format: 'json' | 'csv' | 'excel' = 'json'): Promise<string | Blob> {
    await this.initializeService()
    
    switch (format) {
      case 'json':
        return JSON.stringify(this.database, null, 2)
      
      case 'csv':
        const headers = ['الاسم', 'رقم الهاتف', 'الموقع', 'المصدر', 'آخر تحديث']
        const csvContent = [
          headers.join(','),
          ...this.database.map(record => [
            `"${record.name}"`,
            `"${record.phone}"`,
            `"${record.location || ''}"`,
            `"${record.source || ''}"`,
            `"${record.lastUpdated || ''}"`
          ].join(','))
        ].join('\n')
        
        return csvContent
      
      case 'excel':
        // استخدام مكتبة لإنشاء ملف Excel
        // يتطلب تثبيت مكتبة مثل xlsx
        throw new Error('تصدير Excel غير مدعوم حالياً')
      
      default:
        throw new Error('تنسيق غير مدعوم')
    }
  }
  
  // الحصول على إحصائيات
  getStatistics(): {
    totalRecords: number
    uniqueNames: number
    uniquePhones: number
    sources: { [source: string]: number }
    locations: { [location: string]: number }
  } {
    const stats = {
      totalRecords: this.database.length,
      uniqueNames: new Set(this.database.map(r => r.name)).size,
      uniquePhones: new Set(this.database.map(r => r.phone)).size,
      sources: {} as { [source: string]: number },
      locations: {} as { [location: string]: number }
    }
    
    this.database.forEach(record => {
      // إحصائيات المصادر
      const source = record.source || 'غير محدد'
      stats.sources[source] = (stats.sources[source] || 0) + 1
      
      // إحصائيات المواقع
      const location = record.location || 'غير محدد'
      stats.locations[location] = (stats.locations[location] || 0) + 1
    })
    
    return stats
  }
}
```

### إضافة باقي التفاصيل...

سأكمل باقي الملفات والتفاصيل في الرد التالي لضمان عدم انقطاع النص بسبب الطول.
