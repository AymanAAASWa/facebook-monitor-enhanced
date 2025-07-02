import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { postId, accessToken } = await request.json()

    if (!postId || !accessToken) {
      return NextResponse.json({ error: "Missing postId or accessToken" }, { status: 400 })
    }

    console.log(`Fetching comments for post: ${postId}`)

    // استدعاء Facebook Graph API لجلب التعليقات مع حقول محسنة
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${postId}/comments?fields=id,message,created_time,from{id,name,picture.type(large)},like_count,comment_count,user_likes&access_token=${accessToken}&limit=100&order=chronological`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Facebook API Error (${response.status}):`, errorText)
      
      // التحقق من أخطاء معدل الطلبات
      if (response.status === 400 || errorText.includes("368")) {
        return NextResponse.json({
          success: false,
          error: "تم الوصول لحد معدل الطلبات. يرجى المحاولة لاحقاً",
        })
      }

      return NextResponse.json(
        { 
          success: false,
          error: `Facebook API Error: ${response.status}` 
        },
        { status: response.status },
      )
    }

    const data = await response.json()

    if (data.error) {
      console.error("Facebook API returned error:", data.error)
      return NextResponse.json({
        success: false,
        error: data.error.message || "Failed to fetch comments"
      })
    }

    console.log(`Successfully fetched ${data.data?.length || 0} comments for post ${postId}`)

    const comments = data.data || []
    console.log(`Returning ${comments.length} comments with full data`)
    
    return NextResponse.json({
      success: true,
      data: comments,
      paging: data.paging,
      total: comments.length,
      hasComments: comments.length > 0
    })
  } catch (error: any) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ 
      success: false,
      error: "Internal server error" 
    }, { status: 500 })
  }
}
