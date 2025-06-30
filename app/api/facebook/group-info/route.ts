import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { accessToken, groupId } = await request.json()

    if (!accessToken || !groupId) {
      return NextResponse.json({ error: "Access token and group ID are required" }, { status: 400 })
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${groupId}?access_token=${accessToken}&fields=id,name,description,privacy,member_count`,
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Facebook API Error for group:", errorData)

      // Return a fallback response instead of throwing error
      return NextResponse.json({
        id: groupId,
        name: `Group ${groupId}`,
        error: `Failed to fetch group info: ${response.status}`,
      })
    }

    const groupData = await response.json()
    return NextResponse.json(groupData)
  } catch (error) {
    console.error("API Route Error:", error)
    return NextResponse.json({
      id: request.url,
      name: "Unknown Group",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
