import { db } from "./firebase"
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from "firebase/firestore"

export interface EnhancedUserRecord {
  id: string
  name: string
  email?: string
  phone?: string
  picture?: string

  // Personal Information
  birthday?: string
  hometown?: string
  location?: string
  about?: string
  relationship_status?: string
  religion?: string
  political?: string
  website?: string

  // Work & Education
  work?: Array<{
    employer: string
    position: string
    start_date?: string
    end_date?: string
  }>
  education?: Array<{
    school: string
    type: string
    year?: string
  }>

  // Social Stats
  friends_count?: number
  posts_count?: number
  photos_count?: number
  videos_count?: number

  // Engagement Stats
  total_likes?: number
  total_comments?: number
  total_shares?: number
  engagement_rate?: number
  influence_score?: number

  // Activity Data
  last_active?: Date
  most_active_day?: string
  most_active_hour?: number

  // Source Information
  source: string
  source_type: "user" | "page" | "group" | "comment"
  discovered_date: Date
  last_updated: Date

  // Tags and Categories
  tags?: string[]
  category?: string
  notes?: string

  // Privacy and Status
  is_verified?: boolean
  is_active?: boolean
  privacy_level?: "public" | "friends" | "private"
}

export interface EnhancedPageRecord {
  id: string
  name: string
  category?: string
  about?: string

  // Contact Information
  website?: string
  phone?: string
  emails?: string[]

  // Location
  address?: string
  city?: string
  country?: string
  latitude?: number
  longitude?: number

  // Business Hours
  hours?: { [day: string]: string }

  // Social Stats
  fan_count?: number
  followers_count?: number
  checkins_count?: number

  // Content Stats
  posts_count?: number
  photos_count?: number
  videos_count?: number

  // Engagement Stats
  total_likes?: number
  total_comments?: number
  total_shares?: number
  average_engagement?: number

  // Reviews and Ratings
  average_rating?: number
  total_reviews?: number

  // Insights Data
  page_impressions?: number
  page_reach?: number
  page_engaged_users?: number

  // Source Information
  source: string
  discovered_date: Date
  last_updated: Date

  // Media
  picture?: string
  cover_photo?: string

  // Tags and Notes
  tags?: string[]
  notes?: string

  // Status
  is_verified?: boolean
  is_active?: boolean
}

export interface EnhancedGroupRecord {
  id: string
  name: string
  description?: string
  privacy: "public" | "closed" | "secret"

  // Member Information
  member_count?: number
  admin_count?: number

  // Content Stats
  posts_count?: number
  photos_count?: number

  // Engagement Stats
  total_likes?: number
  total_comments?: number
  average_engagement?: number

  // Activity Data
  most_active_members?: Array<{
    id: string
    name: string
    posts_count: number
    engagement_score: number
  }>

  // Source Information
  source: string
  discovered_date: Date
  last_updated: Date

  // Media
  picture?: string
  cover_photo?: string

  // Tags and Notes
  tags?: string[]
  notes?: string

  // Status
  is_active?: boolean
}

export interface EnhancedCommentRecord {
  id: string
  message: string
  created_time: Date

  // Author Information
  author_id: string
  author_name: string
  author_picture?: string

  // Post Information
  post_id: string
  post_message?: string
  post_author?: string

  // Engagement
  likes_count?: number
  replies_count?: number

  // Sentiment Analysis
  sentiment?: "positive" | "negative" | "neutral" | "mixed"
  sentiment_score?: number

  // Source Information
  source: string
  source_type: "page" | "group" | "user"
  discovered_date: Date

  // Tags and Categories
  tags?: string[]
  category?: string
  is_spam?: boolean
  is_important?: boolean

  // Response Status
  is_responded?: boolean
  response_date?: Date
  response_by?: string
}

export class FirebaseEnhancedService {
  // Enhanced User Management
  async saveEnhancedUser(user: EnhancedUserRecord): Promise<void> {
    try {
      const userRef = doc(db, "enhanced_users", user.id)
      await setDoc(
        userRef,
        {
          ...user,
          last_updated: serverTimestamp(),
        },
        { merge: true },
      )
    } catch (error) {
      console.error("Error saving enhanced user:", error)
      throw error
    }
  }

