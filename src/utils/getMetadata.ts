import { doc, getDoc, getFirestore } from "firebase/firestore";

export default async function getMetadata() {
  const db = getFirestore()

  try {
    const d = await getDoc(doc(db, 'metadata', 'metadata'))

    if(!d.exists()) {
      console.error('Metadata not found...check Firestore')
      return false
    }

    return (d.data() as Metadata)
  } catch(e) {
    console.error(e)
    return false
  }
}