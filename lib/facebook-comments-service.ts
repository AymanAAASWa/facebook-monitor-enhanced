export interface FacebookComment {
  id: string
  message: string
  created_time: string
  from: {
    id: string
    name: string
    picture?: {
      data: {
        url: string
      }
    }
  }
  parent?: {
    id: string
  }
  can_reply?: boolean
  like_count?: number
  user_likes?: boolean
}

export interface FacebookMessage {
  id: string
  message?: string
  created_time: string
  from: {
    id: string
    name: string
  }
  to: {
    data: Array<{
      id: string
      name: string
    }>
  }
  attachments?: {
    data: Array<{
      type: string
      payload?: any
    }>
  }
}

export interface AutoReplyRule {
  id: string
  name: string
  keywords: string[]
  response: string
  enabled: boolean
  type: "comment" | "message" | "both"
  conditions: {
    exactMatch?: boolean
    caseSensitive?: boolean
    containsAll?: boolean
  }
}

export class FacebookCommentsService {
  private accessToken = ""
  private baseUrl = "https://graph.facebook.com/v18.0"

  setAccessToken(token: string) {
    this.accessToken = token
  }

  // جلب تعليقات منشور معين
  async getPostComments(postId: string, limit = 25): Promise<{ data: FacebookComment[]; error?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${postId}/comments?access_token=${this.accessToken}&fields=id,message,created_time,from{id,name,picture},parent,can_reply,like_count,user_likes&limit=${limit}&order=chronological`,
      )

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return { data: result.data || [] }
    } catch (error: any) {
      return { data: [], error: error.message }
    }
  }

  // جلب تعليقات صفحة معينة
  async getPageComments(pageId: string, limit = 50): Promise<{ data: FacebookComment[]; error?: string }> {
    try {
      // جلب منشورات الصفحة أولاً
      const postsResponse = await fetch(
        `${this.baseUrl}/${pageId}/posts?access_token=${this.accessToken}&fields=id&limit=10`,
      )

      const postsResult = await postsResponse.json()

      if (postsResult.error) {
        throw new Error(postsResult.error.message)
      }

      const allComments: FacebookComment[] = []

      // جلب تعليقات كل منشور
      for (const post of postsResult.data || []) {
        const commentsResult = await this.getPostComments(post.id, limit)
        if (commentsResult.data) {
          allComments.push(...commentsResult.data)
        }
      }

      return { data: allComments }
    } catch (error: any) {
      return { data: [], error: error.message }
    }
  }

  // الرد على تعليق
  async replyToComment(
    commentId: string,
    message: string,
  ): Promise<{ success: boolean; error?: string; commentId?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${commentId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          access_token: this.accessToken,
        }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return { success: true, commentId: result.id }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // جلب رسائل الصفحة
  async getPageMessages(pageId: string, limit = 25): Promise<{ data: FacebookMessage[]; error?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${pageId}/conversations?access_token=${this.accessToken}&fields=id,updated_time,message_count&limit=${limit}`,
      )

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error.message)
      }

      const allMessages: FacebookMessage[] = []

      // جلب رسائل كل محادثة
      for (const conversation of result.data || []) {
        const messagesResult = await this.getConversationMessages(conversation.id)
        if (messagesResult.data) {
          allMessages.push(...messagesResult.data)
        }
      }

      return { data: allMessages }
    } catch (error: any) {
      return { data: [], error: error.message }
    }
  }

  // جلب رسائل محادثة معينة
  async getConversationMessages(
    conversationId: string,
    limit = 25,
  ): Promise<{ data: FacebookMessage[]; error?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${conversationId}/messages?access_token=${this.accessToken}&fields=id,message,created_time,from,to,attachments&limit=${limit}`,
      )

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return { data: result.data || [] }
    } catch (error: any) {
      return { data: [], error: error.message }
    }
  }

  // إرسال رسالة
  async sendMessage(
    recipientId: string,
    message: string,
    pageId: string,
  ): Promise<{ success: boolean; error?: string; messageId?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${pageId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: message },
          access_token: this.accessToken,
        }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return { success: true, messageId: result.message_id }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // تحليل الرسالة للردود التلقائية
  analyzeForAutoReply(message: string, rules: AutoReplyRule[]): AutoReplyRule | null {
    const messageLower = message.toLowerCase()

    for (const rule of rules) {
      if (!rule.enabled) continue

      const keywordMatches = rule.keywords.some((keyword) => {
        const keywordToCheck = rule.conditions.caseSensitive ? keyword : keyword.toLowerCase()
        const messageToCheck = rule.conditions.caseSensitive ? message : messageLower

        if (rule.conditions.exactMatch) {
          return messageToCheck === keywordToCheck
        } else {
          return messageToCheck.includes(keywordToCheck)
        }
      })

      if (keywordMatches) {
        return rule
      }
    }

    return null
  }

  // معاينة الرد التلقائي
  previewAutoReply(message: string, template: string): string {
    // استبدال المتغيرات في القالب
    return template
      .replace(/\{user_message\}/g, message)
      .replace(/\{timestamp\}/g, new Date().toLocaleString("ar-EG"))
      .replace(/\{date\}/g, new Date().toLocaleDateString("ar-EG"))
      .replace(/\{time\}/g, new Date().toLocaleTimeString("ar-EG"))
  }
}

export const facebookCommentsService = new FacebookCommentsService()
