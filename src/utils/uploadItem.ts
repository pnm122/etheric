import { Timestamp, doc, getFirestore, setDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import getFileType from "./getFileType"

interface Props {
  file: File
  title: string
  description: string
}

export default async function uploadItem({ file, title, description } : Props) {
  const db = getFirestore()

  const firebasePromise = setDoc(doc(db, 'files', getSlugFrom(title)), {
    title: title,
    description: description,
    src: file.name,
    type: getFileType(file),
    timestamp: Timestamp.now()
  }).then(res => {
    console.log(res)
    return true
  }).catch(e => {
    console.error(e)
    return false
  })

  const storage = getStorage()

  const r = ref(storage, file.name)

  const storagePromise = uploadBytes(r, file).then(res => {
    return true
  }).catch(e => {
    console.error(e)
    return false
  })

  return Promise.all([firebasePromise, storagePromise])
}

// turn the title into a slug to use as the URL later
// TODO: needs to be filtered into alphanumeric only
// TODO: remove unnecessary spaces
function getSlugFrom(title : string) {
  let newTitle = title.trim()
  // Since they cause issues with URLs
  for(let char of newTitle) {
    console.log(char)
  }

  return newTitle.toLowerCase().split(' ').join('-')
}