  async getEnhancedUser(userId: string): Promise<EnhancedUserRecord | null> {
    try {
      const userRef = doc(db, "enhanced_users", userId)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const data = userSnap.data()
        return {
          ...data,
          discovered_date: data.discovered_date?.toDate(),
          last_updated: data.last_updated?.toDate(),
          last_active: data.last_active?.toDate(),
        } as EnhancedUserRecord
      }

      return null
    } catch (error) {
      console.error("Error getting enhanced user:", error)
      throw error
    }
  }

  async searchEnhancedUsers(filters: {
    source?: string
    source_type?: string
    category?: string
    is_active?: boolean
    min_engagement?: number
    tags?: string[]
    location?: string
  }): Promise<EnhancedUserRecord[]> {
    try {
      // Start with a simple query to avoid composite index requirements
      let q = query(collection(db, "enhanced_users"), limit(200))

      // Apply only one where clause at a time to avoid composite index issues
      if (filters.source_type && filters.source_type !== "all") {
        q = query(collection(db, "enhanced_users"), where("source_type", "==", filters.source_type), limit(200))
      } else if (filters.source) {
        q = query(collection(db, "enhanced_users"), where("source", "==", filters.source), limit(200))
      } else if (filters.category) {
        q = query(collection(db, "enhanced_users"), where("category", "==", filters.category), limit(200))
      } else if (filters.is_active !== undefined) {
        q = query(collection(db, "enhanced_users"), where("is_active", "==", filters.is_active), limit(200))
      } else if (filters.location) {
        q = query(collection(db, "enhanced_users"), where("location", "==", filters.location), limit(200))
      }

      const querySnapshot = await getDocs(q)
      let users: EnhancedUserRecord[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        users.push({
          ...data,
          discovered_date: data.discovered_date?.toDate(),
          last_updated: data.last_updated?.toDate(),
          last_active: data.last_active?.toDate(),
        } as EnhancedUserRecord)
      })

      // Apply client-side filtering for remaining conditions
      if (filters.min_engagement) {
        users = users.filter((user) => (user.engagement_rate || 0) >= filters.min_engagement)
      }

      if (filters.tags && filters.tags.length > 0) {
        users = users.filter((user) => user.tags && user.tags.some((tag) => filters.tags!.includes(tag)))
      }

      // Apply additional filters client-side
      if (filters.source && filters.source_type && filters.source_type !== "all") {
        users = users.filter((user) => user.source === filters.source)
      }

      if (filters.category && filters.source_type && filters.source_type !== "all") {
        users = users.filter((user) => user.category === filters.category)
      }

      if (filters.is_active !== undefined && (filters.source_type || filters.source || filters.category)) {
        users = users.filter((user) => user.is_active === filters.is_active)
      }

      if (filters.location && (filters.source_type || filters.source || filters.category)) {
        users = users.filter((user) => user.location === filters.location)
      }

      // Sort by last_updated (client-side)
      users.sort((a, b) => {
        const dateA = a.last_updated ? new Date(a.last_updated).getTime() : 0
        const dateB = b.last_updated ? new Date(b.last_updated).getTime() : 0
        return dateB - dateA
      })

      return users.slice(0, 100) // Limit to 100 results
    } catch (error) {
      console.error("Error searching enhanced users:", error)
      throw error
    }
  }

  // Enhanced Page Management
  async saveEnhancedPage(page: EnhancedPageRecord): Promise<void> {
    try {
      const pageRef = doc(db, "enhanced_pages", page.id)
      await setDoc(
        pageRef,
        {
          ...page,
          last_updated: serverTimestamp(),
        },
        { merge: true },
      )
    } catch (error) {
      console.error("Error saving enhanced page:", error)
      throw error
    }
  }

  async getEnhancedPage(pageId: string): Promise<EnhancedPageRecord | null> {
    try {
      const pageRef = doc(db, "enhanced_pages", pageId)
      const pageSnap = await getDoc(pageRef)

      if (pageSnap.exists()) {
        const data = pageSnap.data()
        return {
          ...data,
          discovered_date: data.discovered_date?.toDate(),
          last_updated: data.last_updated?.toDate(),
        } as EnhancedPageRecord
      }

      return null
    } catch (error) {
      console.error("Error getting enhanced page:", error)
      throw error
    }
  }

  async searchEnhancedPages(filters: {
    category?: string
    city?: string
    country?: string
    min_followers?: number
    min_rating?: number
    is_verified?: boolean
    tags?: string[]
  }): Promise<EnhancedPageRecord[]> {
    try {
      // Start with a simple query
      let q = query(collection(db, "enhanced_pages"), limit(200))

      // Apply only one where clause at a time
      if (filters.category) {
        q = query(collection(db, "enhanced_pages"), where("category", "==", filters.category), limit(200))
      } else if (filters.city) {
        q = query(collection(db, "enhanced_pages"), where("city", "==", filters.city), limit(200))
      } else if (filters.country) {
        q = query(collection(db, "enhanced_pages"), where("country", "==", filters.country), limit(200))
      } else if (filters.is_verified !== undefined) {
        q = query(collection(db, "enhanced_pages"), where("is_verified", "==", filters.is_verified), limit(200))
      }

      const querySnapshot = await getDocs(q)
      let pages: EnhancedPageRecord[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        pages.push({
          ...data,
          discovered_date: data.discovered_date?.toDate(),
          last_updated: data.last_updated?.toDate(),
        } as EnhancedPageRecord)
      })

      // Apply client-side filtering for remaining conditions
      if (filters.min_followers) {
        pages = pages.filter((page) => (page.followers_count || 0) >= filters.min_followers)
      }

      if (filters.min_rating) {
        pages = pages.filter((page) => (page.average_rating || 0) >= filters.min_rating)
      }

      if (filters.tags && filters.tags.length > 0) {
        pages = pages.filter((page) => page.tags && page.tags.some((tag) => filters.tags!.includes(tag)))
      }

      // Apply additional client-side filters
      if (filters.category && (filters.city || filters.country || filters.is_verified !== undefined)) {
        pages = pages.filter((page) => page.category === filters.category)
      }

      if (filters.city && (filters.category || filters.country || filters.is_verified !== undefined)) {
        pages = pages.filter((page) => page.city === filters.city)
      }

      if (filters.country && (filters.category || filters.city || filters.is_verified !== undefined)) {
        pages = pages.filter((page) => page.country === filters.country)
      }

      if (filters.is_verified !== undefined && (filters.category || filters.city || filters.country)) {
        pages = pages.filter((page) => page.is_verified === filters.is_verified)
      }

      // Sort by last_updated (client-side)
      pages.sort((a, b) => {
        const dateA = a.last_updated ? new Date(a.last_updated).getTime() : 0
        const dateB = b.last_updated ? new Date(b.last_updated).getTime() : 0
        return dateB - dateA
      })

      return pages.slice(0, 100)
    } catch (error) {
      console.error("Error searching enhanced pages:", error)
      throw error
    }
  }

  // Enhanced Group Management
  async saveEnhancedGroup(group: EnhancedGroupRecord): Promise<void> {
    try {
      const groupRef = doc(db, "enhanced_groups", group.id)
      await setDoc(
        groupRef,
        {
          ...group,
          last_updated: serverTimestamp(),
        },
        { merge: true },
      )
    } catch (error) {
      console.error("Error saving enhanced group:", error)
      throw error
    }
  }

  async getEnhancedGroup(groupId: string): Promise<EnhancedGroupRecord | null> {
    try {
      const groupRef = doc(db, "enhanced_groups", groupId)
      const groupSnap = await getDoc(groupRef)

      if (groupSnap.exists()) {
        const data = groupSnap.data()
        return {
          ...data,
          discovered_date: data.discovered_date?.toDate(),
          last_updated: data.last_updated?.toDate(),
        } as EnhancedGroupRecord
      }

      return null
    } catch (error) {
      console.error("Error getting enhanced group:", error)
      throw error
    }
  }

  async searchEnhancedGroups(filters: {
    privacy?: string
    min_members?: number
    is_active?: boolean
    tags?: string[]
  }): Promise<EnhancedGroupRecord[]> {
    try {
      let q = query(collection(db, "enhanced_groups"), limit(200))

      // Apply only one where clause at a time
      if (filters.privacy) {
        q = query(collection(db, "enhanced_groups"), where("privacy", "==", filters.privacy), limit(200))
      } else if (filters.is_active !== undefined) {
        q = query(collection(db, "enhanced_groups"), where("is_active", "==", filters.is_active), limit(200))
      }

      const querySnapshot = await getDocs(q)
      let groups: EnhancedGroupRecord[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        groups.push({
          ...data,
          discovered_date: data.discovered_date?.toDate(),
          last_updated: data.last_updated?.toDate(),
        } as EnhancedGroupRecord)
      })

      // Apply client-side filtering
      if (filters.min_members) {
        groups = groups.filter((group) => (group.member_count || 0) >= filters.min_members)
      }

      if (filters.tags && filters.tags.length > 0) {
        groups = groups.filter((group) => group.tags && group.tags.some((tag) => filters.tags!.includes(tag)))
      }

      // Apply additional client-side filters
      if (filters.privacy && filters.is_active !== undefined) {
        groups = groups.filter((group) => group.is_active === filters.is_active)
      }

      if (filters.is_active !== undefined && filters.privacy) {
        groups = groups.filter((group) => group.privacy === filters.privacy)
      }

      // Sort by last_updated (client-side)
      groups.sort((a, b) => {
        const dateA = a.last_updated ? new Date(a.last_updated).getTime() : 0
        const dateB = b.last_updated ? new Date(b.last_updated).getTime() : 0
        return dateB - dateA
      })

      return groups.slice(0, 100)
    } catch (error) {
      console.error("Error searching enhanced groups:", error)
      throw error
    }
  }

  // Enhanced Comment Management
  async saveEnhancedComment(comment: EnhancedCommentRecord): Promise<void> {
    try {
      const commentRef = doc(db, "enhanced_comments", comment.id)
      await setDoc(
        commentRef,
        {
          ...comment,
          created_time: Timestamp.fromDate(comment.created_time),
          discovered_date: Timestamp.fromDate(comment.discovered_date),
          response_date: comment.response_date ? Timestamp.fromDate(comment.response_date) : null,
        },
        { merge: true },
      )
    } catch (error) {
      console.error("Error saving enhanced comment:", error)
      throw error
    }
  }

  async getEnhancedComments(filters: {
    post_id?: string
    author_id?: string
    source?: string
    sentiment?: string
    is_responded?: boolean
    is_important?: boolean
    limit?: number
  }): Promise<EnhancedCommentRecord[]> {
    try {
      let q = query(collection(db, "enhanced_comments"), limit(filters.limit || 100))

      // Apply only one where clause at a time
      if (filters.post_id) {
        q = query(
          collection(db, "enhanced_comments"),
          where("post_id", "==", filters.post_id),
          limit(filters.limit || 100),
        )
      } else if (filters.author_id) {
        q = query(
          collection(db, "enhanced_comments"),
          where("author_id", "==", filters.author_id),
          limit(filters.limit || 100),
        )
      } else if (filters.source) {
        q = query(
          collection(db, "enhanced_comments"),
          where("source", "==", filters.source),
          limit(filters.limit || 100),
        )
      } else if (filters.sentiment) {
        q = query(
          collection(db, "enhanced_comments"),
          where("sentiment", "==", filters.sentiment),
          limit(filters.limit || 100),
        )
      } else if (filters.is_responded !== undefined) {
        q = query(
          collection(db, "enhanced_comments"),
          where("is_responded", "==", filters.is_responded),
          limit(filters.limit || 100),
        )
      } else if (filters.is_important !== undefined) {
        q = query(
          collection(db, "enhanced_comments"),
          where("is_important", "==", filters.is_important),
          limit(filters.limit || 100),
        )
      }

      const querySnapshot = await getDocs(q)
      let comments: EnhancedCommentRecord[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        comments.push({
          ...data,
          created_time: data.created_time?.toDate(),
          discovered_date: data.discovered_date?.toDate(),
          response_date: data.response_date?.toDate(),
        } as EnhancedCommentRecord)
      })

      // Apply client-side filtering for remaining conditions
      if (
        filters.post_id &&
        (filters.author_id ||
          filters.source ||
          filters.sentiment ||
          filters.is_responded !== undefined ||
          filters.is_important !== undefined)
      ) {
        comments = comments.filter((comment) => comment.post_id === filters.post_id)
      }

      if (
        filters.author_id &&
        (filters.post_id ||
          filters.source ||
          filters.sentiment ||
          filters.is_responded !== undefined ||
          filters.is_important !== undefined)
      ) {
        comments = comments.filter((comment) => comment.author_id === filters.author_id)
      }

      if (
        filters.source &&
        (filters.post_id ||
          filters.author_id ||
          filters.sentiment ||
          filters.is_responded !== undefined ||
          filters.is_important !== undefined)
      ) {
        comments = comments.filter((comment) => comment.source === filters.source)
      }

      if (
        filters.sentiment &&
        (filters.post_id ||
          filters.author_id ||
          filters.source ||
          filters.is_responded !== undefined ||
          filters.is_important !== undefined)
      ) {
        comments = comments.filter((comment) => comment.sentiment === filters.sentiment)
      }

      if (
        filters.is_responded !== undefined &&
        (filters.post_id ||
          filters.author_id ||
          filters.source ||
          filters.sentiment ||
          filters.is_important !== undefined)
      ) {
        comments = comments.filter((comment) => comment.is_responded === filters.is_responded)
      }

      if (
        filters.is_important !== undefined &&
        (filters.post_id ||
          filters.author_id ||
          filters.source ||
          filters.sentiment ||
          filters.is_responded !== undefined)
      ) {
        comments = comments.filter((comment) => comment.is_important === filters.is_important)
      }

      // Sort by created_time (client-side)
      comments.sort((a, b) => {
        const dateA = a.created_time ? new Date(a.created_time).getTime() : 0
        const dateB = b.created_time ? new Date(b.created_time).getTime() : 0
        return dateB - dateA
      })

      return comments
    } catch (error) {
      console.error("Error getting enhanced comments:", error)
      throw error
    }
  }

  // Analytics and Reporting
  async getAnalyticsSummary(): Promise<{
    total_users: number
    total_pages: number
    total_groups: number
    total_comments: number
    active_users: number
    verified_pages: number
    high_engagement_users: number
    unresponded_comments: number
    recent_activity: number
  }> {
    try {
      const [usersSnap, pagesSnap, groupsSnap, commentsSnap] = await Promise.all([
        getDocs(query(collection(db, "enhanced_users"), limit(1000))),
        getDocs(query(collection(db, "enhanced_pages"), limit(1000))),
        getDocs(query(collection(db, "enhanced_groups"), limit(1000))),
        getDocs(query(collection(db, "enhanced_comments"), limit(1000))),
      ])

      let activeUsers = 0
      let highEngagementUsers = 0
      usersSnap.forEach((doc) => {
        const data = doc.data()
        if (data.is_active) activeUsers++
        if (data.engagement_rate && data.engagement_rate > 50) highEngagementUsers++
      })

      let verifiedPages = 0
      pagesSnap.forEach((doc) => {
        const data = doc.data()
        if (data.is_verified) verifiedPages++
      })

      let unrespondedComments = 0
      let recentActivity = 0
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

      commentsSnap.forEach((doc) => {
        const data = doc.data()
        if (!data.is_responded) unrespondedComments++
        if (data.created_time?.toDate() > weekAgo) recentActivity++
      })

      return {
        total_users: usersSnap.size,
        total_pages: pagesSnap.size,
        total_groups: groupsSnap.size,
        total_comments: commentsSnap.size,
        active_users: activeUsers,
        verified_pages: verifiedPages,
        high_engagement_users: highEngagementUsers,
        unresponded_comments: unrespondedComments,
        recent_activity: recentActivity,
      }
    } catch (error) {
      console.error("Error getting analytics summary:", error)
      throw error
    }
  }

  // Bulk Operations
  async bulkSaveUsers(users: EnhancedUserRecord[]): Promise<void> {
    try {
      const batch = []
      for (const user of users) {
        batch.push(this.saveEnhancedUser(user))
        if (batch.length >= 10) {
          await Promise.all(batch)
          batch.length = 0
        }
      }
      if (batch.length > 0) {
        await Promise.all(batch)
      }
    } catch (error) {
      console.error("Error bulk saving users:", error)
      throw error
    }
  }

  async bulkSavePages(pages: EnhancedPageRecord[]): Promise<void> {
    try {
      const batch = []
      for (const page of pages) {
        batch.push(this.saveEnhancedPage(page))
        if (batch.length >= 10) {
          await Promise.all(batch)
          batch.length = 0
        }
      }
      if (batch.length > 0) {
        await Promise.all(batch)
      }
    } catch (error) {
      console.error("Error bulk saving pages:", error)
      throw error
    }
  }

  async bulkSaveComments(comments: EnhancedCommentRecord[]): Promise<void> {
    try {
      const batch = []
      for (const comment of comments) {
        batch.push(this.saveEnhancedComment(comment))
        if (batch.length >= 10) {
          await Promise.all(batch)
          batch.length = 0
        }
      }
      if (batch.length > 0) {
        await Promise.all(batch)
      }
    } catch (error) {
      console.error("Error bulk saving comments:", error)
      throw error
    }
  }

  // Real-time Updates
  subscribeToUsers(callback: (users: EnhancedUserRecord[]) => void): () => void {
    const q = query(collection(db, "enhanced_users"), limit(50))

    return onSnapshot(q, (snapshot) => {
      const users: EnhancedUserRecord[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        users.push({
          ...data,
          discovered_date: data.discovered_date?.toDate(),
          last_updated: data.last_updated?.toDate(),
          last_active: data.last_active?.toDate(),
        } as EnhancedUserRecord)
      })

      // Sort by last_updated (client-side)
      users.sort((a, b) => {
        const dateA = a.last_updated ? new Date(a.last_updated).getTime() : 0
        const dateB = b.last_updated ? new Date(b.last_updated).getTime() : 0
        return dateB - dateA
      })

      callback(users)
    })
  }

  subscribeToComments(callback: (comments: EnhancedCommentRecord[]) => void): () => void {
    const q = query(collection(db, "enhanced_comments"), where("is_responded", "==", false), limit(20))

    return onSnapshot(q, (snapshot) => {
      const comments: EnhancedCommentRecord[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        comments.push({
          ...data,
          created_time: data.created_time?.toDate(),
          discovered_date: data.discovered_date?.toDate(),
          response_date: data.response_date?.toDate(),
        } as EnhancedCommentRecord)
      })

      // Sort by created_time (client-side)
      comments.sort((a, b) => {
        const dateA = a.created_time ? new Date(a.created_time).getTime() : 0
        const dateB = b.created_time ? new Date(b.created_time).getTime() : 0
        return dateB - dateA
      })

      callback(comments)
    })
  }

  // Simple data loading methods for testing
  async getAllUsers(): Promise<EnhancedUserRecord[]> {
    try {
      const q = query(collection(db, "enhanced_users"), limit(100))
      const querySnapshot = await getDocs(q)
      const users: EnhancedUserRecord[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        users.push({
          ...data,
          discovered_date: data.discovered_date?.toDate(),
          last_updated: data.last_updated?.toDate(),
          last_active: data.last_active?.toDate(),
        } as EnhancedUserRecord)
      })

      return users
    } catch (error) {
      console.error("Error getting all users:", error)
      throw error
    }
  }

  async getAllPages(): Promise<EnhancedPageRecord[]> {
    try {
      const q = query(collection(db, "enhanced_pages"), limit(100))
      const querySnapshot = await getDocs(q)
      const pages: EnhancedPageRecord[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        pages.push({
          ...data,
          discovered_date: data.discovered_date?.toDate(),
          last_updated: data.last_updated?.toDate(),
        } as EnhancedPageRecord)
      })

      return pages
    } catch (error) {
      console.error("Error getting all pages:", error)
      throw error
    }
  }

  async getAllGroups(): Promise<EnhancedGroupRecord[]> {
    try {
      const q = query(collection(db, "enhanced_groups"), limit(100))
      const querySnapshot = await getDocs(q)
      const groups: EnhancedGroupRecord[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        groups.push({
          ...data,
          discovered_date: data.discovered_date?.toDate(),
          last_updated: data.last_updated?.toDate(),
        } as EnhancedGroupRecord)
      })

      return groups
    } catch (error) {
      console.error("Error getting all groups:", error)
      throw error
    }
  }
}

export const firebaseEnhancedService = new FirebaseEnhancedService()
