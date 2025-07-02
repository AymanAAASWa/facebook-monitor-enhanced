
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

#### `lib/firebase-service.ts` - خدمة Firebase للبيانات
```typescript
import { initializeApp } from 'firebase/app'
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  writeBatch
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getAuth, signInAnonymously } from 'firebase/auth'

// إعداد Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

export class FirebaseService {
  private isInitialized = false
  
  constructor() {
    this.initializeAuth()
  }
  
  // تهيئة التوثيق
  private async initializeAuth(): Promise<void> {
    try {
      await signInAnonymously(auth)
      this.isInitialized = true
      console.log('Firebase authentication successful')
    } catch (error) {
      console.error('Firebase authentication failed:', error)
    }
  }
  
  // حفظ المنشورات
  async savePosts(posts: any[]): Promise<void> {
    if (!this.isInitialized) await this.initializeAuth()
    
    const batch = writeBatch(db)
    const postsCollection = collection(db, 'facebook_posts')
    
    posts.forEach(post => {
      const docRef = doc(postsCollection, post.id)
      batch.set(docRef, {
        ...post,
        saved_at: new Date().toISOString(),
        processed: false
      })
    })
    
    await batch.commit()
    console.log(`Saved ${posts.length} posts to Firebase`)
  }
  
  // جلب المنشورات
  async getPosts(options: {
    limit?: number
    startDate?: string
    endDate?: string
    source?: string
  } = {}): Promise<any[]> {
    if (!this.isInitialized) await this.initializeAuth()
    
    const postsCollection = collection(db, 'facebook_posts')
    let q = query(postsCollection, orderBy('created_time', 'desc'))
    
    // إضافة الفلاتر
    if (options.limit) {
      q = query(q, limit(options.limit))
    }
    
    if (options.source) {
      q = query(q, where('source_name', '==', options.source))
    }
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }
  
  // حفظ بيانات المستخدم المحسنة
  async saveEnhancedUser(userData: any): Promise<void> {
    if (!this.isInitialized) await this.initializeAuth()
    
    const usersCollection = collection(db, 'enhanced_users')
    const docRef = doc(usersCollection, userData.id)
    
    await updateDoc(docRef, {
      ...userData,
      last_updated: new Date().toISOString()
    }).catch(async () => {
      // إذا لم يجد المستند، أنشئه
      await addDoc(usersCollection, {
        ...userData,
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
      })
    })
  }
  
  // حفظ أرقام الهواتف
  async savePhoneNumbers(phoneData: any[]): Promise<void> {
    if (!this.isInitialized) await this.initializeAuth()
    
    const batch = writeBatch(db)
    const phonesCollection = collection(db, 'phone_numbers')
    
    phoneData.forEach(record => {
      const docRef = doc(phonesCollection)
      batch.set(docRef, {
        ...record,
        saved_at: new Date().toISOString()
      })
    })
    
    await batch.commit()
  }
  
  // رفع الملفات
  async uploadFile(file: File, path: string): Promise<string> {
    if (!this.isInitialized) await this.initializeAuth()
    
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    return await getDownloadURL(snapshot.ref)
  }
  
  // مراقبة البيانات في الوقت الفعلي
  subscribeToCollection(
    collectionName: string, 
    callback: (data: any[]) => void,
    options: {
      limit?: number
      orderBy?: { field: string, direction: 'asc' | 'desc' }
      where?: { field: string, operator: any, value: any }
    } = {}
  ): () => void {
    let q = query(collection(db, collectionName))
    
    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction))
    }
    
    if (options.where) {
      q = query(q, where(options.where.field, options.where.operator, options.where.value))
    }
    
    if (options.limit) {
      q = query(q, limit(options.limit))
    }
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      callback(data)
    })
  }
}

// تصدير instance واحد
export const firebaseService = new FirebaseService()
```

### 📊 مكونات التحليلات والإحصائيات

