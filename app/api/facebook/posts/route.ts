import { type NextRequest, NextResponse } from "next/server"
import { FacebookService } from "@/lib/facebook-service"

export async function POST(request: NextRequest) {
  try {
    const { sourceId, accessToken, limit = 10, after } = await request.json()

    if (!sourceId || !accessToken) {
      return NextResponse.json({ error: "Source ID and access token are required" }, { status: 400 })
    }

    const service = new FacebookService()
    service.setAccessToken(accessToken)

    // Validate the limit to prevent excessive data requests
    const validatedLimit = Math.min(Math.max(limit, 1), 25) // Between 1 and 25

    const result = await service.getPosts(sourceId, validatedLimit, after)

    // If we got posts, try to fetch comments for each post separately
    if (result.data && result.data.length > 0) {
      const postsWithComments = await Promise.all(
        result.data.map(async (post) => {
          try {
            // Only fetch comments for the first few posts to avoid rate limits
            const commentsResult = await service.getPostComments(post.id, 5)
            return {
              ...post,
              comments: {
                data: commentsResult.data || [],
              },
            }
          } catch (error) {
            // If comments fail, return post without comments
            return {
              ...post,
              comments: { data: [] },
            }
          }
        }),
      )

      return NextResponse.json({
        ...result,
        data: postsWithComments,
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Facebook API Error:", error)
    return NextResponse.json({ error: "Failed to fetch posts from Facebook API" }, { status: 500 })
  }
}
