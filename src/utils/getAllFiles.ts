import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { GalleryItemWithURLType } from "types/GalleryItemType";

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
    const data = doc.data();

    (data as GalleryItemWithURLType).slug = doc.id

    const coverSrc = (data as GalleryItemWithURLType).coverSrc
    let coverPromise : Promise<boolean> | null = null
    if(coverSrc) {
      coverPromise = getDownloadURL(ref(storage, coverSrc)).then(res => {
        data!.coverUrl = res
        return true
      }).catch(() => {
        return false
      })
    }

    let pathPromises : Promise<boolean>[] = [];
    (data as GalleryItemWithURLType).url = []

    // Once the item has been found, get the storage URLs for every item in src
    // Only multiple items for audio uploads, since they can have multiple audio files
    for(const path of (data as GalleryItemWithURLType).src) {
      // Create a reference to the file we want to download
      const r = ref(storage, path);
      
      // Get the download URL
      const pathPromise = getDownloadURL(r).then(res => {
        (data as GalleryItemWithURLType).url.push(res)
        return true
      }).catch(() => {
        return false
      })

      pathPromises.push(pathPromise)
    }

    const res = coverPromise ? await Promise.all([coverPromise, ...pathPromises]) : await Promise.all(pathPromises)
  
    // Make sure all promises pass
    for(const r of res) {
      if(!r) {
        error = true
        return
      }
    }

    fileList.push(data as GalleryItemWithURLType)
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