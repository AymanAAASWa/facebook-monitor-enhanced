"use client"

export interface DriveFile {
  id: string
  name: string
  size: string
  mimeType: string
  webViewLink: string
  downloadUrl?: string
}

export class GoogleDriveService {
  private accessToken = ""
  private apiKey = ""

  constructor() {
    // يمكن إعداد API Key من Google Cloud Console
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  // تسجيل الدخول بـ Google
  async signInWithGoogle(): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      // استخدام Google Identity Services
      const response = await new Promise<any>((resolve, reject) => {
        if (typeof window !== "undefined" && (window as any).google) {
          ;(window as any).google.accounts.oauth2
            .initTokenClient({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
              scope: "https://www.googleapis.com/auth/drive.readonly",
              callback: (response: any) => {
                if (response.access_token) {
                  resolve(response)
                } else {
                  reject(new Error("فشل في الحصول على رمز الوصول"))
                }
              },
            })
            .requestAccessToken()
        } else {
          reject(new Error("Google API غير محمل"))
        }
      })

      this.accessToken = response.access_token
      return { success: true, token: response.access_token }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // البحث عن ملفات في Google Drive
  async searchFiles(query = "", mimeType?: string): Promise<{ files: DriveFile[]; error?: string }> {
    try {
      let searchQuery = `name contains '${query}'`
      if (mimeType) {
        searchQuery += ` and mimeType='${mimeType}'`
      }

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(searchQuery)}&fields=files(id,name,size,mimeType,webViewLink)`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      )

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return { files: result.files || [] }
    } catch (error: any) {
      return { files: [], error: error.message }
    }
  }

  // تحميل ملف من Google Drive للبحث المحلي
  async downloadFileForSearch(fileId: string): Promise<{ success: boolean; content?: string; error?: string }> {
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const content = await response.text()
      return { success: true, content }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // الحصول على معلومات الملف
  async getFileInfo(fileId: string): Promise<{ file?: DriveFile; error?: string }> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,size,mimeType,webViewLink`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      )

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return { file: result }
    } catch (error: any) {
      return { error: error.message }
    }
  }
}

export const googleDriveService = new GoogleDriveService()
