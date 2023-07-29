import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, query } from "firebase/firestore";

export default async function isAdmin() {
  const auth = getAuth()
  const db = getFirestore()

  // Query admins collection. 
  // If the current user is an admin (listed within the admins collection), this works successfully
  // If the current user is not an admin, an error is returned
  const ref = collection(db, 'admins')
  const q = query(ref)
  try {
    const snap = await getDocs(q)
    return true
  } catch(e) {
    return false
  }
}