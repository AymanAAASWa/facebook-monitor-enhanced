"use client"

export interface PhoneRecord {
  userId: string
  phone: string
  name?: string
  source?: string
  verified?: boolean
  lastUpdated?: number
}

export interface SearchResult {
  found: boolean
  phone?: string
  record?: PhoneRecord
  error?: string
}

export class LargeFileSearchService {
  private fileContent = ""
  private isLoaded = false
  private searchIndex: Map<string, string> = new Map()
  private loadingProgress = 0
  private onProgressCallback?: (progress: number) => void

  async loadFileForSearch(
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<{ success: boolean; error?: string; count?: number }> {
    this.onProgressCallback = onProgress

    try {
      // قراءة الملف على دفعات لتجنب مشاكل الذاكرة
      const chunkSize = 1024 * 1024 // 1MB chunks
      const totalSize = file.size
      let offset = 0
      const content = ""

      this.searchIndex.clear()

      while (offset < totalSize) {
        const chunk = file.slice(offset, offset + chunkSize)
        const chunkText = await this.readChunk(chunk)

        // معالجة الدفعة الحالية
        await this.processChunk(chunkText, offset === 0)

        offset += chunkSize
        this.loadingProgress = Math.min((offset / totalSize) * 100, 100)

        if (this.onProgressCallback) {
          this.onProgressCallback(this.loadingProgress)
        }

        // إعطاء المتصفح فرصة للتنفس
        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      this.isLoaded = true
      return { success: true, count: this.searchIndex.size }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  private async readChunk(chunk: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => reject(new Error("خطأ في قراءة الملف"))
      reader.readAsText(chunk)
    })
  }

  private async processChunk(chunkText: string, isFirstChunk: boolean): Promise<void> {
    const lines = chunkText.split("\n")

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      try {
        // محاولة تحليل JSON
        if (trimmedLine.startsWith("{") || trimmedLine.startsWith("[")) {
          const jsonData = JSON.parse(trimmedLine)
          this.processJsonData(jsonData)
        } else {
          // تحليل تنسيقات أخرى
          this.processTextLine(trimmedLine)
        }
      } catch (error) {
        // إذا فشل JSON، جرب التنسيقات الأخرى
        this.processTextLine(trimmedLine)
      }
    }
  }

  private processJsonData(jsonData: any): void {
    if (Array.isArray(jsonData)) {
      jsonData.forEach((item) => {
        if (item.userId && item.phone) {
          this.searchIndex.set(item.userId, item.phone)
        }
      })
    } else if (typeof jsonData === "object") {
      Object.entries(jsonData).forEach(([userId, phone]) => {
        if (userId && phone) {
          this.searchIndex.set(userId, phone as string)
        }
      })
    }
  }

  private processTextLine(line: string): void {
    // دعم تنسيقات مختلفة
    const separators = [",", ":", "|", "\t", " "]

    for (const separator of separators) {
      if (line.includes(separator)) {
        const parts = line.split(separator)
        if (parts.length >= 2) {
          const userId = parts[0].trim()
          const phone = parts[1].trim()
          if (userId && phone) {
            this.searchIndex.set(userId, phone)
            break
          }
        }
      }
    }
  }

  async searchPhone(userId: string): Promise<SearchResult> {
    if (!this.isLoaded) {
      return { found: false, error: "الملف غير محمل للبحث" }
    }

    const phone = this.searchIndex.get(userId)

    if (phone) {
      return {
        found: true,
        phone,
        record: {
          userId,
          phone,
          lastUpdated: Date.now(),
        },
      }
    }

    return { found: false }
  }

  async advancedSearch(query: string): Promise<PhoneRecord[]> {
    if (!this.isLoaded) return []

    const results: PhoneRecord[] = []
    const queryLower = query.toLowerCase()

    for (const [userId, phone] of this.searchIndex.entries()) {
      if (userId.toLowerCase().includes(queryLower) || phone.includes(query)) {
        results.push({
          userId,
          phone,
          lastUpdated: Date.now(),
        })

        if (results.length >= 50) break
      }
    }

    return results
  }

  getDatabaseSize(): number {
    return this.searchIndex.size
  }

  isReady(): boolean {
    return this.isLoaded
  }

  getProgress(): number {
    return this.loadingProgress
  }
}

export const largeFileSearchService = new LargeFileSearchService()
