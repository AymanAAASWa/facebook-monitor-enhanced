import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { accessToken, groupId, limit = 25, after } = await request.json()

    if (!accessToken || !groupId) {
      return NextResponse.json({ error: "Access token and group ID are required" }, { status: 400 })
    }

    const fields = [
      "id",
      "message",
      "story",
      "created_time",
      "updated_time",
      "full_picture",
      "permalink_url",
      "from{id,name,picture}",
      "attachments{media,type,subattachments}",
      "comments.limit(10){id,message,created_time,from{id,name}}",
      "reactions.summary(true)",
      "shares",
    ].join(",")

    // Try different endpoints for group posts
    const endpoints = [
      `https://graph.facebook.com/v18.0/${groupId}/posts?access_token=${accessToken}&fields=${fields}&limit=${limit}${after ? `&after=${after}` : ""}`,
      `https://graph.facebook.com/v18.0/${groupId}/feed?access_token=${accessToken}&fields=${fields}&limit=${limit}${after ? `&after=${after}` : ""}`,
    ]

    let lastError = null

    for (const url of endpoints) {
      try {
        const response = await fetch(url)

        if (response.ok) {
          const postsData = await response.json()
          return NextResponse.json(postsData)
        } else {
          const errorData = await response.text()
          lastError = errorData
          console.log(`Endpoint failed: ${url}`, errorData)
          continue // Try next endpoint
        }
      } catch (endpointError) {
        lastError = endpointError
        console.log(`Endpoint error: ${url}`, endpointError)
        continue // Try next endpoint
      }
    }

    // If all endpoints failed, return structured error
    console.error("All Facebook API endpoints failed for group:", groupId, lastError)

    let errorMessage = "Unable to access group posts"
    let errorCode = "ACCESS_DENIED"

    try {
      if (typeof lastError === "string") {
        const errorJson = JSON.parse(lastError)
        if (errorJson.error) {
          errorMessage = errorJson.error.message || errorMessage
          errorCode = errorJson.error.code || errorCode
        }
      }
    } catch (parseError) {
      // Keep default error message
    }

    return NextResponse.json({
      error: errorMessage,
      errorCode: errorCode,
      data: [],
      message:
        "This group may be private or require special permissions to read posts. Try checking if you're a member of the group and have the necessary permissions.",
    })
  } catch (error) {
    console.error("API Route Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        errorCode: "INTERNAL_ERROR",
        data: [],
        message: "An internal error occurred while fetching group posts.",
      },
      { status: 500 },
    )
  }
}
