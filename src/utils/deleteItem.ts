import { deleteDoc, doc, getFirestore } from "firebase/firestore";

export default async function deleteItem(id: string) {
  const db = getFirestore()

  return deleteDoc(doc(db, 'files', id)).then(res => {
    return true
  }).catch(e => {
    console.error(e)
    return false
  })
}