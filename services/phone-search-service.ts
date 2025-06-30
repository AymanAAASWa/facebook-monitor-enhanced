import { LargeFilePhoneSearcher } from "@/lib/large-file-searcher"
import { FirebaseService } from "./firebase-service"
import { convertGoogleDriveUrl } from "@/lib/utils"
import type { SavedPhone } from "@/types"

export class PhoneSearchService {
  private largeFileSearcher: LargeFilePhoneSearcher | null = null
  private phoneDataMap: Map<string, string> = new Map()
  private phoneDataText = ""
  private savedPhones: SavedPhone[] = []

  constructor() {
    this.largeFileSearcher = new LargeFilePhoneSearcher()
  }

  setPhoneDataText(text: string) {
    this.phoneDataText = text
  }

  setPhoneDataMap(map: Map<string, string>) {
    this.phoneDataMap = map
  }

  setSavedPhones(phones: SavedPhone[]) {
    this.savedPhones = phones
  }

  async indexLargeFile(file: File): Promise<number> {
    if (!this.largeFileSearcher) {
      throw new Error("Large file searcher not initialized")
    }
    return await this.largeFileSearcher.indexFile(file)
  }

  async searchPhoneInLargeFile(userId: string): Promise<string | null> {
    if (!this.largeFileSearcher) {
      return null
    }
    try {
      return await this.largeFileSearcher.searchPhone(userId)
    } catch (error) {
      console.error("Error searching in large file:", error)
      return null
    }
  }

  searchPhoneInSaved(userId: string): string | null {
    const saved = this.savedPhones.find((p) => p.userId === userId)
    return saved?.phone || null
  }

  async searchPhoneInFile(userId: string, isIndexed: boolean): Promise<string | null> {
    // First check large file searcher
    if (isIndexed && this.largeFileSearcher) {
      return await this.searchPhoneInLargeFile(userId)
    }

    // Fallback to in-memory map
    if (this.phoneDataMap.has(userId)) {
      return this.phoneDataMap.get(userId) || null
    }

    // Fallback to text parsing for small files
    if (!this.phoneDataText.trim()) return null

    try {
      const phoneData = JSON.parse(this.phoneDataText)
      return phoneData[userId] || null
    } catch (error) {
      console.error("Error parsing phone data:", error)
      return null
    }
  }

  async searchPhoneViaAPI(userId: string, phoneFileUrl: string): Promise<string | null> {
    if (!phoneFileUrl.trim()) return null

    try {
      const processedUrl = convertGoogleDriveUrl(phoneFileUrl)
      const response = await fetch("/api/phone-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          fileUrl: processedUrl,
        }),
      })

      const data = await response.json()
      return data.phone || null
    } catch (error) {
      console.error("Error searching via API:", error)
      return null
    }
  }

  async searchPhone(
    userId: string,
    currentUserId: string,
    phoneFileUrl: string,
    isIndexed: boolean,
  ): Promise<string | null> {
    // First check saved phones
    const savedPhone = this.searchPhoneInSaved(userId)
    if (savedPhone) return savedPhone

    // Search in Firebase database
    const firebasePhone = await FirebaseService.searchPhoneInDatabase(currentUserId, userId)
    if (firebasePhone) return firebasePhone

    // Search via API if URL is provided
    if (phoneFileUrl.trim()) {
      const apiPhone = await this.searchPhoneViaAPI(userId, phoneFileUrl)
      if (apiPhone) return apiPhone
    }

    // Search in local file
    if (this.phoneDataText.trim() || this.phoneDataMap.size > 0 || isIndexed) {
      const filePhone = await this.searchPhoneInFile(userId, isIndexed)
      if (filePhone) return filePhone
    }

    return null
  }

  destroy() {
    if (this.largeFileSearcher) {
      this.largeFileSearcher.destroy()
    }
  }
}
