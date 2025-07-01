interface FacebookUser {
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
  about?: string
  friends?: {
    data: Array<{
      id: string
      name: string
      picture?: {
        data: {
          url: string
        }
      }
    }>
  }
  posts?: {
    data: Array<any>
  }
  photos?: {
    data: Array<any>
  }
  videos?: {
    data: Array<any>
  }
  events?: {
    data: Array<any>
  }
  managed_groups?: {
    data: Array<any>
  }
}

interface FacebookPage {
  id: string
  name: string
  about?: string
  category?: string
  fan_count?: number
  followers_count?: number
  website?: string
  phone?: string
  emails?: string[]
  location?: {
    street?: string
    city?: string
    country?: string
    latitude?: number
    longitude?: number
  }
  hours?: {
    [day: string]: string
  }
  cover?: {
    source: string
  }
  picture?: {
    data: {
      url: string
    }
  }
  insights?: {
    data: Array<{
      name: string
      values: Array<{
        value: number
        end_time: string
      }>
    }>
  }
  posts?: {
    data: Array<any>
  }
  conversations?: {
    data: Array<any>
  }
  ratings?: {
    data: Array<{
      rating: number
      review_text?: string
      reviewer: {
        id: string
        name: string
      }
      created_time: string
    }>
  }
}

interface FacebookGroup {
  id: string
  name: string
  description?: string
  privacy: string
  member_count?: number
  cover?: {
    source: string
  }
  picture?: {
    data: {
      url: string
    }
  }
  admins?: {
    data: Array<{
      id: string
      name: string
    }>
  }
  members?: {
    data: Array<{
      id: string
      name: string
      administrator: boolean
    }>
  }
  posts?: {
    data: Array<any>
  }
  insights?: {
    data: Array<any>
  }
}

export class EnhancedFacebookService {
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

