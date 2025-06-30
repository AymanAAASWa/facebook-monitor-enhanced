export class FacebookApiService {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async makeApiRequest(endpoint: string, data: any = {}) {
    const response = await fetch(`/api/facebook/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: this.accessToken,
        ...data,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}`)
    }

    return result
  }

  async testConnection(): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const result = await this.makeApiRequest("test-connection")
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async getGroupInfo(groupId: string) {
    try {
      return await this.makeApiRequest("group-info", { groupId })
    } catch (error) {
      console.error(`Error getting group info for ${groupId}:`, error)
      return {
        id: groupId,
        name: `Group ${groupId}`,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async getPageInfo(pageId: string) {
    try {
      return await this.makeApiRequest("page-info", { pageId })
    } catch (error) {
      console.error(`Error getting page info for ${pageId}:`, error)
      return {
        id: pageId,
        name: `Page ${pageId}`,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async getGroupPosts(groupId: string, limit = 25, after?: string) {
    try {
      const result = await this.makeApiRequest("group-posts", { groupId, limit, after })

      // Handle API restrictions gracefully
      if (result.error && result.data !== undefined) {
        console.warn(`Group posts access restricted for ${groupId}:`, result.error)
        return {
          data: [],
          paging: null,
          error: result.error,
          message: result.message,
          restricted: true,
        }
      }

      return result
    } catch (error) {
      console.error(`Error getting posts for group ${groupId}:`, error)
      return {
        data: [],
        paging: null,
        error: error instanceof Error ? error.message : "Unknown error",
        restricted: true,
      }
    }
  }

  async getPagePosts(pageId: string, limit = 25, after?: string) {
    try {
      const result = await this.makeApiRequest("page-posts", { pageId, limit, after })

      // Handle API restrictions gracefully
      if (result.error && result.data !== undefined) {
        console.warn(`Page posts access restricted for ${pageId}:`, result.error)
        return {
          data: [],
          paging: null,
          error: result.error,
          message: result.message,
          restricted: true,
        }
      }

      return result
    } catch (error) {
      console.error(`Error getting posts for page ${pageId}:`, error)
      return {
        data: [],
        paging: null,
        error: error instanceof Error ? error.message : "Unknown error",
        restricted: true,
      }
    }
  }

  async getPostComments(postId: string, limit = 50, after?: string) {
    try {
      return await this.makeApiRequest("post-comments", { postId, limit, after })
    } catch (error) {
      console.error(`Error getting comments for post ${postId}:`, error)
      throw error
    }
  }

  // Get user's groups (requires user_groups permission)
  async getUserGroups() {
    try {
      return await this.makeApiRequest("user-groups")
    } catch (error) {
      console.error("Error getting user groups:", error)
      return { data: [] }
    }
  }

  // Get user's pages (requires pages_show_list permission)
  async getUserPages() {
    try {
      return await this.makeApiRequest("user-pages")
    } catch (error) {
      console.error("Error getting user pages:", error)
      return { data: [] }
    }
  }
}
