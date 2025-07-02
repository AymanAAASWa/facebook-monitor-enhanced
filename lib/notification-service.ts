
"use client"

export interface NotificationData {
  id: string
  type: 'new_post' | 'new_comment'
  title: string
  message: string
  timestamp: Date
  sourceId: string
  sourceName: string
  data?: any
}

export class NotificationService {
  private static instance: NotificationService
  private checkInterval: NodeJS.Timeout | null = null
  private lastCheckTime: Date = new Date()
  private notifications: NotificationData[] = []
  private accessToken = ""
  private sources: any[] = []
  private callbacks: ((notification: NotificationData) => void)[] = []

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // تهيئة الخدمة
  initialize(accessToken: string, sources: any[]) {
    this.accessToken = accessToken
    this.sources = sources
    this.requestNotificationPermission()
  }

  // طلب إذن التنبيهات
  private async requestNotificationPermission() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        await Notification.requestPermission()
      }
    }
  }

  // بدء مراقبة التحديثات كل 5 دقائق
  startMonitoring() {
    if (this.checkInterval) {
      this.stopMonitoring()
    }

    console.log('بدء مراقبة التحديثات كل 5 دقائق...')

    // فحص فوري
    this.checkForUpdates()

    // فحص كل 5 دقائق
    this.checkInterval = setInterval(() => {
      this.checkForUpdates()
    }, 5 * 60 * 1000)
  }

  // إيقاف المراقبة
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
      console.log('تم إيقاف مراقبة التحديثات')
    }
  }

  // فحص التحديثات الجديدة
  private async checkForUpdates() {
    if (!this.accessToken || !this.sources.length) {
      return
    }

    console.log('فحص التحديثات الجديدة...')

    for (const source of this.sources) {
      try {
        await this.checkSourceUpdates(source)
      } catch (error) {
        console.error(`خطأ في فحص التحديثات للمصدر ${source.name}:`, error)
      }
    }

    this.lastCheckTime = new Date()
  }

  // فحص تحديثات مصدر واحد
  private async checkSourceUpdates(source: any) {
    const baseUrl = "https://graph.facebook.com/v18.0"
    const since = Math.floor(this.lastCheckTime.getTime() / 1000)

    try {
      // فحص المنشورات الجديدة
      const postsResponse = await fetch(
        `${baseUrl}/${source.id}/posts?access_token=${this.accessToken}&since=${since}&fields=id,message,created_time,from{id,name}&limit=25`
      )

      if (postsResponse.ok) {
        const postsData = await postsResponse.json()

        if (postsData.data && postsData.data.length > 0) {
          for (const post of postsData.data) {
            const notification: NotificationData = {
              id: `post_${post.id}`,
              type: 'new_post',
              title: 'منشور جديد',
              message: `منشور جديد من ${post.from?.name || 'مستخدم غير معروف'} في ${source.name}`,
              timestamp: new Date(post.created_time),
              sourceId: source.id,
              sourceName: source.name,
              data: post
            }

            this.addNotification(notification)
          }
        }
      }

      // فحص التعليقات الجديدة على المنشورات الحديثة
      await this.checkRecentComments(source)

    } catch (error) {
      console.error(`خطأ في فحص المصدر ${source.name}:`, error)
    }
  }

  // فحص التعليقات الجديدة
  private async checkRecentComments(source: any) {
    const baseUrl = "https://graph.facebook.com/v18.0"

    try {
      // جلب المنشورات الحديثة أولاً
      const postsResponse = await fetch(
        `${baseUrl}/${source.id}/posts?access_token=${this.accessToken}&fields=id&limit=10`
      )

      if (postsResponse.ok) {
        const postsData = await postsResponse.json()

        for (const post of postsData.data || []) {
          const since = Math.floor(this.lastCheckTime.getTime() / 1000)

          const commentsResponse = await fetch(
            `${baseUrl}/${post.id}/comments?access_token=${this.accessToken}&since=${since}&fields=id,message,created_time,from{id,name}&limit=10`
          )

          if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json()

            if (commentsData.data && commentsData.data.length > 0) {
              for (const comment of commentsData.data) {
                const notification: NotificationData = {
                  id: `comment_${comment.id}`,
                  type: 'new_comment',
                  title: 'تعليق جديد',
                  message: `تعليق جديد من ${comment.from?.name || 'مستخدم غير معروف'} في ${source.name}`,
                  timestamp: new Date(comment.created_time),
                  sourceId: source.id,
                  sourceName: source.name,
                  data: comment
                }

                this.addNotification(notification)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('خطأ في فحص التعليقات:', error)
    }
  }

  // إضافة تنبيه جديد
  private addNotification(notification: NotificationData) {
    // تجنب التكرار
    if (this.notifications.find(n => n.id === notification.id)) {
      return
    }

    this.notifications.unshift(notification)

    // الاحتفاظ بآخر 100 تنبيه فقط
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100)
    }

    // عرض التنبيه في المتصفح
    this.showBrowserNotification(notification)

    // استدعاء callbacks
    this.callbacks.forEach(callback => callback(notification))

    // حفظ في localStorage
    this.saveNotifications()
  }

  // عرض تنبيه في المتصفح
  private showBrowserNotification(notification: NotificationData) {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/placeholder-logo.png',
        tag: notification.id
      })
    }
  }

  // إضافة مستمع للتنبيهات
  addNotificationListener(callback: (notification: NotificationData) => void) {
    this.callbacks.push(callback)
  }

  // إزالة مستمع
  removeNotificationListener(callback: (notification: NotificationData) => void) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback)
  }

  // الحصول على التنبيهات
  getNotifications(): NotificationData[] {
    return this.notifications
  }

  // مسح التنبيهات
  clearNotifications() {
    this.notifications = []
    this.saveNotifications()
  }

  // حفظ التنبيهات في localStorage
  private saveNotifications() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('facebook_notifications', JSON.stringify(this.notifications))
      }
    } catch (error) {
      console.error('خطأ في حفظ التنبيهات:', error)
    }
  }

  // تحميل التنبيهات من localStorage
  loadNotifications() {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('facebook_notifications')
        if (saved) {
          this.notifications = JSON.parse(saved).map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }))
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل التنبيهات:', error)
      this.notifications = []
    }
  }

  // الحصول على حالة المراقبة
  isMonitoring(): boolean {
    return this.checkInterval !== null
  }
}

export const notificationService = NotificationService.getInstance()
