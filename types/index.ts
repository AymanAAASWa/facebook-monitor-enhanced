export interface Post {
  id: string
  message?: string
  created_time: string
  full_picture?: string
  attachments?: {
    data: Array<{
      type: string
      media?: {
        image?: {
          src: string
        }
        source?: string
      }
      subattachments?: {
        data: Array<{
          type: string
          media?: {
            image?: {
              src: string
            }
            source?: string
          }
        }>
      }
    }>
  }
  from?: {
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
      message: string
      created_time: string
      from?: {
        id: string
        name: string
      }
    }>
  }
  permalink_url?: string
  source?: string
  source_type?: "group" | "page"
  source_name?: string
}

export interface UserData {
  id: string
  name: string
  phone?: string
  posts_count: number
  comments_count: number
  last_activity: Date
  groups: string[]
  total_score: number
}

export interface SavedPhone {
  userId: string
  userName: string
  phone: string
  discoveredAt: Date
  source: string
}

export interface FacebookSettings {
  accessToken: string
  groupIds: string[]
  pageIds: string[]
  keywordFilters: string[]
  excludeKeywords: string[]
  lastUpdated: Date
  phoneFileUrl?: string
}

export interface FileStatus {
  loaded: boolean
  fileName: string
  recordsCount: number
  fileSize: number
  indexed: boolean
}

export interface SettingsMessage {
  type: "success" | "error"
  message: string
}
