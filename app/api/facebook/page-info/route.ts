import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { accessToken, pageId } = await request.json()

    if (!accessToken || !pageId) {
      return NextResponse.json({ error: "Access token and page ID are required" }, { status: 400 })
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?access_token=${accessToken}&fields=id,name,about,category,fan_count`,
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Facebook API Error for page:", errorData)

      // Return a fallback response instead of throwing error
      return NextResponse.json({
        id: pageId,
        name: `Page ${pageId}`,
        error: `Failed to fetch page info: ${response.status}`,
      })
    }

    const pageData = await response.json()
    return NextResponse.json(pageData)
  } catch (error) {
    console.error("API Route Error:", error)
    return NextResponse.json({
      id: request.url,
      name: "Unknown Page",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
