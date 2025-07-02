
"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Bell, 
  BellOff, 
  MessageSquare, 
  FileText, 
  Trash2, 
  Settings,
  Clock,
  User,
  ExternalLink,
  Play,
  Pause
} from "lucide-react"
import { notificationService, NotificationData } from "@/lib/notification-service"
import { toast } from "sonner"

interface NotificationsPanelProps {
  accessToken: string
  sources: any[]
  isEnabled?: boolean
  onToggle?: (enabled: boolean) => void
}

export function NotificationsPanel({ 
  accessToken, 
  sources, 
  isEnabled = false, 
  onToggle 
}: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [monitoring, setMonitoring] = useState(false)
  const [settings, setSettings] = useState({
    enabled: isEnabled,
    sound: true,
    desktop: true,
    interval: 5 // minutes
  })

  useEffect(() => {
    // تحميل التنبيهات المحفوظة
    notificationService.loadNotifications()
    setNotifications(notificationService.getNotifications())

    // إضافة مستمع للتنبيهات الجديدة
    const handleNewNotification = (notification: NotificationData) => {
      setNotifications(prev => [notification, ...prev])
      
      // عرض تنبيه في التطبيق
      toast.info(notification.title, {
        description: notification.message,
        action: {
          label: "عرض",
          onClick: () => {
            // يمكن إضافة منطق للانتقال إلى المصدر
            console.log('Navigate to source:', notification.sourceId)
          }
        }
      })
    }

    notificationService.addNotificationListener(handleNewNotification)

    return () => {
      notificationService.removeNotificationListener(handleNewNotification)
    }
  }, [])

  useEffect(() => {
    if (settings.enabled && accessToken && sources.length > 0) {
      startMonitoring()
    } else {
      stopMonitoring()
    }
  }, [settings.enabled, accessToken, sources])

  const startMonitoring = () => {
    if (!accessToken) {
      toast.error('يجب تسجيل الدخول لبدء المراقبة')
      return
    }

    if (sources.length === 0) {
      toast.error('يجب إضافة مصادر للمراقبة')
      return
    }

    notificationService.initialize(accessToken, sources)
    notificationService.startMonitoring()
    setMonitoring(true)
    toast.success('تم بدء مراقبة التحديثات (كل 5 دقائق)')
  }

  const stopMonitoring = () => {
    notificationService.stopMonitoring()
    setMonitoring(false)
    if (settings.enabled) {
      toast.info('تم إيقاف مراقبة التحديثات')
    }
  }

  const toggleMonitoring = () => {
    const newEnabled = !settings.enabled
    setSettings(prev => ({ ...prev, enabled: newEnabled }))
    onToggle?.(newEnabled)
  }

  const clearAllNotifications = () => {
    notificationService.clearNotifications()
    setNotifications([])
    toast.success('تم مسح جميع التنبيهات')
  }

  const formatTimeAgo = (timestamp: Date): string => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'الآن'
    if (minutes < 60) return `منذ ${minutes} دقيقة`
    if (hours < 24) return `منذ ${hours} ساعة`
    return `منذ ${days} يوم`
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_post':
        return <FileText className="w-4 h-4 text-blue-500" />
      case 'new_comment':
        return <MessageSquare className="w-4 h-4 text-green-500" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {monitoring ? (
                <Bell className="w-5 h-5 text-green-500" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-400" />
              )}
              <CardTitle>تنبيهات التحديثات</CardTitle>
              {monitoring && (
                <Badge variant="outline" className="text-green-600">
                  نشط
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">المراقبة كل 5 دقائق</span>
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={toggleMonitoring}
                />
              </div>
              {monitoring ? (
                <Button variant="outline" size="sm" onClick={stopMonitoring}>
                  <Pause className="w-4 h-4 mr-2" />
                  إيقاف
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={startMonitoring}>
                  <Play className="w-4 h-4 mr-2" />
                  بدء
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">
                {notifications.filter(n => n.type === 'new_post').length}
              </div>
              <div className="text-sm text-muted-foreground">منشورات جديدة</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-lg font-semibold text-green-600">
                {notifications.filter(n => n.type === 'new_comment').length}
              </div>
              <div className="text-sm text-muted-foreground">تعليقات جديدة</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-lg font-semibold text-purple-600">
                {sources.length}
              </div>
              <div className="text-sm text-muted-foreground">مصادر مراقبة</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>التنبيهات الأخيرة</CardTitle>
              <CardDescription>
                آخر {notifications.length} تنبيه
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              مسح الكل
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد تنبيهات</p>
                <p className="text-sm">
                  {monitoring ? 'ستظهر التنبيهات هنا عند وجود تحديثات جديدة' : 'قم بتفعيل المراقبة لاستقبال التنبيهات'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <Card key={notification.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm">{notification.title}</h4>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {notification.sourceName}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                // يمكن إضافة منطق للانتقال إلى المصدر
                                window.open(`https://facebook.com/${notification.sourceId}`, '_blank')
                              }}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              عرض في فيسبوك
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Monitored Sources */}
      <Card>
        <CardHeader>
          <CardTitle>المصادر المراقبة</CardTitle>
          <CardDescription>
            المصادر التي يتم مراقبتها للتحديثات الجديدة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sources.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                لا توجد مصادر مضافة للمراقبة
              </p>
            ) : (
              sources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4" />
                    <div>
                      <div className="font-medium">{source.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {source.type === 'page' ? 'صفحة' : 'مجموعة'} • {source.id}
                      </div>
                    </div>
                  </div>
                  <Badge variant={monitoring ? "default" : "secondary"}>
                    {monitoring ? 'نشط' : 'متوقف'}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
