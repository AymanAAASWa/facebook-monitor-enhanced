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

    // Return posts with comments that were already fetched in the main request
    return NextResponse.json(result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Facebook API Error:", error)
    return NextResponse.json({ error: "Failed to fetch posts from Facebook API" }, { status: 500 })
  }
}