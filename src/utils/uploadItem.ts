import { Timestamp, doc, getFirestore, setDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import getFileType from "./getFileType"
import { GalleryItemFromDBType } from "types/GalleryItemType"

interface Props {
  file: File
  audioCoverFile: File | null
  title: string
  description: string
}

export default async function uploadItem({ file, audioCoverFile, title, description } : Props) {
  const db = getFirestore()

  let data : GalleryItemFromDBType = {
    title: title,
    description: description,
    src: file.name,
    type: getFileType(file) as FileType,
    // For some reason the Firebase type says seconds and nanoseconds, but
    // the actual data in Firebase is seconds + ms. idk man this fixes it for now
    timestamp: Timestamp.now() as unknown as { seconds: number, milliseconds: number }
  }

  if(audioCoverFile) data.coverSrc = audioCoverFile.name

  const firebasePromise = setDoc(doc(db, 'files', getSlugFrom(title)), data).then(res => {
    console.log(res)
    return true
  }).catch(e => {
    console.error(e)
    return false
  })

  const storage = getStorage()

  const fileRef = ref(storage, file.name)

  const filePromise = uploadBytes(fileRef, file).then(res => {
    return true
  }).catch(e => {
    console.error(e)
    return false
  })

  if(!audioCoverFile) return Promise.all([firebasePromise, filePromise])

  const coverRef = ref(storage, audioCoverFile.name)

  const coverPromise = uploadBytes(coverRef, file).then(res => {
    return true
  }).catch(e => {
    console.error(e)
    return false
  })

  return Promise.all([firebasePromise, filePromise, coverPromise])
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