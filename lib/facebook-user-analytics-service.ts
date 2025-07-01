
"use client"

interface DetailedUserInfo {
  id: string
  name: string
  email?: string
  picture?: {
    data: {
      url: string
    }
  }
  birthday?: string
  hometown?: {
    name: string
  }
  location?: {
    name: string
  }
  about?: string
  education?: Array<{
    school: {
      name: string
    }
    type: string
    year?: {
      name: string
    }
  }>
  work?: Array<{
    employer: {
      name: string
    }
    position?: {
      name: string
    }
    start_date?: string
    end_date?: string
  }>
  relationship_status?: string
  religion?: string
  political?: string
  website?: string
  posts?: {
    data: any[]
  }
  photos?: {
    data: any[]
  }
  videos?: {
    data: any[]
  }
  friends?: {
    data: any[]
  }
  events?: {
    data: any[]
  }
  groups?: {
    data: any[]
  }
  pages?: {
    data: any[]
  }
}

interface UserComment {
  id: string
  message?: string
  created_time: string
  post_id: string
  post_message?: string
  like_count?: number
  user_likes?: boolean
}

interface UserAnalytics {
  user: DetailedUserInfo
  comments: UserComment[]
  totalComments: number
  totalLikes: number
  avgLikesPerComment: number
  mostActiveHours: number[]
  mostUsedWords: { word: string; count: number }[]
  activityTimeline: { date: string; comments: number; likes: number }[]
  interactionNetwork: { userId: string; name: string; interactions: number }[]
}

export class FacebookUserAnalyticsService {
  private accessToken = ""
  private baseUrl = "https://graph.facebook.com/v18.0"

  constructor() {
    if (typeof window !== "undefined") {
      const settings = JSON.parse(localStorage.getItem("facebook_settings") || "{}")
      this.accessToken = settings.accessToken || ""
    }
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.accessToken) {
      throw new Error("Access token is required")
    }

