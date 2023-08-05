import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import GalleryItemType, { GalleryItemWithURLType } from "types/GalleryItemType";

export default async function getAllFiles() : Promise<GalleryItemWithURLType[] | boolean> {
  const db = getFirestore()
  const storage = getStorage()
  const c = collection(db, 'files')
  const files = await getDocs(c)
  let fileList : GalleryItemWithURLType[] = []
  let error = false
  
  // Map each document (file metadata) to a function which accesses the storage
  // to get the source file and add it to the data returned from the DB
  // These data objects are then added to the fileList array
  const promises = files.docs.map(async doc => {
    const data = doc.data()

    // Once the item has been found, get src
    // This is the path to the file in the Firebase Storage
    const path = (data as GalleryItemType).src

    // Create a reference to the file we want to download
    const starsRef = ref(storage, path);
    
    try {
      // Get the download URL
      const url = await getDownloadURL(starsRef);
      (data as GalleryItemWithURLType).url = url

      const coverSrc = (data as GalleryItemWithURLType).coverSrc
      if(coverSrc) {
        const coverUrl = await getDownloadURL(ref(storage, coverSrc))
        data.coverUrl = coverUrl
      }

      (data as GalleryItemWithURLType).slug = doc.id

      fileList.push(data as GalleryItemWithURLType)
    } catch (error : any) {
      console.error(error)
      error = true
    }
  })

  // Since accessing storage is asynchronous, we have to wait for each function
  // to end before continuing
  await Promise.all(promises)

  if(error) return false

  fileList = fileList.sort((file1, file2) => {
    return file2.timestamp.seconds - file1.timestamp.seconds
  })

  return fileList
}