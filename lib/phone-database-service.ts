"use client"

import { firebaseService } from "./firebase-service"

export interface PhoneRecord {
  id: string
  name: string
  phone: string
  location?: string
  notes?: string
  source?: string
  createdAt: string
  updatedAt: string
  verified?: boolean
  tags?: string[]
}

export interface DatabaseStats {
  totalRecords: number
  uniqueNumbers: number
  dataSize: number
  lastUpdated: string
}

export interface SearchResult {
  records: PhoneRecord[]
  total: number
  query: string
}

class PhoneDatabaseService {
  private records: Map<string, PhoneRecord> = new Map()
  private isLoaded = false

  // إضافة سجل جديد
  addRecord(record: Omit<PhoneRecord, "id" | "createdAt" | "updatedAt">): PhoneRecord {
    const id = this.generateId()
    const now = new Date().toISOString()

    const newRecord: PhoneRecord = {
      ...record,
      id,
      createdAt: now,
      updatedAt: now,
    }

    this.records.set(id, newRecord)
    return newRecord
  }

  // تحديث سجل موجود
  updateRecord(id: string, updates: Partial<PhoneRecord>): PhoneRecord | null {
    const existing = this.records.get(id)
    if (!existing) return null

    const updated: PhoneRecord = {
      ...existing,
      ...updates,
      id, // تأكد من عدم تغيير المعرف
      createdAt: existing.createdAt, // تأكد من عدم تغيير تاريخ الإنشاء
      updatedAt: new Date().toISOString(),
    }

    this.records.set(id, updated)
    return updated
  }

  // حذف سجل
  deleteRecord(id: string): boolean {
    return this.records.delete(id)
  }

  // الحصول على سجل بالمعرف
  getRecord(id: string): PhoneRecord | null {
    return this.records.get(id) || null
  }

  // الحصول على جميع السجلات
  getAllRecords(): PhoneRecord[] {
    return Array.from(this.records.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  }

  // البحث في السجلات
  search(query: string): SearchResult {
    if (!query.trim()) {
      const allRecords = this.getAllRecords()
      return {
        records: allRecords,
        total: allRecords.length,
        query: query.trim(),
      }
    }

    const searchTerm = query.toLowerCase().trim()
    const results = this.getAllRecords().filter(
      (record) =>
        record.name.toLowerCase().includes(searchTerm) ||
        record.phone.includes(searchTerm) ||
        record.location?.toLowerCase().includes(searchTerm) ||
        record.notes?.toLowerCase().includes(searchTerm) ||
        record.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )

    return {
      records: results,
      total: results.length,
      query: query.trim(),
    }
  }

  // الحصول على إحصائيات قاعدة البيانات
  getStats(): DatabaseStats {
    const records = this.getAllRecords()
    const uniqueNumbers = new Set(records.map((r) => r.phone)).size
    const dataSize = JSON.stringify(records).length
    const lastUpdated =
      records.length > 0
        ? records.reduce(
            (latest, record) => (new Date(record.updatedAt) > new Date(latest) ? record.updatedAt : latest),
            records[0].updatedAt,
          )
        : new Date().toISOString()

    return {
      totalRecords: records.length,
      uniqueNumbers,
      dataSize,
      lastUpdated,
    }
  }

  // تحميل البيانات التجريبية
  loadTestData(): void {
    const testRecords = [
      {
        name: "أحمد محمد",
        phone: "+966501234567",
        location: "الرياض، السعودية",
        notes: "صديق من الجامعة",
        source: "facebook",
        verified: true,
        tags: ["صديق", "جامعة"],
      },
      {
        name: "فاطمة علي",
        phone: "+971501234567",
        location: "دبي، الإمارات",
        notes: "زميلة في العمل",
        source: "linkedin",
        verified: true,
        tags: ["عمل", "زميلة"],
      },
      {
        name: "محمد حسن",
        phone: "+201012345678",
        location: "القاهرة، مصر",
        notes: "عميل مهم",
        source: "business_card",
        verified: false,
        tags: ["عميل", "مهم"],
      },
      {
        name: "سارة أحمد",
        phone: "+96170123456",
        location: "بيروت، لبنان",
        notes: "مصممة جرافيك موهوبة",
        source: "referral",
        verified: true,
        tags: ["مصمم", "موهوب", "إبداع"],
      },
    ]

    testRecords.forEach((record) => {
      this.addRecord(record)
    })

    console.log(`تم تحميل ${testRecords.length} سجل تجريبي`)
  }

  // مسح جميع البيانات
  clearAll(): void {
    this.records.clear()
  }

  // تصدير البيانات إلى JSON
  exportToJSON(): string {
    const data = {
      records: this.getAllRecords(),
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }
    return JSON.stringify(data, null, 2)
  }

  // استيراد البيانات من ملف
  async importFromFile(file: File): Promise<{ success: boolean; message: string; imported: number }> {
    try {
      const text = await file.text()
      let data: any

      if (file.name.endsWith(".json")) {
        data = JSON.parse(text)

        if (data.records && Array.isArray(data.records)) {
          let imported = 0
          data.records.forEach((record: any) => {
            if (record.name && record.phone) {
              this.addRecord({
                name: record.name,
                phone: record.phone,
                location: record.location || "",
                notes: record.notes || "",
                source: record.source || "import",
                verified: record.verified || false,
                tags: record.tags || [],
              })
              imported++
            }
          })

          return {
            success: true,
            message: `تم استيراد ${imported} سجل بنجاح`,
            imported,
          }
        }
      } else if (file.name.endsWith(".csv")) {
        const lines = text.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

        let imported = 0
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))

          if (values.length >= 2 && values[0] && values[1]) {
            this.addRecord({
              name: values[0],
              phone: values[1],
              location: values[2] || "",
              notes: values[3] || "",
              source: "csv_import",
              verified: false,
              tags: [],
            })
            imported++
          }
        }

        return {
          success: true,
          message: `تم استيراد ${imported} سجل من ملف CSV`,
          imported,
        }
      }

      return {
        success: false,
        message: "تنسيق الملف غير مدعوم. يرجى استخدام JSON أو CSV",
        imported: 0,
      }
    } catch (error: any) {
      return {
        success: false,
        message: `خطأ في استيراد الملف: ${error.message}`,
        imported: 0,
      }
    }
  }

  // حفظ في Firebase
  async saveToFirebase(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const records = this.getAllRecords()
      const result = await firebaseService.savePhoneRecords(userId, records)
      return result
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // تحميل من Firebase
  async loadFromFirebase(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await firebaseService.getPhoneRecords(userId)
      if (result.success && result.data) {
        this.records.clear()
        result.data.forEach((record: PhoneRecord) => {
          this.records.set(record.id, record)
        })
        this.isLoaded = true
        return { success: true }
      }
      return result
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // توليد معرف فريد
  private generateId(): string {
    return `phone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // التحقق من حالة التحميل
  isDataLoaded(): boolean {
    return this.isLoaded
  }

  // تعيين حالة التحميل
  setLoaded(loaded: boolean): void {
    this.isLoaded = loaded
  }
}

export const phoneDatabaseService = new PhoneDatabaseService()
