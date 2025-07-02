
export interface BulkLoadOptions {
  startDate: Date
  endDate: Date
  maxPosts: number
  includePastYear: boolean
  includeComments: boolean
  batchSize: number
}

export interface LoadProgress {
  currentBatch: number
  totalBatches: number
  loadedPosts: number
  loadedComments: number
  currentSource: string
  status: 'loading' | 'completed' | 'error' | 'paused'
  error?: string
}

export class BulkDataLoader {
  private accessToken = ""
  private isLoading = false
  private shouldStop = false
  private progress: LoadProgress = {
    currentBatch: 0,
    totalBatches: 0,
    loadedPosts: 0,
    loadedComments: 0,
    currentSource: '',
    status: 'completed'
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  // تحميل البيانات المجمعة
  async loadBulkData(
    sources: any[],
    options: BulkLoadOptions,
    onProgress?: (progress: LoadProgress) => void
  ): Promise<{ posts: any[], comments: any[], error?: string }> {
    
    if (this.isLoading) {
      throw new Error('عملية تحميل أخرى قيد التنفيذ')
    }

    this.isLoading = true
    this.shouldStop = false
    
    const allPosts: any[] = []
    const allComments: any[] = []

    try {
      // حساب إجمالي الدفعات
      const totalSources = sources.length
      const estimatedBatches = totalSources * Math.ceil(options.maxPosts / options.batchSize)
      
      this.progress = {
        currentBatch: 0,
        totalBatches: estimatedBatches,
        loadedPosts: 0,
        loadedComments: 0,
        currentSource: '',
        status: 'loading'
      }

      console.log(`بدء تحميل البيانات المجمعة من ${totalSources} مصدر`)
      console.log(`النطاق الزمني: ${options.startDate.toLocaleDateString()} - ${options.endDate.toLocaleDateString()}`)

      for (const source of sources) {
        if (this.shouldStop) {
          this.progress.status = 'paused'
          break
        }

        this.progress.currentSource = source.name
        console.log(`تحميل البيانات من: ${source.name}`)

        try {
          const sourceData = await this.loadSourceBulkData(source, options, onProgress)
          allPosts.push(...sourceData.posts)
          allComments.push(...sourceData.comments)

          this.progress.loadedPosts += sourceData.posts.length
          this.progress.loadedComments += sourceData.comments.length

          if (onProgress) {
            onProgress({ ...this.progress })
          }

          // تأخير قصير لتجنب rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000))

        } catch (error) {
          console.error(`خطأ في تحميل البيانات من ${source.name}:`, error)
          // استمرار مع المصادر الأخرى
        }
      }

      this.progress.status = 'completed'
      console.log(`تم التحميل بنجاح: ${allPosts.length} منشور، ${allComments.length} تعليق`)

      return { posts: allPosts, comments: allComments }

    } catch (error) {
      this.progress.status = 'error'
      this.progress.error = error instanceof Error ? error.message : 'خطأ غير معروف'
      throw error
    } finally {
      this.isLoading = false
    }
  }

  // تحميل البيانات من مصدر واحد
  private async loadSourceBulkData(
    source: any,
    options: BulkLoadOptions,
    onProgress?: (progress: LoadProgress) => void
  ): Promise<{ posts: any[], comments: any[] }> {
    
    const posts: any[] = []
    const comments: any[] = []
    const baseUrl = "https://graph.facebook.com/v18.0"
    
    let nextUrl: string | null = null
    let batchCount = 0
    const maxBatches = Math.ceil(options.maxPosts / options.batchSize)

    // تحويل التواريخ إلى timestamp
    const since = Math.floor(options.startDate.getTime() / 1000)
    const until = Math.floor(options.endDate.getTime() / 1000)

    do {
      if (this.shouldStop) break

      batchCount++
      this.progress.currentBatch++

      try {
        let url: string
        
        if (nextUrl) {
          url = nextUrl
        } else {
          // بناء URL للدفعة الأولى
          const endpoint = source.type === "group" ? `/${source.id}/feed` : `/${source.id}/posts`
          const fields = this.getFieldsForBulkLoad(source.type, options.includeComments)
          
          url = `${baseUrl}${endpoint}?access_token=${this.accessToken}&fields=${fields}&limit=${options.batchSize}&since=${since}&until=${until}`
        }

        console.log(`تحميل الدفعة ${batchCount}/${maxBatches} من ${source.name}`)

        const response = await fetch(url)
        
        if (!response.ok) {
          if (response.status === 400) {
            console.warn(`تم الوصول لحد البيانات المتاحة للمصدر ${source.name}`)
            break
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error.message)
        }

        const batchPosts = data.data || []
        
        // فلترة المنشورات حسب التاريخ
        const filteredPosts = batchPosts.filter((post: any) => {
          if (!post.created_time) return false
          const postDate = new Date(post.created_time)
          return postDate >= options.startDate && postDate <= options.endDate
        })

        posts.push(...filteredPosts)

        // استخراج التعليقات إذا كانت مطلوبة
        if (options.includeComments) {
          for (const post of filteredPosts) {
            if (post.comments?.data) {
              comments.push(...post.comments.data.map((comment: any) => ({
                ...comment,
                post_id: post.id,
                source_name: source.name
              })))
            }
          }
        }

        // تحديث التقدم
        if (onProgress) {
          onProgress({ ...this.progress })
        }

        // التحقق من وجود صفحة تالية
        nextUrl = data.paging?.next || null
        
        // التوقف إذا وصلنا للحد الأقصى
        if (posts.length >= options.maxPosts) {
          break
        }

        // تأخير بين الطلبات
        await new Promise(resolve => setTimeout(resolve, 1000))

      } catch (error) {
        console.error(`خطأ في الدفعة ${batchCount}:`, error)
        
        // في حالة rate limiting، انتظار أطول
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('انتظار بسبب rate limiting...')
          await new Promise(resolve => setTimeout(resolve, 30000))
          continue
        }
        
        throw error
      }

    } while (nextUrl && batchCount < maxBatches && !this.shouldStop)

    return { 
      posts: posts.slice(0, options.maxPosts),
      comments 
    }
  }

