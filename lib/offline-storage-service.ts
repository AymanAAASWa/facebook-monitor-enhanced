
export interface StoredDataPackage {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  sources: any[]
  posts: any[]
  comments: any[]
  users: any[]
  analytics: any
  metadata: {
    totalPosts: number
    totalComments: number
    totalUsers: number
    dateRange: {
      start: Date
      end: Date
    }
    size: number // بالبايت
  }
}

export interface IncrementalUpdate {
  id: string
  packageId: string
  timestamp: Date
  newPosts: any[]
  newComments: any[]
  updatedPosts: any[]
  type: 'posts' | 'comments' | 'both'
}

export class OfflineStorageService {
  private static instance: OfflineStorageService
  private db: IDBDatabase | null = null
  private dbName = 'FacebookMonitorDB'
  private dbVersion = 1

  static getInstance(): OfflineStorageService {
    if (!OfflineStorageService.instance) {
      OfflineStorageService.instance = new OfflineStorageService()
    }
    return OfflineStorageService.instance
  }

  // تهيئة قاعدة البيانات المحلية
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => {
        reject(new Error('فشل في فتح قاعدة البيانات المحلية'))
      }

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        console.log('تم تهيئة قاعدة البيانات المحلية بنجاح')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // إنشاء مخزن البيانات الرئيسي
        if (!db.objectStoreNames.contains('dataPackages')) {
          const packagesStore = db.createObjectStore('dataPackages', { keyPath: 'id' })
          packagesStore.createIndex('name', 'name', { unique: false })
          packagesStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // إنشاء مخزن التحديثات التزايدية
        if (!db.objectStoreNames.contains('incrementalUpdates')) {
          const updatesStore = db.createObjectStore('incrementalUpdates', { keyPath: 'id' })
          updatesStore.createIndex('packageId', 'packageId', { unique: false })
          updatesStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // إنشاء مخزن الإعدادات
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' })
        }
      }
    })
  }

  // حفظ حزمة بيانات جديدة
  async saveDataPackage(
    name: string,
    sources: any[],
    posts: any[],
    comments: any[],
    users: any[],
    analytics: any
  ): Promise<string> {
    
    if (!this.db) {
      await this.initialize()
    }

    const packageId = `package_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date()

    // حساب نطاق التواريخ
    const dates = posts
      .map(p => p.created_time ? new Date(p.created_time) : null)
      .filter(Boolean) as Date[]
    
    const dateRange = dates.length > 0 ? {
      start: new Date(Math.min(...dates.map(d => d.getTime()))),
      end: new Date(Math.max(...dates.map(d => d.getTime())))
    } : {
      start: now,
      end: now
    }

    // حساب الحجم التقريبي
    const dataString = JSON.stringify({ posts, comments, users, analytics })
    const size = new Blob([dataString]).size

    const dataPackage: StoredDataPackage = {
      id: packageId,
      name,
      createdAt: now,
      updatedAt: now,
      sources,
      posts,
      comments,
      users,
      analytics,
      metadata: {
        totalPosts: posts.length,
        totalComments: comments.length,
        totalUsers: users.length,
        dateRange,
        size
      }
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['dataPackages'], 'readwrite')
      const store = transaction.objectStore('dataPackages')
      
      const request = store.add(dataPackage)
      
      request.onsuccess = () => {
        console.log(`تم حفظ حزمة البيانات: ${name} (${this.formatFileSize(size)})`)
        resolve(packageId)
      }
      
      request.onerror = () => {
        reject(new Error('فشل في حفظ حزمة البيانات'))
      }
    })
  }

  // حفظ التحديث التزايدي
  async saveIncrementalUpdate(
    packageId: string,
    newPosts: any[],
    newComments: any[],
    updatedPosts: any[] = []
  ): Promise<void> {
    
    if (!this.db) {
      await this.initialize()
    }

    const updateId = `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const update: IncrementalUpdate = {
      id: updateId,
      packageId,
      timestamp: new Date(),
      newPosts,
      newComments,
      updatedPosts,
      type: newPosts.length > 0 && newComments.length > 0 ? 'both' : 
            newPosts.length > 0 ? 'posts' : 'comments'
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['incrementalUpdates', 'dataPackages'], 'readwrite')
      
      // حفظ التحديث
      const updatesStore = transaction.objectStore('incrementalUpdates')
      updatesStore.add(update)

      // تحديث الحزمة الأساسية
      const packagesStore = transaction.objectStore('dataPackages')
      const getRequest = packagesStore.get(packageId)
      
      getRequest.onsuccess = () => {
        const dataPackage = getRequest.result as StoredDataPackage
        if (dataPackage) {
          dataPackage.updatedAt = new Date()
          dataPackage.metadata.totalPosts += newPosts.length
          dataPackage.metadata.totalComments += newComments.length
          
          packagesStore.put(dataPackage)
        }
      }

      transaction.oncomplete = () => {
        console.log(`تم حفظ التحديث التزايدي: ${newPosts.length} منشور، ${newComments.length} تعليق`)
        resolve()
      }
      
      transaction.onerror = () => {
        reject(new Error('فشل في حفظ التحديث التزايدي'))
      }
    })
  }

  // جلب حزمة البيانات مع التحديثات
  async getDataPackageWithUpdates(packageId: string): Promise<{
    package: StoredDataPackage
    allPosts: any[]
    allComments: any[]
    updates: IncrementalUpdate[]
  } | null> {
    
    if (!this.db) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['dataPackages', 'incrementalUpdates'], 'readonly')
      
      // جلب الحزمة الأساسية
      const packagesStore = transaction.objectStore('dataPackages')
      const packageRequest = packagesStore.get(packageId)
      
      packageRequest.onsuccess = () => {
        const dataPackage = packageRequest.result as StoredDataPackage
        if (!dataPackage) {
          resolve(null)
          return
        }

        // جلب التحديثات
        const updatesStore = transaction.objectStore('incrementalUpdates')
        const updatesIndex = updatesStore.index('packageId')
        const updatesRequest = updatesIndex.getAll(packageId)
        
        updatesRequest.onsuccess = () => {
          const updates = updatesRequest.result as IncrementalUpdate[]
          
          // دمج البيانات
          let allPosts = [...dataPackage.posts]
          let allComments = [...dataPackage.comments]
          
          updates.forEach(update => {
            allPosts.push(...update.newPosts)
            allComments.push(...update.newComments)
            
            // تحديث المنشورات المعدلة
            update.updatedPosts.forEach(updatedPost => {
              const index = allPosts.findIndex(p => p.id === updatedPost.id)
              if (index !== -1) {
                allPosts[index] = updatedPost
              }
            })
          })

          resolve({
            package: dataPackage,
            allPosts,
            allComments,
            updates
          })
        }
      }
      
      transaction.onerror = () => {
        reject(new Error('فشل في جلب البيانات'))
      }
    })
  }

  // جلب جميع الحزم المحفوظة
  async getAllDataPackages(): Promise<StoredDataPackage[]> {
    if (!this.db) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['dataPackages'], 'readonly')
      const store = transaction.objectStore('dataPackages')
      const request = store.getAll()
      
      request.onsuccess = () => {
        const packages = request.result as StoredDataPackage[]
        // ترتيب حسب تاريخ الإنشاء (الأحدث أولاً)
        packages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        resolve(packages)
      }
      
      request.onerror = () => {
        reject(new Error('فشل في جلب قائمة الحزم'))
      }
    })
  }

  // حذف حزمة بيانات
  async deleteDataPackage(packageId: string): Promise<void> {
    if (!this.db) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['dataPackages', 'incrementalUpdates'], 'readwrite')
      
      // حذف الحزمة
      const packagesStore = transaction.objectStore('dataPackages')
      packagesStore.delete(packageId)
      
      // حذف التحديثات المرتبطة
      const updatesStore = transaction.objectStore('incrementalUpdates')
      const updatesIndex = updatesStore.index('packageId')
      const updatesRequest = updatesIndex.getAll(packageId)
      
      updatesRequest.onsuccess = () => {
        const updates = updatesRequest.result as IncrementalUpdate[]
        updates.forEach(update => {
          updatesStore.delete(update.id)
        })
      }

      transaction.oncomplete = () => {
        console.log(`تم حذف حزمة البيانات: ${packageId}`)
        resolve()
      }
      
      transaction.onerror = () => {
        reject(new Error('فشل في حذف حزمة البيانات'))
      }
    })
  }

  // تصدير حزمة البيانات كملف JSON
  async exportDataPackage(packageId: string): Promise<void> {
    const data = await this.getDataPackageWithUpdates(packageId)
    if (!data) {
      throw new Error('الحزمة غير موجودة')
    }

    const exportData = {
      package: data.package,
      posts: data.allPosts,
      comments: data.allComments,
      updates: data.updates,
      exportedAt: new Date().toISOString()
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `facebook-data-${data.package.name}-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // استيراد حزمة البيانات من ملف
  async importDataPackage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)
          
          // إنشاء حزمة جديدة من البيانات المستوردة
          const packageId = await this.saveDataPackage(
            `${data.package.name} (مستورد)`,
            data.package.sources,
            data.posts,
            data.comments,
            data.package.users,
            data.package.analytics
          )
          
          resolve(packageId)
        } catch (error) {
          reject(new Error('فشل في استيراد الملف: ملف غير صالح'))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('فشل في قراءة الملف'))
      }
      
      reader.readAsText(file)
    })
  }

  // تنسيق حجم الملف
  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  }

  // مسح جميع البيانات المحلية
  async clearAllData(): Promise<void> {
    if (!this.db) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['dataPackages', 'incrementalUpdates'], 'readwrite')
      
      transaction.objectStore('dataPackages').clear()
      transaction.objectStore('incrementalUpdates').clear()
      
      transaction.oncomplete = () => {
        console.log('تم مسح جميع البيانات المحلية')
        resolve()
      }
      
      transaction.onerror = () => {
        reject(new Error('فشل في مسح البيانات'))
      }
    })
  }
}

export const offlineStorageService = OfflineStorageService.getInstance()
