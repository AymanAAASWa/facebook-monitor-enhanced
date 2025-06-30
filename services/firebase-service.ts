import { doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, writeBatch } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { FacebookSettings, SavedPhone } from "@/types"

export class FirebaseService {
  static async saveSettings(userId: string, settings: FacebookSettings) {
    try {
      console.log("Saving settings to Firebase for user:", userId)
      await setDoc(doc(db, "FACEBOOK_SETTINGS", userId), {
        ...settings,
        lastUpdated: new Date(),
        userId: userId, // إضافة معرف المستخدم للتأكد
      })
      console.log("Settings saved successfully")
    } catch (error) {
      console.error("Error saving settings to Firebase:", error)
      throw error
    }
  }

  static async loadSettings(userId: string): Promise<FacebookSettings | null> {
    try {
      console.log("Loading settings from Firebase for user:", userId)
      const docRef = doc(db, "FACEBOOK_SETTINGS", userId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as FacebookSettings
        console.log("Settings loaded successfully:", data)
        return data
      } else {
        console.log("No settings found for user:", userId)
        return null
      }
    } catch (error) {
      console.error("Error loading settings from Firebase:", error)
      throw error
    }
  }

  static async savePhone(userId: string, phoneData: SavedPhone & { ownerId: string }) {
    await addDoc(collection(db, "SAVED_PHONES"), phoneData)
  }

  static async loadSavedPhones(userId: string): Promise<SavedPhone[]> {
    const q = query(collection(db, "SAVED_PHONES"), where("ownerId", "==", userId))
    const querySnapshot = await getDocs(q)

    const phones: SavedPhone[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      phones.push({
        userId: data.userId,
        userName: data.userName,
        phone: data.phone,
        discoveredAt: data.discoveredAt.toDate(),
        source: data.source,
      })
    })

    return phones
  }

  static async uploadPhoneData(userId: string, phoneData: Record<string, string>) {
    const batch = writeBatch(db)
    let count = 0

    for (const [phoneUserId, phone] of Object.entries(phoneData)) {
      const docRef = doc(collection(db, "PHONE_DATABASE"))
      batch.set(docRef, {
        userId: phoneUserId,
        phone,
        ownerId: userId,
        uploadedAt: new Date(),
      })
      count++

      if (count % 500 === 0) {
        await batch.commit()
      }
    }

    if (count % 500 !== 0) {
      await batch.commit()
    }

    return count
  }

  static async searchPhoneInDatabase(userId: string, phoneUserId: string): Promise<string | null> {
    const q = query(
      collection(db, "PHONE_DATABASE"),
      where("userId", "==", phoneUserId),
      where("ownerId", "==", userId),
    )
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return doc.data().phone || null
    }

    return null
  }
}
