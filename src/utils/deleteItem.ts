import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";

export default async function deleteItem(id: string, src: string[], coverSrc: string | undefined) {
  const db = getFirestore()
  const storage = getStorage()

  const firebaseDelete = deleteDoc(doc(db, 'files', id)).then(() => {
    return true
  }).catch(e => {
    console.error(e)
    return false
  })

  let fileDeletePromises : Promise<boolean>[] = []

  for(const s of src) {
    const fileDeletePromise = deleteObject(ref(storage, s)).then(() => {
      return true
    }).catch(e => {
      console.error(e)
      return false
    })

    fileDeletePromises.push(fileDeletePromise)
  }

  if(!coverSrc) return Promise.all([firebaseDelete, fileDeletePromises])

  const coverDelete = deleteObject(ref(storage, coverSrc)).then(() => {
    return true
  }).catch(e => {
    console.error(e)
    return false
  })

  return Promise.all([firebaseDelete, fileDeletePromises, coverDelete])
}