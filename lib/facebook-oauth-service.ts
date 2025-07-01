"use client"

declare global {
  interface Window {
    FB: any
    fbAsyncInit: () => void
  }
}

export interface FacebookUser {
  id: string
  name: string
  email?: string
  picture?: {
    data: {
      url: string
    }
  }
  birthday?: string
  hometown?: {
    name: string
  }
  location?: {
    name: string
  }
  education?: Array<{
    school: {
      name: string
    }
    type: string
    year?: {
      name: string
    }
  }>
  work?: Array<{
    employer: {
      name: string
    }
    position?: {
      name: string
    }
    start_date?: string
    end_date?: string
  }>
  relationship_status?: string
  religion?: string
  political?: string
  website?: string
  about?: string
}

export interface FacebookLoginResult {
  success: boolean
  user?: FacebookUser
  accessToken?: string
  error?: string
  permissions?: string[]
}

export class FacebookOAuthService {
  // ==================================================================
  // ⚙️ هام: استبدل هذا بمعرف التطبيق الخاص بك من Facebook Developers
  // ⚙️ IMPORTANT: Replace this with your own App ID from Facebook Developers
  // ==================================================================
  private appId = "419003153920534"
  private isInitialized = false
  private currentUser: FacebookUser | null = null
  private accessToken: string | null = null

  // جميع الصلاحيات المتاحة مقسمة حسب الفئات
  private readonly availablePermissions = {
    // المعلومات الشخصية الأساسية
    basic: ["public_profile", "email"],

    // المعلومات الشخصية المتقدمة
    personal: [
      "user_birthday",
      "user_hometown",
      "user_location",
      "user_about_me",
      "user_website",
      "user_religion_politics",
      "user_relationships",
      "user_relationship_details",
    ],

    // التعليم والعمل
    professional: ["user_education_history", "user_work_history"],

    // الأصدقاء والمحتوى
    social: ["user_friends", "user_posts", "user_photos", "user_videos", "user_status", "user_events"],

    // الصفحات والمجموعات
    pages: [
      "manage_pages",
      "pages_show_list",
      "pages_manage_cta",
      "pages_manage_instant_articles",
      "pages_messaging",
      "pages_messaging_phone_number",
      "pages_messaging_subscriptions",
      "pages_messaging_payments",
      "publish_pages",
      "read_page_mailboxes",
    ],

    // المجموعات
    groups: ["user_managed_groups", "publish_to_groups", "groups_access_member_info"],

    // الإعلانات والتحليلات
    business: [
      "ads_management",
      "ads_read",
      "business_management",
      "read_insights",
      "read_audience_network_insights",
      "leads_retrieval",
    ],

    // Instagram
    instagram: ["instagram_basic", "instagram_manage_comments", "instagram_manage_insights"],

    // WhatsApp Business
    whatsapp: ["whatsapp_business_management"],

    // أخرى
    other: ["read_custom_friendlists", "rsvp_event", "publish_video", "openid", "xmpp_login", "offline_access"],
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true

    return new Promise((resolve) => {
      // تحميل Facebook SDK
      if (!document.getElementById("facebook-jssdk")) {
        const script = document.createElement("script")
        script.id = "facebook-jssdk"
        script.src = "https://connect.facebook.net/ar_AR/sdk.js"
        document.head.appendChild(script)
      }

      window.fbAsyncInit = () => {
        window.FB.init({
          appId: this.appId,
          cookie: true,
          xfbml: true,
          version: "v18.0",
        })

        this.isInitialized = true
        resolve(true)
      }

      // إذا كان SDK محمل بالفعل
      if (window.FB) {
        window.fbAsyncInit()
      }
    })
  }

  getAllPermissions(): string[] {
    return Object.values(this.availablePermissions).flat()
  }

  getPermissionsByCategory(): typeof this.availablePermissions {
    return this.availablePermissions
  }

