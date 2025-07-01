import { type NextRequest, NextResponse } from "next/server"
import { FacebookService } from "@/lib/facebook-service"

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: "Access token is required" }, { status: 400 })
    }

    const service = new FacebookService()
    service.setAccessToken(accessToken)

    const validation = await service.validateToken()

    return NextResponse.json(validation)
  } catch (error) {
    console.error("Token validation error:", error)
    return NextResponse.json({ error: "Failed to validate token" }, { status: 500 })
  }
}