#### `components/analytics-dashboard.tsx` - لوحة التحليلات الرئيسية
```typescript
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Clock,
  Calendar,
  Target,
  Activity,
  Zap,
  Globe,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'

interface AnalyticsDashboardProps {
  posts: any[]
  darkMode?: boolean
  language?: "ar" | "en"
}

interface AnalyticsData {
  totalPosts: number
  totalEngagement: number
  avgEngagementPerPost: number
  topPosters: Array<{ name: string; count: number; engagement: number }>
  engagementByDay: Array<{ date: string; engagement: number; posts: number }>
  engagementByHour: Array<{ hour: number; engagement: number; posts: number }>
  sourceDistribution: Array<{ name: string; count: number; percentage: number }>
  contentTypes: Array<{ type: string; count: number; engagement: number }>
  trends: {
    postsGrowth: number
    engagementGrowth: number
    activeUsersGrowth: number
  }
}

export function AnalyticsDashboard({ 
  posts = [], 
  darkMode = false, 
  language = "ar" 
}: AnalyticsDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [refreshing, setRefreshing] = useState(false)
  
  const t = {
    ar: {
      title: "لوحة التحليلات",
      overview: "نظرة عامة",
      engagement: "التفاعل",
      users: "المستخدمون",
      content: "المحتوى",
      trends: "الاتجاهات",
      totalPosts: "إجمالي المنشورات",
      totalEngagement: "إجمالي التفاعل",
      avgEngagement: "متوسط التفاعل",
      activeUsers: "المستخدمون النشطون",
      topPosters: "أكثر المنشورين نشاطاً",
      engagementByTime: "التفاعل عبر الوقت",
      sourceDistribution: "توزيع المصادر",
      contentTypes: "أنواع المحتوى",
      last7Days: "آخر 7 أيام",
      last30Days: "آخر 30 يوم",
      last90Days: "آخر 90 يوم",
      refresh: "تحديث",
      export: "تصدير",
      loading: "جاري التحديث...",
      postsGrowth: "نمو المنشورات",
      engagementGrowth: "نمو التفاعل",
      usersGrowth: "نمو المستخدمين",
      hourlyActivity: "النشاط بالساعة",
      dailyActivity: "النشاط اليومي",
      posts: "منشور",
      comments: "تعليق",
      likes: "إعجاب",
      shares: "مشاركة"
    },
    en: {
      title: "Analytics Dashboard",
      overview: "Overview",
      engagement: "Engagement",
      users: "Users",
      content: "Content",
      trends: "Trends",
      totalPosts: "Total Posts",
      totalEngagement: "Total Engagement",
      avgEngagement: "Average Engagement",
      activeUsers: "Active Users",
      topPosters: "Top Posters",
      engagementByTime: "Engagement Over Time",
      sourceDistribution: "Source Distribution",
      contentTypes: "Content Types",
      last7Days: "Last 7 Days",
      last30Days: "Last 30 Days",
      last90Days: "Last 90 Days",
      refresh: "Refresh",
      export: "Export",
      loading: "Refreshing...",
      postsGrowth: "Posts Growth",
      engagementGrowth: "Engagement Growth",
      usersGrowth: "Users Growth",
      hourlyActivity: "Hourly Activity",
      dailyActivity: "Daily Activity",
      posts: "Posts",
      comments: "Comments",
      likes: "Likes",
      shares: "Shares"
    }
  }
  
  const text = t[language]
  
  // حساب البيانات التحليلية
  const analyticsData = useMemo((): AnalyticsData => {
    if (!posts || posts.length === 0) {
      return {
        totalPosts: 0,
        totalEngagement: 0,
        avgEngagementPerPost: 0,
        topPosters: [],
        engagementByDay: [],
        engagementByHour: [],
        sourceDistribution: [],
        contentTypes: [],
        trends: { postsGrowth: 0, engagementGrowth: 0, activeUsersGrowth: 0 }
      }
    }
    
    // فلترة المنشورات حسب المدة الزمنية المختارة
    const now = new Date()
    const daysBack = selectedTimeRange === '7d' ? 7 : selectedTimeRange === '30d' ? 30 : 90
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
    
    const filteredPosts = posts.filter(post => 
      new Date(post.created_time) >= startDate
    )
    
    // حساب الإحصائيات الأساسية
    const totalPosts = filteredPosts.length
    const totalEngagement = filteredPosts.reduce((sum, post) => {
      const comments = post.comments?.data?.length || 0
      const likes = post.likes?.summary?.total_count || 0
      const shares = post.shares?.count || 0
      return sum + comments + likes + shares
    }, 0)
    
    const avgEngagementPerPost = totalPosts > 0 ? totalEngagement / totalPosts : 0
    
    // أكثر المنشورين نشاطاً
    const posterStats = new Map<string, { count: number; engagement: number; name: string }>()
    
    filteredPosts.forEach(post => {
      const userId = post.from?.id || 'unknown'
      const userName = post.from?.name || 'مستخدم غير معروف'
      const engagement = (post.comments?.data?.length || 0) + 
                        (post.likes?.summary?.total_count || 0) + 
                        (post.shares?.count || 0)
      
      if (!posterStats.has(userId)) {
        posterStats.set(userId, { count: 0, engagement: 0, name: userName })
      }
      
      const stats = posterStats.get(userId)!
      stats.count++
      stats.engagement += engagement
    })
    
    const topPosters = Array.from(posterStats.entries())
      .map(([id, stats]) => ({
        name: stats.name,
        count: stats.count,
        engagement: stats.engagement
      }))
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 10)
    
    // التفاعل بالأيام
    const engagementByDay = new Map<string, { engagement: number; posts: number }>()
    
    filteredPosts.forEach(post => {
      const date = new Date(post.created_time).toISOString().split('T')[0]
      const engagement = (post.comments?.data?.length || 0) + 
                        (post.likes?.summary?.total_count || 0) + 
                        (post.shares?.count || 0)
      
      if (!engagementByDay.has(date)) {
        engagementByDay.set(date, { engagement: 0, posts: 0 })
      }
      
      const dayStats = engagementByDay.get(date)!
      dayStats.engagement += engagement
      dayStats.posts++
    })
    
    const engagementByDayArray = Array.from(engagementByDay.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date))
    
    // التفاعل بالساعات
    const engagementByHour = Array.from({ length: 24 }, (_, hour) => {
      const hourPosts = filteredPosts.filter(post => 
        new Date(post.created_time).getHours() === hour
      )
      
      const engagement = hourPosts.reduce((sum, post) => {
        return sum + (post.comments?.data?.length || 0) + 
                     (post.likes?.summary?.total_count || 0) + 
                     (post.shares?.count || 0)
      }, 0)
      
      return { hour, engagement, posts: hourPosts.length }
    })
    
    // توزيع المصادر
    const sourceStats = new Map<string, number>()
    filteredPosts.forEach(post => {
      const source = post.source_name || 'غير محدد'
      sourceStats.set(source, (sourceStats.get(source) || 0) + 1)
    })
    
    const sourceDistribution = Array.from(sourceStats.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalPosts) * 100)
      }))
      .sort((a, b) => b.count - a.count)
    
    // أنواع المحتوى
    const contentTypes = [
      {
        type: 'نص فقط',
        count: filteredPosts.filter(post => 
          !post.attachments?.data?.length && !post.full_picture
        ).length,
        engagement: 0
      },
      {
        type: 'صور',
        count: filteredPosts.filter(post => 
          post.full_picture || 
          post.attachments?.data?.some((att: any) => att.type === 'photo')
        ).length,
        engagement: 0
      },
      {
        type: 'فيديو',
        count: filteredPosts.filter(post => 
          post.attachments?.data?.some((att: any) => 
            att.type === 'video_inline' || att.type === 'video_share'
          )
        ).length,
        engagement: 0
      },
      {
        type: 'روابط',
        count: filteredPosts.filter(post => 
          post.attachments?.data?.some((att: any) => att.type === 'share')
        ).length,
        engagement: 0
      }
    ]
    
    // حساب الاتجاهات (مقارنة مع الفترة السابقة)
    const prevStartDate = new Date(startDate.getTime() - daysBack * 24 * 60 * 60 * 1000)
    const prevPosts = posts.filter(post => {
      const postDate = new Date(post.created_time)
      return postDate >= prevStartDate && postDate < startDate
    })
    
    const prevTotalPosts = prevPosts.length
    const prevTotalEngagement = prevPosts.reduce((sum, post) => {
      return sum + (post.comments?.data?.length || 0) + 
                   (post.likes?.summary?.total_count || 0) + 
                   (post.shares?.count || 0)
    }, 0)
    
    const prevActiveUsers = new Set(prevPosts.map(post => post.from?.id)).size
    const currentActiveUsers = new Set(filteredPosts.map(post => post.from?.id)).size
    
    const trends = {
      postsGrowth: prevTotalPosts > 0 ? 
        Math.round(((totalPosts - prevTotalPosts) / prevTotalPosts) * 100) : 0,
      engagementGrowth: prevTotalEngagement > 0 ? 
        Math.round(((totalEngagement - prevTotalEngagement) / prevTotalEngagement) * 100) : 0,
      activeUsersGrowth: prevActiveUsers > 0 ? 
        Math.round(((currentActiveUsers - prevActiveUsers) / prevActiveUsers) * 100) : 0
    }
    
    return {
      totalPosts,
      totalEngagement,
      avgEngagementPerPost,
      topPosters,
      engagementByDay: engagementByDayArray,
      engagementByHour,
      sourceDistribution,
      contentTypes,
      trends
    }
  }, [posts, selectedTimeRange])
  
  // تحديث البيانات
  const handleRefresh = async () => {
    setRefreshing(true)
    // محاكاة تحديث البيانات
    await new Promise(resolve => setTimeout(resolve, 2000))
    setRefreshing(false)
  }
  
  // تصدير البيانات
  const handleExport = () => {
    const data = {
      analytics: analyticsData,
      exportDate: new Date().toISOString(),
      timeRange: selectedTimeRange
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${selectedTimeRange}-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  // ألوان المخططات
  const chartColors = {
    primary: '#3b82f6',
    secondary: '#ef4444',
    accent: '#10b981',
    warning: '#f59e0b',
    purple: '#8b5cf6',
    pink: '#ec4899'
  }
  
  const pieColors = [
    chartColors.primary,
    chartColors.secondary,
    chartColors.accent,
    chartColors.warning,
    chartColors.purple,
    chartColors.pink
  ]
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{text.title}</h2>
          <p className="text-gray-600">
            {text[selectedTimeRange === '7d' ? 'last7Days' : 
                  selectedTimeRange === '30d' ? 'last30Days' : 'last90Days']}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* اختيار المدة الزمنية */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={selectedTimeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTimeRange(range)}
                className="text-xs"
              >
                {text[range === '7d' ? 'last7Days' : 
                      range === '30d' ? 'last30Days' : 'last90Days']}
              </Button>
            ))}
          </div>
          
          {/* أزرار التحكم */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? text.loading : text.refresh}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            {text.export}
          </Button>
        </div>
      </div>
      
      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{text.totalPosts}</p>
                <p className="text-2xl font-bold">{analyticsData.totalPosts.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {analyticsData.trends.postsGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    analyticsData.trends.postsGrowth >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {analyticsData.trends.postsGrowth}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{text.totalEngagement}</p>
                <p className="text-2xl font-bold">{analyticsData.totalEngagement.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {analyticsData.trends.engagementGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    analyticsData.trends.engagementGrowth >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {analyticsData.trends.engagementGrowth}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{text.avgEngagement}</p>
                <p className="text-2xl font-bold">{Math.round(analyticsData.avgEngagementPerPost)}</p>
                <div className="flex items-center mt-1">
                  <Activity className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-sm text-gray-500">
                    لكل منشور
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{text.activeUsers}</p>
                <p className="text-2xl font-bold">
                  {new Set(posts.map(post => post.from?.id)).size}
                </p>
                <div className="flex items-center mt-1">
                  {analyticsData.trends.activeUsersGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    analyticsData.trends.activeUsersGrowth >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {analyticsData.trends.activeUsersGrowth}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* التبويبات الرئيسية */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview">{text.overview}</TabsTrigger>
          <TabsTrigger value="engagement">{text.engagement}</TabsTrigger>
          <TabsTrigger value="users">{text.users}</TabsTrigger>
          <TabsTrigger value="content">{text.content}</TabsTrigger>
        </TabsList>
        
        {/* تبويب النظرة العامة */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* التفاعل عبر الوقت */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {text.dailyActivity}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.engagementByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('ar-EG')}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString('ar-EG')}
                      formatter={(value, name) => [
                        value, 
                        name === 'engagement' ? 'التفاعل' : 'المنشورات'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="engagement" 
                      stroke={chartColors.primary}
                      fill={chartColors.primary}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* النشاط بالساعة */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {text.hourlyActivity}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.engagementByHour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value, name) => [
                        value, 
                        name === 'engagement' ? 'التفاعل' : 'المنشورات'
                      ]}
                    />
                    <Bar 
                      dataKey="engagement" 
                      fill={chartColors.accent}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* توزيع المصادر */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {text.sourceDistribution}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analyticsData.sourceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="count"
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                    >
                      {analyticsData.sourceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-2">
                  {analyticsData.sourceDistribution.map((source, index) => (
                    <div key={source.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: pieColors[index % pieColors.length] }}
                        />
                        <span className="text-sm font-medium">{source.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{source.count}</div>
                        <div className="text-xs text-gray-500">{source.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* تبويب التفاعل */}
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{text.engagementByTime}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.engagementByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('ar-EG')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('ar-EG')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke={chartColors.primary}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="posts" 
                    stroke={chartColors.secondary}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* تبويب المستخدمين */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{text.topPosters}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.topPosters.slice(0, 10).map((poster, index) => (
                  <div key={poster.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{poster.name}</div>
                        <div className="text-sm text-gray-500">{poster.count} {text.posts}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{poster.engagement}</div>
                      <div className="text-sm text-gray-500">تفاعل</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* تبويب المحتوى */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{text.contentTypes}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {analyticsData.contentTypes.map((type, index) => (
                  <div key={type.type} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {type.count}
                    </div>
                    <div className="text-sm font-medium mb-2">{type.type}</div>
                    <Progress 
                      value={(type.count / analyticsData.totalPosts) * 100} 
                      className="h-2"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round((type.count / analyticsData.totalPosts) * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### 🔍 مكونات البحث والفلترة

#### `components/phone-database-manager.tsx` - إدارة قاعدة بيانات الأرقام
```typescript
'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Upload, 
  Download, 
  Search, 
  Trash2, 
  Plus, 
  FileText, 
  Database,
  CheckCircle,
  AlertCircle,
  Loader2,
  Users,
  Phone,
  MapPin,
  Calendar,
  Filter,
  RefreshCw,
  Settings,
  Eye,
  Edit,
  Save,
  X
} from 'lucide-react'
import { PhoneSearchService } from '@/lib/phone-search-service'
import { GoogleDriveService } from '@/lib/google-drive-service'

