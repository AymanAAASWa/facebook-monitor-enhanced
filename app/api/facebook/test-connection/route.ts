import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Access token is required" }, { status: 400 })
    }

    const response = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${accessToken}&fields=id,name,email`)

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Facebook API Error:", errorData)

      try {
        const errorJson = JSON.parse(errorData)
        return NextResponse.json({
          success: false,
          error: errorJson.error?.message || "Facebook API Error",
        })
      } catch {
        return NextResponse.json({
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        })
      }
    }

    const userData = await response.json()
    return NextResponse.json({
      success: true,
      user: userData,
    })
  } catch (error) {
    console.error("API Route Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
