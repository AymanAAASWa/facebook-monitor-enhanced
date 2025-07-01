interface FacebookUser {
  id: string
  name: string
  picture?: {
    data: {
      url: string
    }
  }
}

interface FacebookComment {
  id: string
  message?: string
  created_time: string
  from: FacebookUser
}

interface FacebookAttachment {
  type: string
  media?: {
    image?: {
      src: string
    }
    source?: string
  }
  subattachments?: {
    data: FacebookAttachment[]
  }
}

export interface FacebookPost {
  id: string
  message?: string
  created_time: string
  full_picture?: string
  from: FacebookUser
  comments?: {
    data: FacebookComment[]
    paging?: {
      next?: string
      previous?: string
    }
  }
  attachments?: {
    data: FacebookAttachment[]
  }
}

interface FacebookApiResponse<T> {
  data: T[]
  paging?: {
    next?: string
    previous?: string
    cursors?: {
      before: string
      after: string
    }
  }
}

export class FacebookService {
  private accessToken = ""
  private baseUrl = "https://graph.facebook.com/v18.0"

  constructor() {
    // Load access token from localStorage
    if (typeof window !== "undefined") {
      const settings = JSON.parse(localStorage.getItem("facebook_settings") || "{}")
      this.accessToken = settings.accessToken || ""
    }
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  isTokenValid(): boolean {
    return this.accessToken.length > 0
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.accessToken) {
      throw new Error("Access token is required. Please set it in settings.")
    }

    const url = new URL(`${this.baseUrl}${endpoint}`)
    url.searchParams.append("access_token", this.accessToken)

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    try {
      const response = await fetch(url.toString())

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Facebook API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Network error occurred while fetching data")
    }
  }

  async validateToken(): Promise<{ isValid: boolean; error?: string }> {
    try {
      await this.makeRequest("/me", { fields: "id,name" })
      return { isValid: true }
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : "Token validation failed",
      }
    }
  }

  async getPosts(
    sourceId: string,
    sourceType: "page" | "group" = "page",
    limit = 25,
    until?: string,
    includeComments = true,
  ): Promise<{ data: FacebookPost[]; paging?: any; error?: string }> {
    try {
      let endpoint = `/${sourceId}/posts`
      
      // Try with comments first
      let params: {
        fields: string
        limit: string
        until?: string
      } = {
        fields: [
          "id",
          "message",
          "full_picture",
          "created_time",
          "updated_time",
          "from{id,name,picture}",
          "attachments{media,type,subattachments}",
          "shares",
          includeComments ? "comments.limit(10){id,message,created_time,from{id,name,picture},like_count}" : "",
        ].filter(Boolean).join(","),
        limit: String(limit),
      }

      if (until) {
        params.until = until
      }

      try {
        const response = await this.makeRequest<{ data: FacebookPost[]; paging: any }>(endpoint, params)
        if (response.data) {
          return { data: response.data, paging: response.paging }
        }
      } catch (error: any) {
        // If request with comments fails due to rate limiting, try without comments
        if (error.message.includes("يبدو أنك كنت تسيء استخدام") || 
            error.message.includes("368") || 
            error.message.includes("rate limit")) {
          
          console.log("Rate limit hit, retrying without comments...")
          
          // Retry without comments
          params.fields = [
            "id",
            "message",
            "full_picture",
            "created_time",
            "updated_time",
            "from{id,name,picture}",
            "attachments{media,type,subattachments}",
            "shares",
          ].join(",")
          
          const retryResponse = await this.makeRequest<{ data: FacebookPost[]; paging: any }>(endpoint, params)
          
          // Add empty comments to each post
          const postsWithEmptyComments = (retryResponse.data || []).map(post => ({
            ...post,
            comments: { data: [] }
          }))
          
          return { 
            data: postsWithEmptyComments, 
            paging: retryResponse.paging,
            error: "تم جلب المنشورات بدون تعليقات بسبب حدود API"
          }
        }
        throw error
      }

      return { data: [], paging: null }
    } catch (error: any) {
      console.error("Error fetching posts:", error)
      return { data: [], error: error.message }
    }
  }

  async getPostComments(postId: string, limit = 25): Promise<{ data: FacebookComment[]; error?: string }> {
    try {
      console.log(`Fetching comments for post: ${postId}`)

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))

      const response = await fetch(
        `${this.baseUrl}/${postId}/comments?access_token=${this.accessToken}&fields=id,message,created_time,from{id,name,picture},like_count,can_reply&limit=${limit}&order=chronological`,
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Facebook API Error (${response.status}):`, errorText)
        
        // Check if it's a rate limit error
        if (errorText.includes("يبدو أنك كنت تسيء استخدام") || 
            errorText.includes("368") || 
            response.status === 400) {
          return { data: [], error: "تم الوصول لحد معدل الطلبات" }
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()

      if (result.error) {
        console.error("Facebook API returned error:", result.error)
        
        // Handle rate limiting errors gracefully
        if (result.error.code === 368) {
          return { data: [], error: "تم الوصول لحد معدل الطلبات" }
        }
        
        throw new Error(result.error.message)
      }

      console.log(`Found ${result.data?.length || 0} comments for post ${postId}`)
      return { data: result.data || [] }
    } catch (error: any) {
      console.error("Error fetching post comments:", error)
      return { data: [], error: error.message }
    }
  }

  // Separate method to get post attachments
  async getPostAttachments(postId: string): Promise<{ data: FacebookAttachment[]; error?: string }> {
    try {
      const params: Record<string, string> = {
        fields: "type,media,subattachments",
      }

      const response = await this.makeRequest<FacebookApiResponse<FacebookAttachment>>(`/${postId}/attachments`, params)

      return {
        data: response.data || [],
      }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : "Failed to fetch attachments",
      }
    }
  }

  async getGroupInfo(groupId: string): Promise<{ data?: any; error?: string }> {
    try {
      const response = await this.makeRequest(`/${groupId}`, {
        fields: "id,name,description,member_count,privacy",
      })
      return { data: response }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch group info",
      }
    }
  }

  async getPageInfo(pageId: string): Promise<{ data?: any; error?: string }> {
    try {
      const response = await this.makeRequest(`/${pageId}`, {
        fields: "id,name,about,fan_count,category",
      })
      return { data: response }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch page info",
      }
    }
  }

  async searchPosts(
    query: string,
    type: "post" | "page" | "group" = "post",
    limit = 10, // Reduced limit
  ): Promise<{ data: any[]; error?: string }> {
    try {
      const response = await this.makeRequest("/search", {
        q: query,
        type,
        limit: limit.toString(),
        fields: "id,name,message,created_time",
      })
      return { data: response.data || [] }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : "Search failed",
      }
    }
  }

  async getUserInfo(userId: string): Promise<{ data?: any; error?: string }> {
    try {
      const response = await this.makeRequest(`/${userId}`, {
        fields: "id,name,picture,location,hometown,work,education",
      })
      return { data: response }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch user info",
      }
    }
  }

  // Method to get posts with real-time updates
  async getPostsWithUpdates(sourceId: string, since?: string): Promise<{ data: FacebookPost[]; error?: string }> {
    try {
      const params: Record<string, string> = {
        fields: ["id", "message", "created_time", "full_picture", "from{id,name,picture}"].join(","),
        limit: "25", // Reduced limit
      }

      if (since) {
        params.since = since
      }

      const response = await this.makeRequest<FacebookApiResponse<FacebookPost>>(`/${sourceId}/posts`, params)

      return { data: response.data || [] }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : "Failed to fetch updated posts",
      }
    }
  }
}