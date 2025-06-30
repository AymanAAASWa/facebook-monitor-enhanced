import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBJ7x6EOq9p4GNDa-zaHmGO9kXRaMjZp3k",
  authDomain: "bestcostomize.firebaseapp.com",
  databaseURL: "https://bestcostomize-default-rtdb.firebaseio.com",
  projectId: "bestcostomize",
  storageBucket: "bestcostomize.appspot.com",
  messagingSenderId: "535416748819",
  appId: "1:535416748819:web:b3a519abb36de5bbc7f8e6",
  measurementId: "G-PPVMVD9Q9P",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