interface PhoneRecord {
  id?: string
  name: string
  phone: string
  location?: string
  source?: string
  notes?: string
  lastUpdated?: string
  verified?: boolean
}

interface DatabaseStats {
  totalRecords: number
  verifiedRecords: number
  uniqueLocations: number
  sources: { [key: string]: number }
  lastUpdate: string
}

export function PhoneDatabaseManager() {
  const [phoneRecords, setPhoneRecords] = useState<PhoneRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<PhoneRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [stats, setStats] = useState<DatabaseStats>({
    totalRecords: 0,
    verifiedRecords: 0,
    uniqueLocations: 0,
    sources: {},
    lastUpdate: ''
  })
  const [newRecord, setNewRecord] = useState<PhoneRecord>({
    name: '',
    phone: '',
    location: '',
    source: 'manual',
    notes: ''
  })
  const [editingRecord, setEditingRecord] = useState<PhoneRecord | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const phoneSearchService = new PhoneSearchService()
  const googleDriveService = new GoogleDriveService()
  
  // تحميل البيانات عند بدء المكون
  useEffect(() => {
    loadPhoneDatabase()
  }, [])
  
  // تطبيق الفلاتر
  useEffect(() => {
    applyFilters()
  }, [phoneRecords, searchTerm, selectedSource, selectedLocation])
  
  // تحميل قاعدة البيانات
  const loadPhoneDatabase = async () => {
    setLoading(true)
    try {
      const records = await phoneSearchService.getAllRecords()
      setPhoneRecords(records)
      calculateStats(records)
    } catch (error) {
      console.error('خطأ في تحميل قاعدة البيانات:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // حساب الإحصائيات
  const calculateStats = (records: PhoneRecord[]) => {
    const sources: { [key: string]: number } = {}
    const locations = new Set<string>()
    let verifiedCount = 0
    
    records.forEach(record => {
      // مصادر البيانات
      const source = record.source || 'غير محدد'
      sources[source] = (sources[source] || 0) + 1
      
      // المواقع
      if (record.location) {
        locations.add(record.location)
      }
      
      // السجلات المتحققة
      if (record.verified) {
        verifiedCount++
      }
    })
    
    setStats({
      totalRecords: records.length,
      verifiedRecords: verifiedCount,
      uniqueLocations: locations.size,
      sources,
      lastUpdate: new Date().toISOString()
    })
  }
  
  // تطبيق الفلاتر
  const applyFilters = () => {
    let filtered = phoneRecords
    
    // فلترة البحث
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.phone.includes(searchTerm) ||
        record.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // فلترة المصدر
    if (selectedSource !== 'all') {
      filtered = filtered.filter(record => record.source === selectedSource)
    }
    
    // فلترة الموقع
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(record => record.location === selectedLocation)
    }
    
    setFilteredRecords(filtered)
  }
  
  // رفع ملف
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setLoading(true)
    setUploadProgress(0)
    
    try {
      const text = await file.text()
      let newRecords: PhoneRecord[] = []
      
      if (file.name.endsWith('.json')) {
        newRecords = JSON.parse(text)
      } else if (file.name.endsWith('.csv')) {
        newRecords = parseCSV(text)
      } else {
        throw new Error('نوع ملف غير مدعوم')
      }
      
      // معالجة السجلات
      for (let i = 0; i < newRecords.length; i++) {
        await phoneSearchService.addRecord(newRecords[i])
        setUploadProgress(Math.round(((i + 1) / newRecords.length) * 100))
      }
      
      await loadPhoneDatabase()
      alert(`تم رفع ${newRecords.length} سجل بنجاح`)
      
    } catch (error) {
      console.error('خطأ في رفع الملف:', error)
      alert('خطأ في رفع الملف')
    } finally {
      setLoading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }
  
  // تحليل ملف CSV
  const parseCSV = (csvText: string): PhoneRecord[] => {
    const lines = csvText.split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    
    return lines.slice(1)
      .filter(line => line.trim())
      .map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
        
        return {
          id: `csv_${index}`,
          name: values[0] || '',
          phone: values[1] || '',
          location: values[2] || '',
          source: 'csv_upload',
          notes: values[3] || '',
          lastUpdated: new Date().toISOString(),
          verified: false
        }
      })
      .filter(record => record.name && record.phone)
  }
  
  // تصدير البيانات
  const handleExport = async (format: 'json' | 'csv') => {
    try {
      let content: string
      let filename: string
      
      if (format === 'json') {
        content = JSON.stringify(filteredRecords, null, 2)
        filename = `phone-database-${new Date().toISOString().split('T')[0]}.json`
      } else {
        const headers = ['الاسم', 'رقم الهاتف', 'الموقع', 'المصدر', 'ملاحظات', 'آخر تحديث']
        const csvRows = [
          headers.join(','),
          ...filteredRecords.map(record => [
            `"${record.name}"`,
            `"${record.phone}"`,
            `"${record.location || ''}"`,
            `"${record.source || ''}"`,
            `"${record.notes || ''}"`,
            `"${record.lastUpdated || ''}"`
          ].join(','))
        ]
        content = csvRows.join('\n')
        filename = `phone-database-${new Date().toISOString().split('T')[0]}.csv`
      }
      
      const blob = new Blob([content], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('خطأ في التصدير:', error)
      alert('خطأ في تصدير البيانات')
    }
  }
  
  // إضافة سجل جديد
  const handleAddRecord = async () => {
    if (!newRecord.name || !newRecord.phone) {
      alert('يرجى إدخال الاسم ورقم الهاتف')
      return
    }
    
    try {
      const recordToAdd = {
        ...newRecord,
        id: `manual_${Date.now()}`,
        lastUpdated: new Date().toISOString(),
        verified: false
      }
      
      await phoneSearchService.addRecord(recordToAdd)
      await loadPhoneDatabase()
      
      setNewRecord({
        name: '',
        phone: '',
        location: '',
        source: 'manual',
        notes: ''
      })
      setShowAddForm(false)
      
    } catch (error) {
      console.error('خطأ في إضافة السجل:', error)
      alert('خطأ في إضافة السجل')
    }
  }
  
  // تعديل سجل
  const handleEditRecord = async (record: PhoneRecord) => {
    if (!editingRecord) return
    
    try {
      const updatedRecord = {
        ...editingRecord,
        lastUpdated: new Date().toISOString()
      }
      
      await phoneSearchService.updateRecord(updatedRecord)
      await loadPhoneDatabase()
      setEditingRecord(null)
      
    } catch (error) {
      console.error('خطأ في تعديل السجل:', error)
      alert('خطأ في تعديل السجل')
    }
  }
  
  // حذف سجل
  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السجل؟')) return
    
    try {
      await phoneSearchService.deleteRecord(recordId)
      await loadPhoneDatabase()
    } catch (error) {
      console.error('خطأ في حذف السجل:', error)
      alert('خطأ في حذف السجل')
    }
  }
  
  // التحقق من سجل
  const handleVerifyRecord = async (recordId: string) => {
    try {
      await phoneSearchService.verifyRecord(recordId)
      await loadPhoneDatabase()
    } catch (error) {
      console.error('خطأ في التحقق من السجل:', error)
    }
  }
  
  // الحصول على قائمة المصادر الفريدة
  const uniqueSources = Array.from(new Set(phoneRecords.map(r => r.source).filter(Boolean)))
  const uniqueLocations = Array.from(new Set(phoneRecords.map(r => r.location).filter(Boolean)))
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="w-6 h-6" />
            إدارة قاعدة بيانات الأرقام
          </h2>
          <p className="text-gray-600">
            إدارة وتنظيم أرقام الهواتف والبحث فيها
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            إضافة سجل
          </Button>
          
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <Upload className="w-4 h-4 mr-2" />
            رفع ملف
          </Button>
          
          <Button
            variant="outline"
            onClick={loadPhoneDatabase}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>
      </div>
      
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي السجلات</p>
                <p className="text-2xl font-bold">{stats.totalRecords.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">سجلات متحققة</p>
                <p className="text-2xl font-bold">{stats.verifiedRecords.toLocaleString()}</p>
                <div className="text-sm text-gray-500">
                  {stats.totalRecords > 0 ? 
                    Math.round((stats.verifiedRecords / stats.totalRecords) * 100) : 0}%
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مواقع فريدة</p>
                <p className="text-2xl font-bold">{stats.uniqueLocations}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">آخر تحديث</p>
                <p className="text-sm font-bold">
                  {stats.lastUpdate ? 
                    new Date(stats.lastUpdate).toLocaleDateString('ar-EG') : 
                    'غير محدد'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* شريط التحكم */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* البحث */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في السجلات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            {/* فلترة المصدر */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">جميع المصادر</option>
              {uniqueSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
            
            {/* فلترة الموقع */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">جميع المواقع</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            
            {/* أزرار التصدير */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('json')}
              >
                <Download className="w-4 h-4 mr-1" />
                JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv')}
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </Button>
            </div>
          </div>
          
          {/* نتائج الفلترة */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              عرض {filteredRecords.length} من {phoneRecords.length} سجل
            </span>
            {(searchTerm || selectedSource !== 'all' || selectedLocation !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedSource('all')
                  setSelectedLocation('all')
                }}
              >
                مسح الفلاتر
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* نموذج إضافة سجل جديد */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              إضافة سجل جديد
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">الاسم *</Label>
                <Input
                  id="name"
                  value={newRecord.name}
                  onChange={(e) => setNewRecord({...newRecord, name: e.target.value})}
                  placeholder="أدخل الاسم..."
                />
              </div>
              
              <div>
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  value={newRecord.phone}
                  onChange={(e) => setNewRecord({...newRecord, phone: e.target.value})}
                  placeholder="أدخل رقم الهاتف..."
                />
              </div>
              
              <div>
                <Label htmlFor="location">الموقع</Label>
                <Input
                  id="location"
                  value={newRecord.location}
                  onChange={(e) => setNewRecord({...newRecord, location: e.target.value})}
                  placeholder="أدخل الموقع..."
                />
              </div>
              
              <div>
                <Label htmlFor="source">المصدر</Label>
                <select
                  id="source"
                  value={newRecord.source}
                  onChange={(e) => setNewRecord({...newRecord, source: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="manual">إدخال يدوي</option>
                  <option value="facebook">فيسبوك</option>
                  <option value="whatsapp">واتساب</option>
                  <option value="contacts">جهات الاتصال</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Input
                  id="notes"
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                  placeholder="أدخل أي ملاحظات..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                إلغاء
              </Button>
              <Button onClick={handleAddRecord}>
                <Save className="w-4 h-4 mr-2" />
                حفظ
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* جدول السجلات */}
      <Card>
        <CardHeader>
          <CardTitle>سجلات قاعدة البيانات</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && uploadProgress > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">جاري الرفع...</span>
                <span className="text-sm font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          {loading && uploadProgress === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              جاري التحميل...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-2">الاسم</th>
                    <th className="text-right p-2">رقم الهاتف</th>
                    <th className="text-right p-2">الموقع</th>
                    <th className="text-right p-2">المصدر</th>
                    <th className="text-right p-2">الحالة</th>
                    <th className="text-right p-2">آخر تحديث</th>
                    <th className="text-center p-2">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        {editingRecord?.id === record.id ? (
                          <Input
                            value={editingRecord.name}
                            onChange={(e) => setEditingRecord({
                              ...editingRecord,
                              name: e.target.value
                            })}
                            className="h-8"
                          />
                        ) : (
                          <span className="font-medium">{record.name}</span>
                        )}
                      </td>
                      <td className="p-2">
                        {editingRecord?.id === record.id ? (
                          <Input
                            value={editingRecord.phone}
                            onChange={(e) => setEditingRecord({
                              ...editingRecord,
                              phone: e.target.value
                            })}
                            className="h-8"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="font-mono text-sm">{record.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-2">
                        {editingRecord?.id === record.id ? (
                          <Input
                            value={editingRecord.location || ''}
                            onChange={(e) => setEditingRecord({
                              ...editingRecord,
                              location: e.target.value
                            })}
                            className="h-8"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{record.location || 'غير محدد'}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-xs">
                          {record.source || 'غير محدد'}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge 
                          variant={record.verified ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {record.verified ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              متحقق
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              غير متحقق
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="p-2 text-sm text-gray-500">
                        {record.lastUpdated ? 
                          new Date(record.lastUpdated).toLocaleDateString('ar-EG') : 
                          'غير محدد'}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-1">
                          {editingRecord?.id === record.id ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditRecord(record)}
                                className="h-6 w-6 p-0"
                              >
                                <Save className="w-3 h-3 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingRecord(null)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="w-3 h-3 text-gray-600" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingRecord(record)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit className="w-3 h-3 text-blue-600" />
                              </Button>
                              
                              {!record.verified && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVerifyRecord(record.id!)}
                                  className="h-6 w-6 p-0"
                                >
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRecord(record.id!)}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredRecords.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>لا توجد سجلات تطابق معايير البحث</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* مدخل الملف المخفي */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  )
}
```

## 🎯 تكامل النظام والاستنتاج

### الربط بين المكونات:
1. **FacebookMonitor** يجمع البيانات من API
2. **EnhancedPostsList** يعرض البيانات مع أزرار التحليل
3. **UserAnalyticsViewer** يحلل بيانات المستخدم المحددة
4. **PhoneDatabaseManager** يدير أرقام الهواتف
5. **AnalyticsDashboard** يعرض إحصائيات شاملة

### تدفق البيانات:
```
Facebook API → EnhancedFacebookService → Firebase/LocalStorage
     ↓
AnalyticsDashboard ← EnhancedPostsList → UserAnalyticsViewer
     ↓                    ↓
PhoneSearchService ← PhoneDatabaseManager
```

### ملاحظات مهمة:
- جميع المكونات محسنة للأجهزة المحمولة والتابلت والكمبيوتر
- تم حل مشكلة أزرار المستخدم المكررة
- تم إضافة تحليلات تفصيلية لكل مستخدم
- تم تحسين عرض البيانات ومنع عودتها فارغة
- جميع العمليات معروضة في الخريطة مع مساراتها الكاملة