    const url = new URL(`${this.baseUrl}${endpoint}`)
    url.searchParams.append("access_token", this.accessToken)

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    const response = await fetch(url.toString())
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `API Error: ${response.status}`)
    }

    return await response.json()
  }

  // جلب بيانات المستخدم الشاملة
  async getDetailedUserInfo(userId: string): Promise<{ data?: DetailedUserInfo; error?: string }> {
    try {
      console.log(`Fetching detailed info for user: ${userId}`)

      const fields = [
        "id",
        "name",
        "email",
        "picture.type(large)",
        "birthday",
        "hometown",
        "location",
        "about",
        "education",
        "work",
        "relationship_status",
        "religion",
        "political",
        "website",
        "posts.limit(25){id,message,created_time,likes.summary(true),comments.summary(true)}",
        "photos.limit(25){id,source,created_time,likes.summary(true)}",
        "videos.limit(25){id,source,created_time,likes.summary(true)}",
        "friends.limit(100){id,name,picture}",
        "events.limit(25){id,name,start_time,place}",
        "managed_groups.limit(25){id,name,member_count}",
        "pages.limit(25){id,name,fan_count,category}"
      ].join(",")

      const response = await this.makeRequest<DetailedUserInfo>(`/${userId}`, { fields })

      return { data: response }
    } catch (error) {
      console.error("Error fetching detailed user info:", error)
      return {
        error: error instanceof Error ? error.message : "Failed to fetch user info"
      }
    }
  }

  // جلب تعليقات المستخدم من جميع المنشورات
  async getUserComments(userId: string, posts: any[]): Promise<UserComment[]> {
    const userComments: UserComment[] = []

    try {
      for (const post of posts) {
        if (post.comments?.data) {
          const postUserComments = post.comments.data
            .filter((comment: any) => comment.from?.id === userId)
            .map((comment: any) => ({
              id: comment.id,
              message: comment.message || "",
              created_time: comment.created_time,
              post_id: post.id,
              post_message: post.message?.substring(0, 100) || "",
              like_count: comment.like_count || 0,
              user_likes: comment.user_likes || false
            }))

          userComments.push(...postUserComments)
        }
      }

      // جلب تعليقات إضافية من الAPI مباشرة
      try {
        const directComments = await this.makeRequest<{ data: any[] }>(`/${userId}/comments`, {
          fields: "id,message,created_time,like_count,user_likes,post{id,message}",
          limit: "100"
        })

        if (directComments.data) {
          const additionalComments = directComments.data.map((comment: any) => ({
            id: comment.id,
            message: comment.message || "",
            created_time: comment.created_time,
            post_id: comment.post?.id || "",
            post_message: comment.post?.message?.substring(0, 100) || "",
            like_count: comment.like_count || 0,
            user_likes: comment.user_likes || false
          }))

          userComments.push(...additionalComments)
        }
      } catch (directError) {
        console.warn("Could not fetch direct comments:", directError)
      }

      // إزالة التكرارات
      const uniqueComments = userComments.filter((comment, index, self) => 
        index === self.findIndex(c => c.id === comment.id)
      )

      return uniqueComments.sort((a, b) => 
        new Date(b.created_time).getTime() - new Date(a.created_time).getTime()
      )
    } catch (error) {
      console.error("Error fetching user comments:", error)
      return []
    }
  }

  // تحليل شامل للمستخدم
  async getUserAnalytics(userId: string, posts: any[]): Promise<{ data?: UserAnalytics; error?: string }> {
    try {
      console.log(`Generating analytics for user: ${userId}`)

      // جلب بيانات المستخدم
      const userInfoResult = await this.getDetailedUserInfo(userId)
      if (userInfoResult.error || !userInfoResult.data) {
        return { error: userInfoResult.error || "Failed to get user info" }
      }

      // جلب تعليقات المستخدم
      const comments = await this.getUserComments(userId, posts)

      // حساب الإحصائيات
      const totalComments = comments.length
      const totalLikes = comments.reduce((sum, comment) => sum + (comment.like_count || 0), 0)
      const avgLikesPerComment = totalComments > 0 ? totalLikes / totalComments : 0

      // تحليل ساعات النشاط
      const hourCounts = new Array(24).fill(0)
      comments.forEach(comment => {
        const hour = new Date(comment.created_time).getHours()
        hourCounts[hour]++
      })
      const mostActiveHours = hourCounts
        .map((count, hour) => ({ hour, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(item => item.hour)

      // تحليل الكلمات الأكثر استخداماً
      const allWords = comments
        .map(comment => comment.message || "")
        .join(" ")
        .toLowerCase()
        .replace(/[^\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\s]/g, "") // Arabic text only
        .split(/\s+/)
        .filter(word => word.length > 2)

      const wordCounts: { [key: string]: number } = {}
      allWords.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1
      })

      const mostUsedWords = Object.entries(wordCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }))

      // خط زمني للنشاط
      const activityByDate: { [key: string]: { comments: number; likes: number } } = {}
      comments.forEach(comment => {
        const date = new Date(comment.created_time).toISOString().split('T')[0]
        if (!activityByDate[date]) {
          activityByDate[date] = { comments: 0, likes: 0 }
        }
        activityByDate[date].comments++
        activityByDate[date].likes += comment.like_count || 0
      })

      const activityTimeline = Object.entries(activityByDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, activity]) => ({ date, ...activity }))

      // شبكة التفاعل (المستخدمون الذين يتفاعل معهم أكثر)
      const interactionCounts: { [key: string]: { name: string; interactions: number } } = {}
      posts.forEach(post => {
        if (post.comments?.data) {
          const userCommentExists = post.comments.data.some((comment: any) => comment.from?.id === userId)
          if (userCommentExists) {
            post.comments.data.forEach((comment: any) => {
              if (comment.from?.id !== userId) {
                const otherUserId = comment.from?.id
                if (otherUserId) {
                  if (!interactionCounts[otherUserId]) {
                    interactionCounts[otherUserId] = {
                      name: comment.from?.name || "Unknown",
                      interactions: 0
                    }
                  }
                  interactionCounts[otherUserId].interactions++
                }
              }
            })
          }
        }
      })

      const interactionNetwork = Object.entries(interactionCounts)
        .sort(([,a], [,b]) => b.interactions - a.interactions)
        .slice(0, 10)
        .map(([userId, data]) => ({ userId, ...data }))

      const analytics: UserAnalytics = {
        user: userInfoResult.data,
        comments,
        totalComments,
        totalLikes,
        avgLikesPerComment,
        mostActiveHours,
        mostUsedWords,
        activityTimeline,
        interactionNetwork
      }

      return { data: analytics }
    } catch (error) {
      console.error("Error generating user analytics:", error)
      return {
        error: error instanceof Error ? error.message : "Failed to generate analytics"
      }
    }
  }

  // البحث عن مستخدمين حسب معايير مختلفة
  async searchUsers(criteria: {
    location?: string
    education?: string
    work?: string
    age_range?: string
    relationship_status?: string
    religion?: string
  }): Promise<{ data?: any[]; error?: string }> {
    try {
      // هذه الوظيفة محدودة بسبب قيود Facebook API
      // يمكن تحسينها بناءً على البيانات المتاحة
      console.log("User search functionality limited by Facebook API restrictions")
      return { data: [], error: "User search requires additional permissions" }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Search failed"
      }
    }
  }

  // تصدير بيانات المستخدم
  async exportUserData(userId: string, posts: any[]): Promise<{ data?: any; error?: string }> {
    try {
      const analyticsResult = await this.getUserAnalytics(userId, posts)
      if (analyticsResult.error) {
        return { error: analyticsResult.error }
      }

      const exportData = {
        user_info: analyticsResult.data?.user,
        comments: analyticsResult.data?.comments,
        analytics: {
          total_comments: analyticsResult.data?.totalComments,
          total_likes: analyticsResult.data?.totalLikes,
          avg_likes_per_comment: analyticsResult.data?.avgLikesPerComment,
          most_active_hours: analyticsResult.data?.mostActiveHours,
          most_used_words: analyticsResult.data?.mostUsedWords,
          activity_timeline: analyticsResult.data?.activityTimeline,
          interaction_network: analyticsResult.data?.interactionNetwork
        },
        export_date: new Date().toISOString(),
        export_source: "Facebook User Analytics Service"
      }

      return { data: exportData }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Export failed"
      }
    }
  }
}

export const facebookUserAnalyticsService = new FacebookUserAnalyticsService()