  // تحديد الحقول المطلوبة للتحميل المجمع
  private getFieldsForBulkLoad(sourceType: string, includeComments: boolean): string {
    let fields = [
      "id",
      "message",
      "full_picture",
      "created_time",
      "updated_time",
      "from{id,name,picture}",
      "reactions.summary(total_count)",
      "shares"
    ]

    if (sourceType !== "group") {
      fields.push("attachments{media,type,subattachments}")
    }

    if (includeComments) {
      fields.push("comments.limit(50){id,message,created_time,from{id,name,picture.type(large)},like_count}")
    }

    return fields.join(",")
  }

  // إيقاف التحميل
  stopLoading() {
    this.shouldStop = true
    console.log('تم طلب إيقاف التحميل...')
  }

  // الحصول على حالة التقدم
  getProgress(): LoadProgress {
    return { ...this.progress }
  }

  // التحقق من حالة التحميل
  isCurrentlyLoading(): boolean {
    return this.isLoading
  }

  // تحميل البيانات لسنة كاملة
  async loadYearData(
    sources: any[],
    year: number,
    onProgress?: (progress: LoadProgress) => void
  ): Promise<{ posts: any[], comments: any[] }> {
    
    const startDate = new Date(year, 0, 1) // 1 يناير
    const endDate = new Date(year, 11, 31, 23, 59, 59) // 31 ديسمبر

    const options: BulkLoadOptions = {
      startDate,
      endDate,
      maxPosts: 10000, // حد أقصى مرتفع للسنة الكاملة
      includePastYear: true,
      includeComments: true,
      batchSize: 100
    }

    console.log(`تحميل بيانات سنة ${year} كاملة`)
    
    return this.loadBulkData(sources, options, onProgress)
  }
}

export const bulkDataLoader = new BulkDataLoader()
