
"use client"

import { GoogleGenerativeAI } from "@google/generative-ai"

export interface GeminiAnalysisResult {
  summary: string
  sentiment: "positive" | "negative" | "neutral"
  keyTopics: string[]
  recommendations: string[]
  contentScore: number
}

export interface GeminiInsight {
  type: "trend" | "anomaly" | "opportunity" | "warning"
  title: string
  description: string
  confidence: number
  actionable: boolean
}

export class GeminiAIService {
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null
  private apiKey = ""

  constructor() {
    if (typeof window !== "undefined") {
      const settings = JSON.parse(localStorage.getItem("gemini_settings") || "{}")
      this.apiKey = settings.apiKey || ""
      this.initializeAI()
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey
    const settings = { apiKey }
    localStorage.setItem("gemini_settings", JSON.stringify(settings))
    this.initializeAI()
  }

  private initializeAI() {
    if (this.apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey)
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      } catch (error) {
        console.error("خطأ في تهيئة Gemini AI:", error)
      }
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey && !!this.model
  }

  // تحليل المنشورات باستخدام Gemini
  async analyzePosts(posts: any[]): Promise<{ results: GeminiAnalysisResult[]; insights: GeminiInsight[]; error?: string }> {
    if (!this.isConfigured()) {
      return { results: [], insights: [], error: "يجب تكوين مفتاح Gemini API أولاً" }
    }

    try {
      const results: GeminiAnalysisResult[] = []
      const allInsights: GeminiInsight[] = []

      // تحليل كل منشور على حدة
      for (const post of posts.slice(0, 10)) { // تحديد العدد لتجنب الإفراط في الاستخدام
        try {
          const analysis = await this.analyzePost(post)
          if (analysis) {
            results.push(analysis)
          }
        } catch (error) {
          console.warn("فشل تحليل منشور:", error)
        }
      }

      // تحليل شامل للبيانات
      const overallInsights = await this.generateOverallInsights(posts)
      allInsights.push(...overallInsights)

      return { results, insights: allInsights }
    } catch (error: any) {
      return { results: [], insights: [], error: error.message }
    }
  }

  // تحليل منشور واحد
  async analyzePost(post: any): Promise<GeminiAnalysisResult | null> {
    if (!this.model || !post.message) return null

    try {
      const prompt = `
قم بتحليل هذا المنشور من فيسبوك وأعطني النتائج بصيغة JSON:

المنشور: "${post.message}"
عدد التعليقات: ${post.comments?.data?.length || 0}
عدد التفاعلات: ${post.reactions?.summary?.total_count || 0}

المطلوب تحليل:
1. ملخص المحتوى
2. المشاعر (positive/negative/neutral)
3. المواضيع الرئيسية (array)
4. التوصيات لتحسين المحتوى (array)
5. نقاط المحتوى من 100

أرجع النتيجة بصيغة JSON صحيحة بهذا الشكل:
{
  "summary": "ملخص المحتوى",
  "sentiment": "positive|negative|neutral",
  "keyTopics": ["موضوع1", "موضوع2"],
  "recommendations": ["توصية1", "توصية2"],
  "contentScore": 85
}
`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // محاولة استخراج JSON من النص
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }

      return null
    } catch (error) {
      console.error("خطأ في تحليل المنشور:", error)
      return null
    }
  }

  // توليد رؤى شاملة
  async generateOverallInsights(posts: any[]): Promise<GeminiInsight[]> {
    if (!this.model) return []

    try {
      const totalPosts = posts.length
      const totalComments = posts.reduce((sum, post) => sum + (post.comments?.data?.length || 0), 0)
      const totalReactions = posts.reduce((sum, post) => sum + (post.reactions?.summary?.total_count || 0), 0)

      const prompt = `
قم بتحليل هذه البيانات من صفحة فيسبوك وأعطني رؤى استراتيجية:

إجمالي المنشورات: ${totalPosts}
إجمالي التعليقات: ${totalComments}
إجمالي التفاعلات: ${totalReactions}

أريد رؤى من أنواع مختلفة:
- trend: اتجاهات ملاحظة
- anomaly: أشياء غير طبيعية
- opportunity: فرص للتحسين
- warning: تحذيرات

أعطني النتيجة بصيغة JSON array بهذا الشكل:
[
  {
    "type": "trend|anomaly|opportunity|warning",
    "title": "عنوان الرؤية",
    "description": "وصف مفصل",
    "confidence": 85,
    "actionable": true
  }
]
`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }

      return []
    } catch (error) {
      console.error("خطأ في توليد الرؤى:", error)
      return []
    }
  }

  // تحليل التعليقات
  async analyzeComments(comments: any[]): Promise<{ sentiment: string; themes: string[]; recommendations: string[] }> {
    if (!this.model || comments.length === 0) {
      return { sentiment: "neutral", themes: [], recommendations: [] }
    }

    try {
      const commentsText = comments.slice(0, 20).map(c => c.message).join("\n")
      
      const prompt = `
قم بتحليل هذه التعليقات من فيسبوك:

${commentsText}

أريد تحليل:
1. المشاعر العامة (positive/negative/neutral)
2. المواضيع المتكررة
3. توصيات للتفاعل

أعطني النتيجة بصيغة JSON:
{
  "sentiment": "positive|negative|neutral",
  "themes": ["موضوع1", "موضوع2"],
  "recommendations": ["توصية1", "توصية2"]
}
`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }

      return { sentiment: "neutral", themes: [], recommendations: [] }
    } catch (error) {
      console.error("خطأ في تحليل التعليقات:", error)
      return { sentiment: "neutral", themes: [], recommendations: [] }
    }
  }

  // توليد محتوى مقترح
  async generateContentSuggestions(topic: string, audience: string = "عام"): Promise<{ suggestions: string[]; error?: string }> {
    if (!this.model) {
      return { suggestions: [], error: "يجب تكوين Gemini AI أولاً" }
    }

    try {
      const prompt = `
أريد اقتراحات لمحتوى فيسبوك حول موضوع: "${topic}"
الجمهور المستهدف: ${audience}

أعطني 5 اقتراحات متنوعة ومبدعة للمنشورات بصيغة JSON:
{
  "suggestions": [
    "اقتراح 1",
    "اقتراح 2",
    "اقتراح 3",
    "اقتراح 4",
    "اقتراح 5"
  ]
}
`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return { suggestions: parsed.suggestions || [] }
      }

      return { suggestions: [] }
    } catch (error: any) {
      return { suggestions: [], error: error.message }
    }
  }

  // تحليل أفضل أوقات النشر
  async analyzeBestPostingTimes(posts: any[]): Promise<{ recommendations: any[]; error?: string }> {
    if (!this.model) {
      return { recommendations: [], error: "يجب تكوين Gemini AI أولاً" }
    }

    try {
      const postingData = posts.map(post => ({
        time: new Date(post.created_time).getHours(),
        engagement: (post.reactions?.summary?.total_count || 0) + (post.comments?.data?.length || 0)
      }))

      const prompt = `
قم بتحليل هذه البيانات حول أوقات النشر والتفاعل:

${JSON.stringify(postingData.slice(0, 50))}

أعطني توصيات لأفضل أوقات النشر بصيغة JSON:
{
  "recommendations": [
    {
      "timeRange": "20:00-22:00",
      "score": 85,
      "reason": "سبب التوصية"
    }
  ]
}
`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return { recommendations: parsed.recommendations || [] }
      }

      return { recommendations: [] }
    } catch (error: any) {
      return { recommendations: [], error: error.message }
    }
  }
}

export const geminiAIService = new GeminiAIService()
