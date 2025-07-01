import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { postId, accessToken } = await request.json()

    if (!postId || !accessToken) {
      return NextResponse.json({ error: "Missing postId or accessToken" }, { status: 400 })
    }

    // استدعاء Facebook Graph API لجلب التعليقات
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${postId}/comments?fields=id,message,created_time,from{id,name,picture},like_count,comment_count&access_token=${accessToken}&limit=50`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Facebook API Error:", errorData)
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to fetch comments" },
        { status: response.status },
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: data.data || [],
      paging: data.paging,
    })
  } catch (error: any) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
