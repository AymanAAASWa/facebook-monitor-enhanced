export interface Post {
  id: string
  message?: string
  created_time?: string
  full_picture?: string
  source_id?: string
  source_name?: string
  source_type?: "group" | "page"
  from?: {
    id?: string
    name?: string
    picture?: {
      data?: {
        url?: string
      }
    }
  }
  comments?: {
    data?: Array<{
      id: string
      message?: string
      created_time?: string
      from?: {
        id?: string
        name?: string
      }
    }>
  }
  attachments?: {
    data?: Array<{
      type?: string
      media?: {
        image?: {
          src?: string
        }
        source?: string
      }
      subattachments?: {
        data?: Array<{
          type?: string
          media?: {
            image?: {
              src?: string
            }
            source?: string
          }
        }>
      }
    }>
  }
}