  // جلب معلومات المستخدم الكاملة
  async getEnhancedUserInfo(userId: string): Promise<{ data?: FacebookUser; error?: string }> {
    try {
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
        "website",
        "relationship_status",
        "religion",
        "political",
        "friends{id,name,picture}",
        "posts{id,message,created_time,likes.summary(true),comments.summary(true)}",
        "photos{id,source,created_time,name}",
        "videos{id,source,created_time,title}",
        "events{id,name,start_time,place}",
        "groups{id,name,privacy}",
      ].join(",")

      const response = await this.makeRequest<FacebookUser>(`/${userId}`, { fields })
      return { data: response }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch user info",
      }
    }
  }

  // جلب معلومات الصفحة الكاملة
  async getEnhancedPageInfo(pageId: string): Promise<{ data?: FacebookPage; error?: string }> {
    try {
      const fields = [
        "id",
        "name",
        "about",
        "category",
        "fan_count",
        "followers_count",
        "website",
        "phone",
        "emails",
        "location",
        "hours",
        "cover",
        "picture.type(large)",
        "posts{id,message,created_time,likes.summary(true),comments.summary(true),shares}",
        "conversations{id,updated_time,message_count}",
        "ratings{rating,review_text,reviewer,created_time}",
      ].join(",")

      const response = await this.makeRequest<FacebookPage>(`/${pageId}`, { fields })

      // جلب الإحصائيات إذا كانت متاحة
      try {
        const insights = await this.getPageInsights(pageId)
        if (insights.data) {
          response.insights = { data: insights.data }
        }
      } catch (error) {
        console.warn("Could not fetch page insights:", error)
      }

      return { data: response }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch page info",
      }
    }
  }

  // جلب معلومات المجموعة الكاملة
  async getEnhancedGroupInfo(groupId: string): Promise<{ data?: FacebookGroup; error?: string }> {
    try {
      const fields = [
        "id",
        "name",
        "description",
        "privacy",
        "member_count",
        "cover",
        "picture.type(large)",
        "admins{id,name}",
        "members{id,name,administrator}",
        "posts{id,message,created_time,from,likes.summary(true),comments.summary(true)}",
      ].join(",")

      const response = await this.makeRequest<FacebookGroup>(`/${groupId}`, { fields })
      return { data: response }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch group info",
      }
    }
  }

  // جلب إحصائيات الصفحة
  async getPageInsights(pageId: string): Promise<{ data?: any[]; error?: string }> {
    try {
      const metrics = [
        "page_fans",
        "page_fan_adds",
        "page_fan_removes",
        "page_impressions",
        "page_impressions_unique",
        "page_engaged_users",
        "page_post_engagements",
        "page_posts_impressions",
        "page_video_views",
        "page_views_total",
      ]

      const response = await this.makeRequest(`/${pageId}/insights`, {
        metric: metrics.join(","),
        period: "day",
        since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        until: new Date().toISOString().split("T")[0],
      })

      return { data: response.data || [] }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch page insights",
      }
    }
  }

  // جلب رسائل الصفحة
  async getPageConversations(pageId: string): Promise<{ data?: any[]; error?: string }> {
    try {
      const response = await this.makeRequest(`/${pageId}/conversations`, {
        fields: "id,updated_time,message_count,unread_count,participants,messages{id,message,from,created_time}",
        limit: "50",
      })

      return { data: response.data || [] }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch conversations",
      }
    }
  }

  // جلب تقييمات الصفحة
  async getPageRatings(pageId: string): Promise<{ data?: any[]; error?: string }> {
    try {
      const response = await this.makeRequest(`/${pageId}/ratings`, {
        fields: "rating,review_text,reviewer{id,name,picture},created_time",
        limit: "100",
      })

      return { data: response.data || [] }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch ratings",
      }
    }
  }

  // جلب أعضاء المجموعة
  async getGroupMembers(groupId: string): Promise<{ data?: any[]; error?: string }> {
    try {
      const response = await this.makeRequest(`/${groupId}/members`, {
        fields: "id,name,picture,administrator,joined_time",
        limit: "100",
      })

      return { data: response.data || [] }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch group members",
      }
    }
  }

  // جلب أصدقاء المستخدم
  async getUserFriends(userId: string): Promise<{ data?: any[]; error?: string }> {
    try {
      const response = await this.makeRequest(`/${userId}/friends`, {
        fields: "id,name,picture,location,hometown,work,education",
        limit: "100",
      })

      return { data: response.data || [] }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch friends",
      }
    }
  }

  // جلب منشورات المستخدم
  async getUserPosts(userId: string): Promise<{ data?: any[]; error?: string }> {
    try {
      const response = await this.makeRequest(`/${userId}/posts`, {
        fields: "id,message,created_time,type,link,picture,likes.summary(true),comments.summary(true),shares",
        limit: "50",
      })

      return { data: response.data || [] }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch user posts",
      }
    }
  }

  // جلب صور المستخدم
  async getUserPhotos(userId: string): Promise<{ data?: any[]; error?: string }> {
    try {
      const response = await this.makeRequest(`/${userId}/photos`, {
        fields: "id,source,created_time,name,likes.summary(true),comments.summary(true),place",
        limit: "50",
      })

      return { data: response.data || [] }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch user photos",
      }
    }
  }

  // جلب فيديوهات المستخدم
  async getUserVideos(userId: string): Promise<{ data?: any[]; error?: string }> {
    try {
      const response = await this.makeRequest(`/${userId}/videos`, {
        fields: "id,source,created_time,title,description,likes.summary(true),comments.summary(true)",
        limit: "25",
      })

      return { data: response.data || [] }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch user videos",
      }
    }
  }

  // جلب أحداث المستخدم
  async getUserEvents(userId: string): Promise<{ data?: any[]; error?: string }> {
    try {
      const response = await this.makeRequest(`/${userId}/events`, {
        fields: "id,name,description,start_time,end_time,place,attending_count,interested_count",
        limit: "25",
      })

      return { data: response.data || [] }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch user events",
      }
    }
  }

  // البحث المتقدم
  async advancedSearch(
    query: string,
    type: "user" | "page" | "group" | "event" | "place",
    filters?: {
      location?: string
      category?: string
      verified?: boolean
    },
  ): Promise<{ data?: any[]; error?: string }> {
    try {
      const params: Record<string, string> = {
        q: query,
        type,
        limit: "50",
      }

      // إضافة الفلاتر
      if (filters?.location) params.center = filters.location
      if (filters?.category) params.category = filters.category
      if (filters?.verified) params.is_verified = "true"

      // تحديد الحقول حسب النوع
      switch (type) {
        case "user":
          params.fields = "id,name,picture,location,work,education,verified"
          break
        case "page":
          params.fields = "id,name,picture,category,fan_count,verified,location"
          break
        case "group":
          params.fields = "id,name,picture,privacy,member_count"
          break
        case "event":
          params.fields = "id,name,picture,start_time,place,attending_count"
          break
        case "place":
          params.fields = "id,name,location,category,checkins"
          break
      }

      const response = await this.makeRequest("/search", params)
      return { data: response.data || [] }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : "Search failed",
      }
    }
  }
}

export const enhancedFacebookService = new EnhancedFacebookService()
