export interface ProcessedUser {
  id: string
  name: string
  postCount: number
  commentCount: number
  lastActivity: string
  sources: string[]
}

export interface Analytics {
  totalPosts: number
  totalComments: number
  totalUsers: number
  sourceCounts: { [key: string]: number }
  topUsers: Array<{
    id: string
    name: string
    activity: number
  }>
  activityByHour: { [key: string]: number }
  activityByDay: { [key: string]: number }
  mediaStats: {
    images: number
    videos: number
    totalMedia: number
  }
}

export interface AppData {
  posts: any[]
  users: Map<string, ProcessedUser>
  analytics: Analytics
}

export function processFacebookData(posts: any[]): AppData {
  const users = new Map<string, ProcessedUser>()
  const sourceCounts: { [key: string]: number } = {}
  const activityByHour: { [key: string]: number } = {}
  const activityByDay: { [key: string]: number } = {}
  const mediaStats = { images: 0, videos: 0, totalMedia: 0 }
  let totalComments = 0

  posts.forEach((post) => {
    // Process source counts
    const sourceName = post.source_name || "Unknown"
    sourceCounts[sourceName] = (sourceCounts[sourceName] || 0) + 1

    // Process time-based analytics
    if (post.created_time) {
      const date = new Date(post.created_time)
      const hour = date.getHours().toString()
      const day = date.toLocaleDateString("ar-EG", { weekday: "long" })

      activityByHour[hour] = (activityByHour[hour] || 0) + 1
      activityByDay[day] = (activityByDay[day] || 0) + 1
    }

    // Process media
    if (post.full_picture) {
      mediaStats.images++
      mediaStats.totalMedia++
    }

    if (post.attachments?.data) {
      post.attachments.data.forEach((attachment: any) => {
        if (attachment.type === "photo") {
          mediaStats.images++
          mediaStats.totalMedia++
        } else if (attachment.type === "video_inline") {
          mediaStats.videos++
          mediaStats.totalMedia++
        }
      })
    }

    // Process post author
    if (post.from?.id) {
      const userId = post.from.id
      const existingUser = users.get(userId) || {
        id: userId,
        name: post.from.name || "Unknown",
        postCount: 0,
        commentCount: 0,
        lastActivity: post.created_time,
        sources: [],
      }

      existingUser.postCount++
      if (!existingUser.sources.includes(sourceName)) {
        existingUser.sources.push(sourceName)
      }

      users.set(userId, existingUser)
    }

    // Process comments
    if (post.comments?.data) {
      totalComments += post.comments.data.length

      post.comments.data.forEach((comment: any) => {
        if (comment.from?.id) {
          const userId = comment.from.id
          const existingUser = users.get(userId) || {
            id: userId,
            name: comment.from.name || "Unknown",
            postCount: 0,
            commentCount: 0,
            lastActivity: comment.created_time,
            sources: [],
          }

          existingUser.commentCount++
          if (!existingUser.sources.includes(sourceName)) {
            existingUser.sources.push(sourceName)
          }

          users.set(userId, existingUser)
        }
      })
    }
  })

  const totalReactions = posts.reduce((sum, post) => {
      return sum + (post.reactions?.summary?.total_count || 0)
    }, 0)

  // Calculate top users
  const topUsers = Array.from(users.values())
    .map((user) => ({
      id: user.id,
      name: user.name,
      activity: user.postCount + user.commentCount,
    }))
    .sort((a, b) => b.activity - a.activity)
    .slice(0, 10)

  const analytics: Analytics = {
    totalPosts: posts.length,
    totalComments,
    totalUsers: users.size,
    sourceCounts,
    topUsers,
    activityByHour,
    activityByDay,
    mediaStats,
  }

  return {
    posts,
    users,
    analytics,
  }
}