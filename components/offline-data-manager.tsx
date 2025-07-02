
"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Database, 
  FileText,
  Calendar,
  Users,
  MessageSquare,
  HardDrive,
  Plus,
  Eye,
  ExternalLink
} from "lucide-react"
import { offlineStorageService, StoredDataPackage } from "@/lib/offline-storage-service"
import { bulkDataLoader } from "@/lib/bulk-data-loader"
import { notificationService } from "@/lib/notification-service"
import { toast } from "sonner"

interface OfflineDataManagerProps {
  accessToken: string
  sources: any[]
}

export function OfflineDataManager({ accessToken, sources }: OfflineDataManagerProps) {
  const [packages, setPackages] = useState<StoredDataPackage[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [loadProgress, setLoadProgress] = useState<any>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    initializeAndLoad()
  }, [])

  const initializeAndLoad = async () => {
    try {
      await offlineStorageService.initialize()
      setIsInitialized(true)
      await loadPackages()
    } catch (error) {
      console.error('فشل في تهيئة قاعدة البيانات المحلية:', error)
      toast.error('فشل في تهيئة التخزين المحلي')
    }
  }

  const loadPackages = async () => {
    try {
      const allPackages = await offlineStorageService.getAllDataPackages()
      setPackages(allPackages)
    } catch (error) {
      console.error('فشل في تحميل الحزم:', error)
      toast.error('فشل في تحميل قائمة البيانات المحفوظة')
    }
  }

  const handleBulkDownload = async (sourceId: string, sourceType: 'page' | 'group', maxPosts: number = 1000) => {
    if (!accessToken) {
      toast.error('يجب تسجيل الدخول أولاً')
      return
    }

    setLoading(true)
    setLoadProgress({ currentPage: 0, totalLoaded: 0, isComplete: false })

    try {
      bulkDataLoader.setAccessToken(accessToken)
      bulkDataLoader.setProgressCallback(setLoadProgress)

      const result = await bulkDataLoader.loadBulkData({
        sourceId,
        sourceType,
        maxPosts,
        includeComments: true,
        includeMedia: true,
        saveToOffline: true
      })

      if (result.error) {
        toast.error(`خطأ في التحميل: ${result.error}`)
      } else {
        toast.success(`تم تحميل ${result.totalLoaded} منشور بنجاح`)
        await loadPackages()
      }
    } catch (error) {
      console.error('خطأ في التحميل المتقدم:', error)
      toast.error('فشل في عملية التحميل')
    } finally {
      setLoading(false)
      setLoadProgress(null)
    }
  }

  const handleIncrementalUpdate = async (packageId: string) => {
    if (!accessToken) {
      toast.error('يجب تسجيل الدخول أولاً')
      return
    }

    setLoading(true)
    try {
      bulkDataLoader.setAccessToken(accessToken)
      const result = await bulkDataLoader.loadIncrementalUpdates(packageId)

      if (result.error) {
        toast.error(`خطأ في التحديث: ${result.error}`)
      } else {
        toast.success(`تم تحديث البيانات: ${result.newPosts.length} منشور جديد، ${result.newComments.length} تعليق جديد`)
        await loadPackages()
      }
    } catch (error) {
      console.error('خطأ في التحديث التزايدي:', error)
      toast.error('فشل في تحديث البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleExportPackage = async (packageId: string) => {
    try {
      await offlineStorageService.exportDataPackage(packageId)
      toast.success('تم تصدير البيانات بنجاح')
    } catch (error) {
      console.error('خطأ في التصدير:', error)
      toast.error('فشل في تصدير البيانات')
    }
  }

  const handleImportPackage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const packageId = await offlineStorageService.importDataPackage(file)
      toast.success('تم استيراد البيانات بنجاح')
      await loadPackages()
    } catch (error) {
      console.error('خطأ في الاستيراد:', error)
      toast.error('فشل في استيراد البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePackage = async (packageId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه البيانات؟')) return

    try {
      await offlineStorageService.deleteDataPackage(packageId)
      toast.success('تم حذف البيانات')
      await loadPackages()
    } catch (error) {
      console.error('خطأ في الحذف:', error)
      toast.error('فشل في حذف البيانات')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  }

  if (!isInitialized) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>جاري تهيئة التخزين المحلي...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      {loadProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              جاري التحميل...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>الصفحة {loadProgress.currentPage}</span>
                <span>{loadProgress.totalLoaded} منشور</span>
              </div>
              <Progress value={loadProgress.isComplete ? 100 : undefined} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="packages">البيانات المحفوظة</TabsTrigger>
          <TabsTrigger value="download">تحميل متقدم</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        {/* Saved Packages Tab */}
        <TabsContent value="packages">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>البيانات المحفوظة محلياً</CardTitle>
                  <CardDescription>إدارة البيانات المخزنة على جهازك</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={loadPackages}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    تحديث
                  </Button>
                  <Button variant="outline" asChild>
                    <label htmlFor="import-file">
                      <Upload className="w-4 h-4 mr-2" />
                      استيراد
                    </label>
                  </Button>
                  <input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={handleImportPackage}
                    className="hidden"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {packages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد بيانات محفوظة محلياً</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {packages.map((pkg) => (
                      <Card key={pkg.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold">{pkg.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                تم الإنشاء: {new Date(pkg.createdAt).toLocaleDateString('ar-EG')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                آخر تحديث: {new Date(pkg.updatedAt).toLocaleDateString('ar-EG')}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {formatFileSize(pkg.metadata.size)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-blue-600">
                                {pkg.metadata.totalPosts}
                              </div>
                              <div className="text-xs text-muted-foreground">منشور</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-green-600">
                                {pkg.metadata.totalComments}
                              </div>
                              <div className="text-xs text-muted-foreground">تعليق</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-purple-600">
                                {pkg.metadata.totalUsers}
                              </div>
                              <div className="text-xs text-muted-foreground">مستخدم</div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleIncrementalUpdate(pkg.id)}>
                              <RefreshCw className="w-3 h-3 mr-1" />
                              تحديث
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleExportPackage(pkg.id)}>
                              <Download className="w-3 h-3 mr-1" />
                              تصدير
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setSelectedPackage(pkg.id)}>
                              <Eye className="w-3 h-3 mr-1" />
                              عرض
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeletePackage(pkg.id)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              حذف
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Download Tab */}
        <TabsContent value="download">
          <Card>
            <CardHeader>
              <CardTitle>التحميل المتقدم</CardTitle>
              <CardDescription>تحميل كميات كبيرة من البيانات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sources.map((source) => (
                  <Card key={source.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{source.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {source.type === 'page' ? 'صفحة' : 'مجموعة'} • {source.id}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleBulkDownload(source.id, source.type, 500)}
                            disabled={loading}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            500 منشور
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleBulkDownload(source.id, source.type, 1000)}
                            disabled={loading}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            1000 منشور
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleBulkDownload(source.id, source.type, 2000)}
                            disabled={loading}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            2000 منشور
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات التخزين المحلي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">مسح جميع البيانات المحلية</h3>
                    <p className="text-sm text-muted-foreground">
                      سيتم حذف جميع البيانات المحفوظة على جهازك
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={async () => {
                      if (confirm('هل أنت متأكد من حذف جميع البيانات؟')) {
                        await offlineStorageService.clearAllData()
                        await loadPackages()
                        toast.success('تم مسح جميع البيانات')
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    مسح الكل
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">معلومات التخزين</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>عدد الحزم المحفوظة: {packages.length}</p>
                    <p>إجمالي المنشورات: {packages.reduce((sum, pkg) => sum + pkg.metadata.totalPosts, 0)}</p>
                    <p>إجمالي التعليقات: {packages.reduce((sum, pkg) => sum + pkg.metadata.totalComments, 0)}</p>
                    <p>الحجم التقريبي: {formatFileSize(packages.reduce((sum, pkg) => sum + pkg.metadata.size, 0))}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
