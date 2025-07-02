
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Database, 
  Calendar, 
  Download, 
  X, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Stop
} from "lucide-react"
import { type BulkLoadOptions, type LoadProgress } from "@/lib/bulk-data-loader"

interface BulkDataLoaderDialogProps {
  onClose: () => void
  onStartLoad: (options: BulkLoadOptions) => void
  progress: LoadProgress | null
  darkMode?: boolean
}

export function BulkDataLoaderDialog({ 
  onClose, 
  onStartLoad, 
  progress,
  darkMode = false 
}: BulkDataLoaderDialogProps) {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1) // آخر شهر افتراضياً
    return date.toISOString().split('T')[0]
  })
  
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })
  
  const [maxPosts, setMaxPosts] = useState(1000)
  const [includeComments, setIncludeComments] = useState(true)
  const [includePastYear, setIncludePastYear] = useState(false)
  const [batchSize, setBatchSize] = useState(50)
  const [presetRange, setPresetRange] = useState<string>("")

  // تطبيق النطاقات المحددة مسبقاً
  const applyPresetRange = (preset: string) => {
    const now = new Date()
    let start = new Date()
    
    switch (preset) {
      case 'last_week':
        start.setDate(now.getDate() - 7)
        setMaxPosts(500)
        break
      case 'last_month':
        start.setMonth(now.getMonth() - 1)
        setMaxPosts(1000)
        break
      case 'last_3_months':
        start.setMonth(now.getMonth() - 3)
        setMaxPosts(3000)
        break
      case 'last_6_months':
        start.setMonth(now.getMonth() - 6)
        setMaxPosts(5000)
        break
      case 'last_year':
        start.setFullYear(now.getFullYear() - 1)
        setMaxPosts(10000)
        setIncludePastYear(true)
        break
      case 'all_time':
        start.setFullYear(2010) // بداية فيسبوك تقريباً
        setMaxPosts(50000)
        setIncludePastYear(true)
        break
    }
    
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(now.toISOString().split('T')[0])
  }

  // بدء التحميل
  const handleStartLoad = () => {
    const options: BulkLoadOptions = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      maxPosts,
      includePastYear,
      includeComments,
      batchSize
    }
    
    onStartLoad(options)
  }

  // حساب المدة المتوقعة
  const estimatedDuration = () => {
    const batches = Math.ceil(maxPosts / batchSize)
    const minutes = batches * 0.5 // تقدير 30 ثانية لكل دفعة
    
    if (minutes < 1) return 'أقل من دقيقة'
    if (minutes < 60) return `${Math.round(minutes)} دقيقة`
    return `${Math.round(minutes / 60)} ساعة`
  }

  // حساب النسبة المئوية للتقدم
  const progressPercentage = progress ? 
    Math.round((progress.currentBatch / Math.max(progress.totalBatches, 1)) * 100) : 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Database className="w-5 h-5" />
            التحميل المجمع للبيانات
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={progress?.status === 'loading'}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* النطاقات المحددة مسبقاً */}
          <div className="space-y-2">
            <Label>النطاقات السريعة</Label>
            <Select value={presetRange} onValueChange={(value) => {
              setPresetRange(value)
              applyPresetRange(value)
            }}>
              <SelectTrigger>
                <SelectValue placeholder="اختر نطاق زمني..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_week">الأسبوع الماضي</SelectItem>
                <SelectItem value="last_month">الشهر الماضي</SelectItem>
                <SelectItem value="last_3_months">آخر 3 أشهر</SelectItem>
                <SelectItem value="last_6_months">آخر 6 أشهر</SelectItem>
                <SelectItem value="last_year">السنة الماضية</SelectItem>
                <SelectItem value="all_time">جميع البيانات المتاحة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* النطاق الزمني المخصص */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">تاريخ البداية</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={progress?.status === 'loading'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">تاريخ النهاية</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={progress?.status === 'loading'}
              />
            </div>
          </div>

          {/* إعدادات التحميل */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-posts">الحد الأقصى للمنشورات</Label>
              <Input
                id="max-posts"
                type="number"
                min="1"
                max="100000"
                value={maxPosts}
                onChange={(e) => setMaxPosts(Number(e.target.value))}
                disabled={progress?.status === 'loading'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch-size">حجم الدفعة</Label>
              <Select
                value={batchSize.toString()}
                onValueChange={(value) => setBatchSize(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 منشور</SelectItem>
                  <SelectItem value="50">50 منشور</SelectItem>
                  <SelectItem value="100">100 منشور</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* خيارات إضافية */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="include-comments">تضمين التعليقات</Label>
              <Switch
                id="include-comments"
                checked={includeComments}
                onCheckedChange={setIncludeComments}
                disabled={progress?.status === 'loading'}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="include-past-year">تضمين البيانات القديمة (أكثر من سنة)</Label>
              <Switch
                id="include-past-year"
                checked={includePastYear}
                onCheckedChange={setIncludePastYear}
                disabled={progress?.status === 'loading'}
              />
            </div>
          </div>

          {/* معلومات التقدير */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-300">تقديرات التحميل</span>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p>المدة المتوقعة: {estimatedDuration()}</p>
              <p>عدد الدفعات: {Math.ceil(maxPosts / batchSize)}</p>
              <p>البيانات المتوقعة: {maxPosts} منشور{includeComments ? ' + التعليقات' : ''}</p>
            </div>
          </div>

          {/* تقدم التحميل */}
          {progress && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {progress.status === 'loading' ? 'جاري التحميل...' : 
                   progress.status === 'completed' ? 'تم التحميل بنجاح!' :
                   progress.status === 'error' ? 'حدث خطأ' : 'متوقف'}
                </span>
                <span className="text-sm text-gray-500">
                  {progressPercentage}%
                </span>
              </div>
              
              <Progress value={progressPercentage} className="w-full" />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">المصدر الحالي:</span>
                  <p className="font-medium truncate">{progress.currentSource}</p>
                </div>
                <div>
                  <span className="text-gray-500">الدفعة:</span>
                  <p className="font-medium">{progress.currentBatch} / {progress.totalBatches}</p>
                </div>
                <div>
                  <span className="text-gray-500">المنشورات:</span>
                  <p className="font-medium">{progress.loadedPosts}</p>
                </div>
                <div>
                  <span className="text-gray-500">التعليقات:</span>
                  <p className="font-medium">{progress.loadedComments}</p>
                </div>
              </div>

              {progress.error && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">{progress.error}</p>
                </div>
              )}
            </div>
          )}

          {/* أزرار التحكم */}
          <div className="flex gap-2 pt-4">
            {!progress || progress.status !== 'loading' ? (
              <Button 
                onClick={handleStartLoad}
                disabled={!startDate || !endDate || maxPosts < 1}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                بدء التحميل
              </Button>
            ) : (
              <Button 
                variant="destructive"
                onClick={() => {/* إيقاف التحميل */}}
                className="flex-1"
              >
                <Stop className="w-4 h-4 mr-2" />
                إيقاف التحميل
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={progress?.status === 'loading'}
            >
              {progress?.status === 'loading' ? 'جاري التحميل...' : 'إغلاق'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
