import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, getDocs } from "firebase/firestore"
import { auth, db } from "./firebase"

export interface UserSettings {
  accessToken: string
  sources: Array<{
    id: string
    name: string
    type: "group" | "page"
  }>
  keywords: string[]
  notifications: {
    enabled: boolean
    keywords: boolean
    newPosts: boolean
    phoneFound: boolean
  }
  monitoring: {
    interval: number
    autoRefresh: boolean
    maxPosts: number
  }
  phoneDatabase: {
    [userId: string]: string
  }
}

export interface SavedPost {
  id: string
  userId: string
  postData: any
  timestamp: number
  source: string
}

export interface PhoneRecord {
  id: string
  userId: string
  phone: string
  userName: string
  source: string
  foundAt: number
  verified: boolean
}

export class FirebaseService {
  // Authentication
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: result.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async signUp(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      // إنشاء إعدادات افتراضية للمستخدم الجديد
      await this.saveUserSettings(result.user.uid, {
        accessToken: "",
        sources: [],
        keywords: [],
        notifications: {
          enabled: true,
          keywords: true,
          newPosts: false,
          phoneFound: true,
        },
        monitoring: {
          interval: 300,
          autoRefresh: true,
          maxPosts: 100,
        },
        phoneDatabase: {},
      })
      return { success: true, user: result.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async signOut(): Promise<void> {
    await signOut(auth)
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback)
  }

  // User Settings
  async saveUserSettings(userId: string, settings: UserSettings): Promise<{ success: boolean; error?: string }> {
    try {
      await setDoc(doc(db, "userSettings", userId), {
        ...settings,
        updatedAt: Date.now(),
      })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async getUserSettings(userId: string): Promise<{ success: boolean; data?: UserSettings; error?: string }> {
    try {
      const docRef = doc(db, "userSettings", userId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() as UserSettings }
      } else {
        // إرجاع إعدادات افتراضية
        const defaultSettings: UserSettings = {
          accessToken: "",
          sources: [],
          keywords: [],
          notifications: {
            enabled: true,
            keywords: true,
            newPosts: false,
            phoneFound: true,
          },
          monitoring: {
            interval: 300,
            autoRefresh: true,
            maxPosts: 100,
          },
          phoneDatabase: {},
        }
        return { success: true, data: defaultSettings }
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Phone Database
  async savePhoneRecord(
    userId: string,
    record: Omit<PhoneRecord, "id">,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await addDoc(collection(db, "phoneRecords"), {
        ...record,
        userId,
        createdAt: Date.now(),
      })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async getPhoneRecords(userId: string): Promise<{ success: boolean; data?: PhoneRecord[]; error?: string }> {
    try {
      const q = query(collection(db, "phoneRecords"), where("userId", "==", userId), orderBy("foundAt", "desc"))
      const querySnapshot = await getDocs(q)
      const records: PhoneRecord[] = []

      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() } as PhoneRecord)
      })

      return { success: true, data: records }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Posts Management
  async savePost(userId: string, postData: any, source: string): Promise<{ success: boolean; error?: string }> {
    try {
      await addDoc(collection(db, "savedPosts"), {
        userId,
        postData,
        source,
        timestamp: Date.now(),
      })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async getSavedPosts(userId: string): Promise<{ success: boolean; data?: SavedPost[]; error?: string }> {
    try {
      const q = query(collection(db, "savedPosts"), where("userId", "==", userId), orderBy("timestamp", "desc"))
      const querySnapshot = await getDocs(q)
      const posts: SavedPost[] = []

      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() } as SavedPost)
      })

      return { success: true, data: posts }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Phone Database JSON Upload
  async uploadPhoneDatabase(
    userId: string,
    phoneData: { [userId: string]: string },
  ): Promise<{ success: boolean; error?: string; count?: number }> {
    try {
      // حفظ قاعدة البيانات في إعدادات المستخدم
      const currentSettings = await this.getUserSettings(userId)
      if (currentSettings.success && currentSettings.data) {
        const updatedSettings = {
          ...currentSettings.data,
          phoneDatabase: phoneData,
        }
        await this.saveUserSettings(userId, updatedSettings)
        return { success: true, count: Object.keys(phoneData).length }
      }
      return { success: false, error: "Failed to get current settings" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}

export const firebaseService = new FirebaseService()
