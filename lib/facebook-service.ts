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
    limit = 10, // Reduced default limit
    after?: string,
  ): Promise<{ data: FacebookPost[]; nextCursor?: string; error?: string }> {
    try {
      // Simplified fields to reduce data load
      const params: Record<string, string> = {
        fields: [
          "id",
          "message",
          "created_time",
          "full_picture",
          "from{id,name,picture}",
          // Removed nested comments and attachments to reduce load
        ].join(","),
        limit: Math.min(limit, 25).toString(), // Cap at 25
      }

      if (after) {
        params.after = after
      }

      const response = await this.makeRequest<FacebookApiResponse<FacebookPost>>(`/${sourceId}/posts`, params)

      return {
        data: response.data || [],
        nextCursor: response.paging?.cursors?.after,
      }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : "Failed to fetch posts",
      }
    }
  }

  // Separate method to get comments for a specific post
  async getPostComments(postId: string, limit = 10): Promise<{ data: FacebookComment[]; error?: string }> {
    try {
      const params: Record<string, string> = {
        fields: "id,message,created_time,from{id,name}",
        limit: limit.toString(),
      }

      const response = await this.makeRequest<FacebookApiResponse<FacebookComment>>(`/${postId}/comments`, params)

      return {
        data: response.data || [],
      }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : "Failed to fetch comments",
      }
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


export const facebookService = {
  getPostsFromSources,
  // أضف هنا أي دوال أخرى تريد استخدامها
};
