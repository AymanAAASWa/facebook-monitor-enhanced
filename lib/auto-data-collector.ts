import { enhancedFacebookService } from "./enhanced-facebook-service"
import {
  firebaseEnhancedService,
  type EnhancedUserRecord,
  type EnhancedPageRecord,
  type EnhancedGroupRecord,
  type EnhancedCommentRecord,
} from "./firebase-enhanced-service"

export class AutoDataCollector {
  private isCollecting = false
  private collectionInterval: NodeJS.Timeout | null = null

  // بدء جمع البيانات التلقائي
  startAutoCollection(intervalMinutes = 30) {
    if (this.isCollecting) {
      console.log("Auto collection is already running")
      return
    }

    this.isCollecting = true
    console.log(`Starting auto data collection every ${intervalMinutes} minutes`)

    // جمع البيانات فوراً
    this.collectAllData()

    // جدولة جمع البيانات
    this.collectionInterval = setInterval(
      () => {
        this.collectAllData()
      },
      intervalMinutes * 60 * 1000,
    )
  }

  // إيقاف جمع البيانات التلقائي
  stopAutoCollection() {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval)
      this.collectionInterval = null
    }
    this.isCollecting = false
    console.log("Auto data collection stopped")
  }

  // جمع جميع البيانات
  private async collectAllData() {
    try {
      console.log("Starting comprehensive data collection...")

      // جلب إعدادات المستخدم
      const settings = JSON.parse(localStorage.getItem("facebook_settings") || "{}")
      if (!settings.accessToken || !settings.sources) {
        console.log("No access token or sources configured")
        return
      }

      enhancedFacebookService.setAccessToken(settings.accessToken)

      // جمع البيانات من كل مصدر
      for (const source of settings.sources) {
        await this.collectSourceData(source)
      }

      console.log("Data collection completed successfully")
    } catch (error) {
      console.error("Error in auto data collection:", error)
    }
  }

  // جمع البيانات من مصدر واحد
  private async collectSourceData(source: any) {
    try {
      console.log(`Collecting data from ${source.type}: ${source.name}`)

      if (source.type === "page") {
        await this.collectPageData(source.id)
      } else if (source.type === "group") {
        await this.collectGroupData(source.id)
      } else if (source.type === "user") {
        await this.collectUserData(source.id)
      }
    } catch (error) {
      console.error(`Error collecting data from ${source.name}:`, error)
    }
  }

  // جمع بيانات المستخدم
  private async collectUserData(userId: string) {
    try {
      const userResult = await enhancedFacebookService.getEnhancedUserInfo(userId)
      if (userResult.data) {
        const enhancedUser: EnhancedUserRecord = {
          id: userId,
          name: userResult.data.name,
          email: userResult.data.email,
          picture: userResult.data.picture?.data?.url,
          birthday: userResult.data.birthday,
          hometown: userResult.data.hometown?.name,
          location: userResult.data.location?.name,
          about: userResult.data.about,
          relationship_status: userResult.data.relationship_status,
          religion: userResult.data.religion,
          political: userResult.data.political,
          website: userResult.data.website,
          work: userResult.data.work?.map((w) => ({
            employer: w.employer?.name || "",
            position: w.position?.name || "",
            start_date: w.start_date,
            end_date: w.end_date,
          })),
          education: userResult.data.education?.map((e) => ({
            school: e.school?.name || "",
            type: e.type || "",
            year: e.year?.name,
          })),
          friends_count: userResult.data.friends?.data?.length || 0,
          posts_count: userResult.data.posts?.data?.length || 0,
          photos_count: userResult.data.photos?.data?.length || 0,
          videos_count: userResult.data.videos?.data?.length || 0,
          total_likes:
            userResult.data.posts?.data?.reduce(
              (sum: number, post: any) => sum + (post.likes?.summary?.total_count || 0),
              0,
            ) || 0,
          total_comments:
            userResult.data.posts?.data?.reduce(
              (sum: number, post: any) => sum + (post.comments?.summary?.total_count || 0),
              0,
            ) || 0,
          source: "facebook_monitor",
          source_type: "user",
          discovered_date: new Date(),
          last_updated: new Date(),
          is_active: true,
          tags: ["facebook_user", "auto_collected"],
          category: "social_media_user",
        }

        // حساب معدل التفاعل
        if (enhancedUser.posts_count && enhancedUser.posts_count > 0) {
          enhancedUser.engagement_rate =
            ((enhancedUser.total_likes || 0) + (enhancedUser.total_comments || 0)) / enhancedUser.posts_count
        }

        await firebaseEnhancedService.saveEnhancedUser(enhancedUser)

        // جمع الأصدقاء
        if (userResult.data.friends?.data) {
          await this.collectFriendsData(userResult.data.friends.data)
        }

        // جمع التعليقات
        if (userResult.data.posts?.data) {
          await this.collectPostComments(userResult.data.posts.data, userId)
        }
      }
    } catch (error) {
      console.error(`Error collecting user data for ${userId}:`, error)
    }
  }

  // جمع بيانات الصفحة
  private async collectPageData(pageId: string) {
    try {
      const pageResult = await enhancedFacebookService.getEnhancedPageInfo(pageId)
      if (pageResult.data) {
        const enhancedPage: EnhancedPageRecord = {
          id: pageId,
          name: pageResult.data.name,
          category: pageResult.data.category,
          about: pageResult.data.about,
          website: pageResult.data.website,
          phone: pageResult.data.phone,
          emails: pageResult.data.emails,
          address: pageResult.data.location?.street,
          city: pageResult.data.location?.city,
          country: pageResult.data.location?.country,
          latitude: pageResult.data.location?.latitude,
          longitude: pageResult.data.location?.longitude,
          hours: pageResult.data.hours,
          fan_count: pageResult.data.fan_count,
          followers_count: pageResult.data.followers_count,
          posts_count: pageResult.data.posts?.data?.length || 0,
          total_likes:
            pageResult.data.posts?.data?.reduce(
              (sum: number, post: any) => sum + (post.likes?.summary?.total_count || 0),
              0,
            ) || 0,
          total_comments:
            pageResult.data.posts?.data?.reduce(
              (sum: number, post: any) => sum + (post.comments?.summary?.total_count || 0),
              0,
            ) || 0,
          total_shares:
            pageResult.data.posts?.data?.reduce((sum: number, post: any) => sum + (post.shares?.count || 0), 0) || 0,
          average_rating:
            pageResult.data.ratings?.data?.reduce((sum: number, rating: any) => sum + rating.rating, 0) /
              (pageResult.data.ratings?.data?.length || 1) || 0,
          total_reviews: pageResult.data.ratings?.data?.length || 0,
          picture: pageResult.data.picture?.data?.url,
          cover_photo: pageResult.data.cover?.source,
          source: "facebook_monitor",
          discovered_date: new Date(),
          last_updated: new Date(),
          is_verified: false, // يمكن تحديثها من API
          is_active: true,
          tags: ["facebook_page", "auto_collected"],
        }

        // حساب متوسط التفاعل
        if (enhancedPage.posts_count && enhancedPage.posts_count > 0) {
          enhancedPage.average_engagement =
            ((enhancedPage.total_likes || 0) + (enhancedPage.total_comments || 0) + (enhancedPage.total_shares || 0)) /
            enhancedPage.posts_count
        }

        await firebaseEnhancedService.saveEnhancedPage(enhancedPage)

        // جمع المحادثات
        const conversationsResult = await enhancedFacebookService.getPageConversations(pageId)
        if (conversationsResult.data) {
          // يمكن معالجة المحادثات هنا
        }

        // جمع التقييمات
        const ratingsResult = await enhancedFacebookService.getPageRatings(pageId)
        if (ratingsResult.data) {
          // يمكن معالجة التقييمات هنا
        }
      }
    } catch (error) {
      console.error(`Error collecting page data for ${pageId}:`, error)
    }
  }

  // جمع بيانات المجموعة
  private async collectGroupData(groupId: string) {
    try {
      const groupResult = await enhancedFacebookService.getEnhancedGroupInfo(groupId)
      if (groupResult.data) {
        const enhancedGroup: EnhancedGroupRecord = {
          id: groupId,
          name: groupResult.data.name,
          description: groupResult.data.description,
          privacy: groupResult.data.privacy as "public" | "closed" | "secret",
          member_count: groupResult.data.member_count,
          admin_count: groupResult.data.admins?.data?.length || 0,
          posts_count: groupResult.data.posts?.data?.length || 0,
          total_likes:
            groupResult.data.posts?.data?.reduce(
              (sum: number, post: any) => sum + (post.likes?.summary?.total_count || 0),
              0,
            ) || 0,
          total_comments:
            groupResult.data.posts?.data?.reduce(
              (sum: number, post: any) => sum + (post.comments?.summary?.total_count || 0),
              0,
            ) || 0,
          picture: groupResult.data.picture?.data?.url,
          cover_photo: groupResult.data.cover?.source,
          source: "facebook_monitor",
          discovered_date: new Date(),
          last_updated: new Date(),
          is_active: true,
          tags: ["facebook_group", "auto_collected"],
        }

        // حساب متوسط التفاعل
        if (enhancedGroup.posts_count && enhancedGroup.posts_count > 0) {
          enhancedGroup.average_engagement =
            ((enhancedGroup.total_likes || 0) + (enhancedGroup.total_comments || 0)) / enhancedGroup.posts_count
        }

        await firebaseEnhancedService.saveEnhancedGroup(enhancedGroup)

        // جمع الأعضاء
        const membersResult = await enhancedFacebookService.getGroupMembers(groupId)
        if (membersResult.data) {
          await this.collectGroupMembers(membersResult.data, groupId)
        }
      }
    } catch (error) {
      console.error(`Error collecting group data for ${groupId}:`, error)
    }
  }

  // جمع بيانات الأصدقاء
  private async collectFriendsData(friends: any[]) {
    const friendsToSave: EnhancedUserRecord[] = []

    for (const friend of friends.slice(0, 50)) {
      // حد أقصى 50 صديق لتجنب الحمل الزائد
      const enhancedFriend: EnhancedUserRecord = {
        id: friend.id,
        name: friend.name,
        picture: friend.picture?.data?.url,
        source: "facebook_friends",
        source_type: "user",
        discovered_date: new Date(),
        last_updated: new Date(),
        is_active: true,
        tags: ["facebook_friend", "auto_collected"],
        category: "friend",
      }

      friendsToSave.push(enhancedFriend)
    }

    if (friendsToSave.length > 0) {
      await firebaseEnhancedService.bulkSaveUsers(friendsToSave)
    }
  }

  // جمع أعضاء المجموعة
  private async collectGroupMembers(members: any[], groupId: string) {
    const membersToSave: EnhancedUserRecord[] = []

    for (const member of members.slice(0, 100)) {
      // حد أقصى 100 عضو
      const enhancedMember: EnhancedUserRecord = {
        id: member.id,
        name: member.name,
        picture: member.picture?.data?.url,
        source: `facebook_group_${groupId}`,
        source_type: "group",
        discovered_date: new Date(),
        last_updated: new Date(),
        is_active: true,
        tags: ["facebook_group_member", "auto_collected"],
        category: member.administrator ? "group_admin" : "group_member",
      }

      membersToSave.push(enhancedMember)
    }

    if (membersToSave.length > 0) {
      await firebaseEnhancedService.bulkSaveUsers(membersToSave)
    }
  }

  // جمع تعليقات المنشورات
  private async collectPostComments(posts: any[], authorId: string) {
    const commentsToSave: EnhancedCommentRecord[] = []

    for (const post of posts.slice(0, 20)) {
      // حد أقصى 20 منشور
      if (post.comments?.data) {
        for (const comment of post.comments.data) {
          const enhancedComment: EnhancedCommentRecord = {
            id: comment.id,
            message: comment.message || "",
            created_time: new Date(comment.created_time),
            author_id: comment.from?.id || "",
            author_name: comment.from?.name || "",
            author_picture: comment.from?.picture?.data?.url,
            post_id: post.id,
            post_message: post.message?.substring(0, 100),
            post_author: authorId,
            likes_count: comment.likes?.summary?.total_count || 0,
            sentiment: this.analyzeSentiment(comment.message || ""),
            source: "facebook_monitor",
            source_type: "user",
            discovered_date: new Date(),
            is_responded: false,
            tags: ["facebook_comment", "auto_collected"],
          }

          commentsToSave.push(enhancedComment)
        }
      }
    }

    if (commentsToSave.length > 0) {
      await firebaseEnhancedService.bulkSaveComments(commentsToSave)
    }
  }

  // تحليل المشاعر البسيط
  private analyzeSentiment(text: string): "positive" | "negative" | "neutral" | "mixed" {
    const positiveWords = ["ممتاز", "رائع", "جميل", "أحب", "سعيد", "مبهر", "مذهل", "عظيم", "شكرا", "أشكرك"]
    const negativeWords = ["سيء", "فظيع", "أكره", "حزين", "مؤسف", "مخيب", "مشكلة", "خطأ", "غاضب", "زعلان"]

    const words = text.toLowerCase().split(/\s+/)
    let positiveCount = 0
    let negativeCount = 0

    words.forEach((word) => {
      if (positiveWords.some((pw) => word.includes(pw))) positiveCount++
      if (negativeWords.some((nw) => word.includes(nw))) negativeCount++
    })

    if (positiveCount > negativeCount) return "positive"
    if (negativeCount > positiveCount) return "negative"
    if (positiveCount > 0 && negativeCount > 0) return "mixed"
    return "neutral"
  }

  // الحصول على حالة الجمع
  getCollectionStatus() {
    return {
      isCollecting: this.isCollecting,
      hasInterval: this.collectionInterval !== null,
    }
  }
}

export const autoDataCollector = new AutoDataCollector()