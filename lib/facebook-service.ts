interface FacebookUser {
  id: string;
  name: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

interface FacebookComment {
  id: string;
  message?: string;
  created_time: string;
  from: FacebookUser;
}

interface FacebookAttachment {
  type: string;
  media?: {
    image?: {
      src: string;
    };
    source?: string;
  };
  subattachments?: {
    data: FacebookAttachment[];
  };
}

interface FacebookPost {
  id: string;
  message?: string;
  created_time?: string;
  full_picture?: string;
  attachments?: {
    data: Array<{
      type: string;
      url?: string;
      title?: string;
      description?: string;
    }>;
  };
  from?: {
    id: string;
    name: string;
  };
  reactions?: {
    data?: Array<{
      id: string;
      name: string;
      type: string;
    }>;
    summary?: {
      total_count: number;
      viewer_reaction?: string;
    };
  };

  shares?: {
    count: number;
  };
  comments?: {
    data: Array<{
      id: string;
      message: string;
      created_time: string;
      from: {
        id: string;
        name: string;
      };
      like_count?: number;
    }>;
    summary?: {
      total_count: number;
    };
  };
}

interface FacebookApiResponse<T> {
  data: T[];
  paging?: {
    next?: string;
    previous?: string;
    cursors?: {
      before: string;
      after: string;
    };
  };
}

export class FacebookService {
  private accessToken = "";
  private baseUrl = "https://graph.facebook.com/v18.0";

  constructor() {
    // Load access token from localStorage
    if (typeof window !== "undefined") {
      const settings = JSON.parse(
        localStorage.getItem("facebook_settings") || "{}",
      );
      this.accessToken = settings.accessToken || "";
    }
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  isTokenValid(): boolean {
    return this.accessToken.length > 0;
  }

  private async makeRequest<T>(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    if (!this.accessToken) {
      throw new Error("Access token is required. Please set it in settings.");
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append("access_token", this.accessToken);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        const responseText = await response.text();

        // Check if response is HTML (usually error pages)
        if (
          responseText.startsWith("<!DOCTYPE") ||
          responseText.startsWith("<html")
        ) {
          throw new Error(
            `Facebook API returned HTML error page: ${response.status} ${response.statusText}`,
          );
        }

        try {
          const errorData = JSON.parse(responseText);
          throw new Error(
            errorData.error?.message ||
              `Facebook API Error: ${response.status} ${response.statusText}`,
          );
        } catch (jsonError) {
          throw new Error(
            `Facebook API Error: ${response.status} ${response.statusText} - ${responseText.substring(0, 200)}`,
          );
        }
      }

      const responseText = await response.text();

      // Check if response is HTML instead of JSON
      if (
        responseText.startsWith("<!DOCTYPE") ||
        responseText.startsWith("<html")
      ) {
        throw new Error(
          "Facebook API returned HTML instead of JSON. This may indicate rate limiting or authentication issues.",
        );
      }

      try {
        return JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error(
          `Invalid JSON response from Facebook API: ${responseText.substring(0, 200)}`,
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred while fetching data");
    }
  }

  async validateToken(): Promise<{ isValid: boolean; error?: string }> {
    try {
      await this.makeRequest("/me", { fields: "id,name" });
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error:
          error instanceof Error ? error.message : "Token validation failed",
      };
    }
  }

  async getPosts(
    sourceId: string,
    sourceType: "page" | "group" = "page",
    limit = 25,
    until?: string,
    includeComments = true,
  ): Promise<{ data: FacebookPost[]; paging?: any; error?: string }> {
    try {
      console.log(`Starting to fetch posts from ${sourceType} ${sourceId}`);

      // استخدام endpoint مختلف للمجموعات
      let endpoint =
        sourceType === "group" ? `/${sourceId}/feed` : `/${sourceId}/posts`;

      // إعداد الحقول المطلوبة حسب نوع المصدر
      let baseFields = [];

      if (sourceType === "group") {
        // للمجموعات - حقول أساسية مع التعليقات
        baseFields = [
          "id",
          "message",
          "full_picture",
          "created_time",
          "from{id,name}",
          "type",
        ];

        // للمجموعات - إضافة التعليقات مع إحصائيات
        if (includeComments) {
          baseFields.push(
            "comments.limit(10).summary(total_count){id,message,created_time,from{id,name,picture.type(large)},like_count}",
          );
        }
      } else {
        // للصفحات - حقول كاملة
        baseFields = [
          "id",
          "message",
          "full_picture",
          "created_time",
          "updated_time",
          "from{id,name,picture}",
          "attachments{media,type,subattachments}",
          "shares",
          "reactions.summary(total_count)",
        ];

        // إضافة التعليقات مع إحصائيات شاملة
        if (includeComments) {
          baseFields.push(
            "comments.limit(15).summary(total_count){id,message,created_time,from{id,name,picture.type(large)},like_count,user_likes}",
          );
        }
      }

      let params: {
        fields: string;
        limit: string;
        until?: string;
      } = {
        fields: baseFields.join(","),
        limit: String(limit),
      };

      if (until) {
        params.until = until;
      }

      console.log(
        `Fetching ${sourceType} posts with fields: ${params.fields.substring(0, 100)}...`,
      );

      try {
        console.log(
          `Making request to Facebook API with fields: ${params.fields}`,
        );
        const response = await this.makeRequest<{
          data: FacebookPost[];
          paging: any;
        }>(endpoint, params);

        if (response.data) {
          console.log(`Successfully fetched ${response.data.length} posts`);

          // Log comment counts for debugging
          response.data.forEach((post, index) => {
            const commentCount = post.comments?.data?.length || 0;
            console.log(`Post ${index + 1}: ${commentCount} comments`);
          });

          return { data: response.data, paging: response.paging };
        }
      } catch (error: any) {
        console.error("Error fetching posts with comments:", error.message);

        // If request with comments fails, try to fetch posts separately and then comments
        if (
          includeComments &&
          (error.message.includes("يبدو أنك كنت تسيء استخدام") ||
            error.message.includes("368") ||
            error.message.includes("rate limit") ||
            error.message.includes("permissions") ||
            error.message.includes("Tried accessing nonexisting field") ||
            (sourceType === "group" && error.message.includes("100")))
        ) {
          console.log(
            "Trying alternative approach: fetch posts first, then comments...",
          );

          try {
            // First get posts without comments
            const basicParams = {
              fields:
                sourceType === "group"
                  ? [
                      "id",
                      "message",
                      "full_picture",
                      "created_time",
                      "from{id,name}",
                      "type",
                    ].join(",")
                  : [
                      "id",
                      "message",
                      "full_picture",
                      "created_time",
                      "updated_time",
                      "from{id,name,picture}",
                      "attachments{media,type,subattachments}",
                      "shares",
                      "reactions.summary(total_count)",
                    ].join(","),
              limit: String(limit),
            };

            if (until) {
              basicParams.until = until;
            }

            const basicResponse = await this.makeRequest<{
              data: FacebookPost[];
              paging: any;
            }>(endpoint, basicParams);

            // Then try to get comments for each post individually
            const postsWithComments = await Promise.all(
              (basicResponse.data || []).map(async (post) => {
                try {
                  const commentsResult = await this.getPostComments(
                    post.id,
                    10,
                  );
                  const commentsData = commentsResult.data || [];
                  console.log(`Post ${post.id}: Found ${commentsData.length} comments`);
                  return {
                    ...post,
                    comments: { 
                      data: commentsData,
                      summary: { total_count: commentsData.length }
                    },
                  };
                } catch (commentError) {
                  console.warn(
                    `Failed to get comments for post ${post.id}:`,
                    commentError,
                  );
                  return {
                    ...post,
                    comments: { 
                      data: [],
                      summary: { total_count: 0 }
                    },
                  };
                }
              }),
            );

            return {
              data: postsWithComments,
              paging: basicResponse.paging,
              error: "تم جلب التعليقات بشكل منفصل",
            };
          } catch (retryError) {
            console.error("Alternative approach also failed:", retryError);
            throw retryError;
          }
        }
        throw error;
      }

      return { data: [], paging: null };
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      return { data: [], error: error.message };
    }
  }

  async getPostComments(
    postId: string,
    limit = 25,
  ): Promise<{ data: FacebookComment[]; error?: string }> {
    try {
      console.log(`Fetching comments for post: ${postId}`);

      // Add small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await fetch(
        `${this.baseUrl}/${postId}/comments?access_token=${this.accessToken}&fields=id,message,created_time,from{id,name,picture.type(large)},like_count,can_reply,user_likes&limit=${limit}&order=chronological`,
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Facebook API Error (${response.status}):`, errorText);

        // Check if response is HTML (error page)
        if (
          errorText.startsWith("<!DOCTYPE") ||
          errorText.startsWith("<html")
        ) {
          return {
            data: [],
            error: "Facebook API returned error page - possibly rate limited",
          };
        }

        // Check if it's a rate limit error
        if (
          errorText.includes("يبدو أنك كنت تسيء استخدام") ||
          errorText.includes("368") ||
          response.status === 400
        ) {
          return { data: [], error: "تم الوصول لحد معدل الطلبات" };
        }

        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.error) {
        console.error("Facebook API returned error:", result.error);

        // Handle rate limiting errors gracefully
        if (result.error.code === 368) {
          return { data: [], error: "تم الوصول لحد معدل الطلبات" };
        }

        throw new Error(result.error.message);
      }

      console.log(
        `Found ${result.data?.length || 0} comments for post ${postId}`,
      );
      return { data: result.data || [] };
    } catch (error: any) {
      console.error("Error fetching post comments:", error);
      return { data: [], error: error.message };
    }
  }

  // Separate method to get post attachments
  async getPostAttachments(
    postId: string,
  ): Promise<{ data: FacebookAttachment[]; error?: string }> {
    try {
      const params: Record<string, string> = {
        fields: "type,media,subattachments",
      };

      const response = await this.makeRequest<
        FacebookApiResponse<FacebookAttachment>
      >(`/${postId}/attachments`, params);

      return {
        data: response.data || [],
      };
    } catch (error) {
      return {
        data: [],
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch attachments",
      };
    }
  }

  // طريقة خاصة لجلب منشورات المجموعات
  async getGroupFeed(
    groupId: string,
    limit = 10,
  ): Promise<{ data: FacebookPost[]; error?: string }> {
    try {
      console.log(`Fetching group feed for: ${groupId}`);

      // استخدام حقول أساسية فقط للمجموعات
      const params = {
        fields: [
          "id",
          "message",
          "full_picture",
          "created_time",
          "from{id,name}",
          "type",
          "permalink_url",
          "comments.limit(10){id,message,created_time,from{id,name}}",
        ].join(","),
        limit: String(Math.min(limit, 25)), // حد أقصى 25 للمجموعات
      };

      const response = await this.makeRequest<{
        data: FacebookPost[];
        paging: any;
      }>(`/${groupId}/feed`, params);

      if (response.data) {
        console.log(
          `Successfully fetched ${response.data.length} posts from group feed with comments`,
        );

        // جلب التعليقات لكل منشور إذا لم تكن موجودة
        const postsWithComments = await Promise.all(
          response.data.map(async (post) => {
            if (
              !post.comments ||
              !post.comments.data ||
              post.comments.data.length === 0
            ) {
              try {
                const commentsResult = await this.getPostComments(post.id, 10);
                return {
                  ...post,
                  comments: { data: commentsResult.data || [] },
                };
              } catch (commentError) {
                console.warn(
                  `Failed to get comments for group post ${post.id}:`,
                  commentError,
                );
                return {
                  ...post,
                  comments: { data: [] },
                };
              }
            }
            return post;
          }),
        );

        return { data: postsWithComments };
      }

      return { data: [] };
    } catch (error: any) {
      console.error("Error fetching group feed:", error);

      // إذا فشل endpoint /feed، جرب الطرق البديلة
      if (
        error.message.includes("100") ||
        error.message.includes("Tried accessing nonexisting field")
      ) {
        console.log("Trying alternative group access methods...");

        try {
          // جرب الحصول على معلومات المجموعة أولاً
          const groupInfo = await this.getGroupInfo(groupId);
          if (groupInfo.error) {
            return {
              data: [],
              error: `لا يمكن الوصول للمجموعة: ${groupInfo.error}. تأكد من أن لديك الصلاحيات المطلوبة`,
            };
          }

          return {
            data: [],
            error:
              "المجموعة موجودة لكن لا يمكن الوصول للمنشورات. قد تحتاج لصلاحيات إضافية أو أن المجموعة خاصة",
          };
        } catch (infoError) {
          return {
            data: [],
            error: "لا يمكن الوصول للمجموعة. تحقق من معرف المجموعة والصلاحيات",
          };
        }
      }

      return { data: [], error: error.message };
    }
  }

  async getGroupInfo(groupId: string): Promise<{ data?: any; error?: string }> {
    try {
      const response = await this.makeRequest(`/${groupId}`, {
        fields: "id,name,description,member_count,privacy",
      });
      return { data: response };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to fetch group info",
      };
    }
  }

  async getPageInfo(pageId: string): Promise<{ data?: any; error?: string }> {
    try {
      const response = await this.makeRequest(`/${pageId}`, {
        fields: "id,name,about,fan_count,category",
      });
      return { data: response };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to fetch page info",
      };
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
      });
      return { data: response.data || [] };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : "Search failed",
      };
    }
  }

  async getUserInfo(userId: string): Promise<{ data?: any; error?: string }> {
    try {
      const response = await this.makeRequest(`/${userId}`, {
        fields: "id,name,picture,location,hometown,work,education",
      });
      return { data: response };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to fetch user info",
      };
    }
  }

  // Method to get posts with real-time updates
  async getPostsWithUpdates(
    sourceId: string,
    since?: string,
  ): Promise<{ data: FacebookPost[]; error?: string }> {
    try {
      const params: Record<string, string> = {
        fields: [
          "id",
          "message",
          "created_time",
          "full_picture",
          "from{id,name,picture}",
        ].join(","),
        limit: "25", // Reduced limit
      };

      if (since) {
        params.since = since;
      }

      const response = await this.makeRequest<
        FacebookApiResponse<FacebookPost>
      >(`/${sourceId}/posts`, params);

      return { data: response.data || [] };
    } catch (error) {
      return {
        data: [],
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch updated posts",
      };
    }
  }

  // Method to get user posts
  async getUserPosts(
    userId: string,
    limit = 200,
  ): Promise<{ data: FacebookPost[]; error?: string }> {
    try {
      let allPosts: any[] = [];
      let nextUrl = `https://graph.facebook.com/v18.0/${userId}/posts?fields=id,message,story,created_time,type,attachments,comments.limit(10){id,message,from,created_time},reactions.limit(10)&limit=100&access_token=${this.accessToken}`;

      while (nextUrl && allPosts.length < limit) {
        const response = await fetch(nextUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        allPosts.push(...data.data);

        // إذا كان هناك صفحة تالية ولم نصل للحد المطلوب
        if (data.paging?.next && allPosts.length < limit) {
          nextUrl = data.paging.next;
        } else {
          break;
        }
      }

      // قطع النتائج للحد المطلوب
      allPosts = allPosts.slice(0, limit);

      return { data: allPosts, error: null };
    } catch (error) {
      console.error("Error fetching user posts:", error);
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
