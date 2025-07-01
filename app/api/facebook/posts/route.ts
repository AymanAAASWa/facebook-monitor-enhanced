import { type NextRequest, NextResponse } from "next/server"
import { FacebookService } from "@/lib/facebook-service"

export async function POST(request: NextRequest) {
  try {
    const { sourceId, accessToken, limit = 10, until, sourceType = "page" } = await request.json()

    if (!sourceId || !accessToken) {
      return NextResponse.json({ error: "Source ID and access token are required" }, { status: 400 })
    }

    const service = new FacebookService()
    service.setAccessToken(accessToken)

    // Validate the limit to prevent excessive data requests
    const validatedLimit = Math.min(Math.max(limit, 1), 50) // Between 1 and 50

    console.log(`Fetching posts from ${sourceId} (${sourceType}) with limit ${validatedLimit}`)

    // Validate source type
    if (!["page", "group"].includes(sourceType)) {
      return NextResponse.json({ error: "Invalid source type. Must be 'page' or 'group'" }, { status: 400 })
    }

    let result
    
    // استخدم getPosts للمجموعات والصفحات مع التعليقات
    result = await service.getPosts(
      sourceId, 
      sourceType as "page" | "group", 
      validatedLimit, 
      until, 
      true // includeComments = true
    )

    console.log(`API returned ${result.data?.length || 0} posts from ${sourceType} ${sourceId}`)

    // إضافة معلومات إضافية للاستجابة
    const response = {
      ...result,
      sourceInfo: {
        id: sourceId,
        type: sourceType,
        fetchedAt: new Date().toISOString(),
        postCount: result.data?.length || 0
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Facebook API Error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch posts from Facebook API",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}