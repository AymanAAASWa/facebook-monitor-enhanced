"use client"

export interface FacebookPost {
  id: string
  message?: string
  created_time: string
  full_picture?: string
  from: {
    id: string
    name: string
    picture?: {
      data: {
        url: string
      }
    }
  }
  comments?: {
    data: Array<{
      id: string
      message?: string
      created_time: string
      from: {
        id: string
        name: string
      }
    }>
    paging?: {
      next?: string
    }
  }
  attachments?: {
    data: Array<{
      type: string
      media?: {
        image?: { src: string }
        source?: string
      }
      subattachments?: {
        data: Array<{
          type: string
          media?: {
            image?: { src: string }
            source?: string
          }
        }>
      }
    }>
  }
}

export class FacebookApiService {
  private accessToken = ""
  private baseUrl = "https://graph.facebook.com/v18.0"

  setAccessToken(token: string) {
    this.accessToken = token
  }

  async validateToken(): Promise<{ valid: boolean; error?: string; userInfo?: any }> {
    try {
      const response = await fetch(`${this.baseUrl}/me?access_token=${this.accessToken}&fields=id,name,email`)
      const data = await response.json()

      if (data.error) {
        return { valid: false, error: data.error.message }
      }

      return { valid: true, userInfo: data }
    } catch (error) {
      return { valid: false, error: "Network error" }
    }
  }

  async getPosts(sourceId: string, limit = 10): Promise<{ data: FacebookPost[]; error?: string }> {
    try {
      // Simplified request with reduced data
      const postsResponse = await fetch(
        `${this.baseUrl}/${sourceId}/posts?access_token=${this.accessToken}&fields=id,message,created_time,full_picture,from{id,name,picture}&limit=${Math.min(limit, 25)}`,
      )

      const postsData = await postsResponse.json()

      if (postsData.error) {
        throw new Error(postsData.error.message)
      }

      // Fetch comments separately for only the first few posts to avoid rate limits
      const postsWithComments = await Promise.all(
        postsData.data.slice(0, Math.min(postsData.data.length, 10)).map(async (post: any, index: number) => {
          try {
            // Only fetch comments for first 5 posts to reduce load
            if (index < 5) {
              const commentsResponse = await fetch(
                `${this.baseUrl}/${post.id}/comments?access_token=${this.accessToken}&fields=id,message,created_time,from{id,name}&limit=5`,
              )
              const commentsData = await commentsResponse.json()

              return {
                ...post,
                comments: commentsData.error ? { data: [] } : commentsData,
              }
            } else {
              return {
                ...post,
                comments: { data: [] },
              }
            }
          } catch (error) {
            return {
              ...post,
              comments: { data: [] },
            }
          }
        }),
      )

      // Add remaining posts without comments
      const remainingPosts = postsData.data.slice(10).map((post: any) => ({
        ...post,
        comments: { data: [] },
      }))

      return { data: [...postsWithComments, ...remainingPosts] }
    } catch (error: any) {
      return { data: [], error: error.message }
    }
  }

  async getGroupInfo(groupId: string): Promise<{ data?: any; error?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${groupId}?access_token=${this.accessToken}&fields=id,name,description,member_count,privacy`,
      )
      const data = await response.json()

      if (data.error) {
        return { error: data.error.message }
      }

      return { data }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  async getPageInfo(pageId: string): Promise<{ data?: any; error?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${pageId}?access_token=${this.accessToken}&fields=id,name,about,fan_count,category`,
      )
      const data = await response.json()

      if (data.error) {
        return { error: data.error.message }
      }

      return { data }
    } catch (error: any) {
      return { error: error.message }
    }
  }
}