  async login(requestedPermissions?: string[]): Promise<FacebookLoginResult> {
    try {
      await this.initialize()

      const permissions = requestedPermissions || this.getAllPermissions()

      return new Promise((resolve) => {
        window.FB.login(
          (response: any) => {
            if (response.authResponse) {
              this.accessToken = response.authResponse.accessToken

              // جلب معلومات المستخدم مع جميع الحقول المتاحة
              this.getUserInfo().then((userResult) => {
                if (userResult.success) {
                  this.currentUser = userResult.user!
                  resolve({
                    success: true,
                    user: userResult.user,
                    accessToken: this.accessToken!,
                    permissions: response.authResponse.grantedScopes?.split(",") || [],
                  })
                } else {
                  resolve({
                    success: false,
                    error: userResult.error,
                  })
                }
              })
            } else {
              resolve({
                success: false,
                error: response.error?.message || "فشل في تسجيل الدخول",
              })
            }
          },
          {
            scope: permissions.join(","),
            return_scopes: true,
          },
        )
      })
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "حدث خطأ أثناء تسجيل الدخول",
      }
    }
  }

  async getUserInfo(): Promise<{ success: boolean; user?: FacebookUser; error?: string }> {
    if (!this.accessToken) {
      return { success: false, error: "لم يتم تسجيل الدخول" }
    }

    return new Promise((resolve) => {
      const fields = [
        "id",
        "name",
        "email",
        "picture.type(large)",
        "birthday",
        "hometown",
        "location",
        "about",
        "education",
        "work",
        "website",
        "relationship_status",
        "religion",
        "political",
      ].join(",")

      window.FB.api("/me", { fields }, (response: any) => {
        if (response && !response.error) {
          resolve({
            success: true,
            user: response as FacebookUser,
          })
        } else {
          resolve({
            success: false,
            error: response.error?.message || "فشل في جلب معلومات المستخدم",
          })
        }
      })
    })
  }

  async getUserPosts(limit = 25): Promise<{ success: boolean; posts?: any[]; error?: string }> {
    if (!this.accessToken) {
      return { success: false, error: "لم يتم تسجيل الدخول" }
    }

    return new Promise((resolve) => {
      window.FB.api(
        "/me/posts",
        {
          limit,
          fields: "id,message,created_time,type,link,picture,likes.summary(true),comments.summary(true),shares",
        },
        (response: any) => {
          if (response && !response.error) {
            resolve({
              success: true,
              posts: response.data || [],
            })
          } else {
            resolve({
              success: false,
              error: response.error?.message || "فشل في جلب المنشورات",
            })
          }
        },
      )
    })
  }

  async getUserPhotos(limit = 25): Promise<{ success: boolean; photos?: any[]; error?: string }> {
    if (!this.accessToken) {
      return { success: false, error: "لم يتم تسجيل الدخول" }
    }

    return new Promise((resolve) => {
      window.FB.api(
        "/me/photos",
        {
          limit,
          fields: "id,source,created_time,name,likes.summary(true),comments.summary(true)",
        },
        (response: any) => {
          if (response && !response.error) {
            resolve({
              success: true,
              photos: response.data || [],
            })
          } else {
            resolve({
              success: false,
              error: response.error?.message || "فشل في جلب الصور",
            })
          }
        },
      )
    })
  }

  async getUserFriends(): Promise<{ success: boolean; friends?: any[]; error?: string }> {
    if (!this.accessToken) {
      return { success: false, error: "لم يتم تسجيل الدخول" }
    }

    return new Promise((resolve) => {
      window.FB.api(
        "/me/friends",
        {
          fields: "id,name,picture",
        },
        (response: any) => {
          if (response && !response.error) {
            resolve({
              success: true,
              friends: response.data || [],
            })
          } else {
            resolve({
              success: false,
              error: response.error?.message || "فشل في جلب قائمة الأصدقاء",
            })
          }
        },
      )
    })
  }

  async getPageInsights(pageId: string): Promise<{ success: boolean; insights?: any[]; error?: string }> {
    if (!this.accessToken) {
      return { success: false, error: "لم يتم تسجيل الدخول" }
    }

    return new Promise((resolve) => {
      window.FB.api(
        `/${pageId}/insights`,
        {
          metric: "page_fans,page_impressions,page_engaged_users",
          period: "day",
        },
        (response: any) => {
          if (response && !response.error) {
            resolve({
              success: true,
              insights: response.data || [],
            })
          } else {
            resolve({
              success: false,
              error: response.error?.message || "فشل في جلب إحصائيات الصفحة",
            })
          }
        },
      )
    })
  }

  async logout(): Promise<void> {
    if (this.isInitialized && window.FB) {
      return new Promise((resolve) => {
        window.FB.logout(() => {
          this.currentUser = null
          this.accessToken = null
          resolve()
        })
      })
    }
  }

  getCurrentUser(): FacebookUser | null {
    return this.currentUser
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null && this.accessToken !== null
  }
}

export const facebookOAuthService = new FacebookOAuthService()
