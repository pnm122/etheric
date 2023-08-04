import { doc, getFirestore, setDoc } from "firebase/firestore";

export default async function setTitle(title: string) {
  const db = getFirestore()

  try {
    await setDoc(doc(db, 'metadata', 'metadata'), {
      site_title: title
    }, {
      merge: true
    })

    return true
  } catch(e) {
    console.error(e)
    return false
  }
}