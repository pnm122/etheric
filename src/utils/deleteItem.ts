import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";

export default async function deleteItem(id: string, src: string) {
  const db = getFirestore()
  const storage = getStorage()

  const firebaseDelete = deleteDoc(doc(db, 'files', id)).then(res => {
    return true
  }).catch(e => {
    console.error(e)
    return false
  })

  const storageDelete = deleteObject(ref(storage, src)).then(res => {
    return true
  }).catch(e => {
    console.error(e)
    return false
  })

  return Promise.all([firebaseDelete, storageDelete])
}