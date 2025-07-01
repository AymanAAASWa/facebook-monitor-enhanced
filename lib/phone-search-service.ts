"use client"

export interface PhoneSearchResult {
  phone?: string
  found: boolean
  error?: string
}

export class PhoneSearchService {
  private phoneDatabase: Map<string, string> = new Map()
  private isLoaded = false
  private loadingPromise: Promise<void> | null = null

  async loadPhoneDatabase(file: File): Promise<{ success: boolean; error?: string; count?: number }> {
    try {
      this.phoneDatabase.clear()

      const text = await file.text()
      const lines = text.split("\n")
      let count = 0

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (!trimmedLine) continue

        // دعم تنسيقات مختلفة للملف
        // التنسيق المتوقع: user_id,phone أو user_id:phone أو user_id|phone
        const separators = [",", ":", "|", "\t", " "]
        let parts: string[] = []

        for (const separator of separators) {
          if (trimmedLine.includes(separator)) {
            parts = trimmedLine.split(separator)
            break
          }
        }

        if (parts.length >= 2) {
          const userId = parts[0].trim()
          const phone = parts[1].trim()

          if (userId && phone) {
            this.phoneDatabase.set(userId, phone)
            count++
          }
        }
      }

      this.isLoaded = true
      return { success: true, count }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async searchPhone(userId: string): Promise<PhoneSearchResult> {
    if (!this.isLoaded) {
      return { found: false, error: "قاعدة بيانات الأرقام غير محملة" }
    }

    const phone = this.phoneDatabase.get(userId)

    if (phone) {
      // حفظ النتيجة في localStorage للاستخدام المستقبلي
      const savedResults = JSON.parse(localStorage.getItem("phone_search_results") || "{}")
      savedResults[userId] = phone
      localStorage.setItem("phone_search_results", JSON.stringify(savedResults))

      return { found: true, phone }
    }

    return { found: false }
  }

  getDatabaseSize(): number {
    return this.phoneDatabase.size
  }

  isReady(): boolean {
    return this.isLoaded
  }

  // البحث المتقدم بالاسم أو جزء من الرقم
  async advancedSearch(query: string): Promise<Array<{ userId: string; phone: string }>> {
    if (!this.isLoaded) return []

    const results: Array<{ userId: string; phone: string }> = []
    const queryLower = query.toLowerCase()

    for (const [userId, phone] of this.phoneDatabase.entries()) {
      if (userId.toLowerCase().includes(queryLower) || phone.includes(query)) {
        results.push({ userId, phone })
        if (results.length >= 50) break // حد أقصى للنتائج
      }
    }

    return results
  }
}

export const phoneSearchService = new PhoneSearchService()
