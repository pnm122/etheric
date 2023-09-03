import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { GalleryItemWithURLType } from "types/GalleryItemType";

interface Return {
  hasError: boolean
  error: any | undefined
  data: GalleryItemWithURLType | undefined
}

export default async function getFile(slug: string) : Promise<Return> {
  const db = getFirestore()

  try {
    // File names match the URL slug
    // Fetch the item with this slug as its name
    const r = doc(db, 'files', slug)
    const d = await getDoc(r)
    let data = d.data()

    if(!data) {
      return {
        hasError: true,
        error: `${slug} not found in the database.`,
        data: undefined
      }
    }

    const storage = getStorage();

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
        
      //   if(error && (typeof error.code != 'string')) {
      //     console.error(`Unknown error: ${error}`)
      //     return {
      //       hasError: true,
      //       error: error,
      //       data: undefined
      //     }
      //   }

      //   let errorMessage;

      //   // A full list of error codes is available at
      //   // https://firebase.google.com/docs/storage/web/handle-errors
      //   switch (error.code) {
      //     case 'storage/object-not-found':
      //       // File doesn't exist
      //       errorMessage = `Firebase Storage: ${path} not found.`
      //       break;
      //     case 'storage/unauthorized':
      //       // User doesn't have permission to access the object
      //       errorMessage = `Firebase Storage: Access to ${path} forbidden`
      //       break;
      //     case 'storage/canceled':
      //       // User canceled the upload
      //       errorMessage = `Firebase Storage: Upload to ${path} was canceled`
      //       break;
      //     case 'storage/unknown':
      //       // Unknown error occurred, inspect the server response
      //       errorMessage = `Firebase Storage: Unknown error at ${path}`
      //       break;
      //     default:
      //       errorMessage = `Firebase Storage: Not sure what happened at ${path}`
      //       break;
      //   }

      //   return {
      //     hasError: true,
      //     error: errorMessage,
      //     data: undefined
      //   }
      // }

      // return {
      //   hasError: false,
      //   error: undefined,
      //   data: (data as GalleryItemWithURLType)
      // }
    }

    const res = coverPromise ? await Promise.all([coverPromise, ...pathPromises]) : await Promise.all(pathPromises)
  
    // Make sure all promises pass
    let ok = true
    for(const r of res) {
      if(!r) {
        ok = false
        break
      }
    }

    if(!ok) {
      return {
        hasError: true,
        error: 'An error occurred retreiving files',
        data: undefined
      }
    }

    return {
      hasError: false,
      error: undefined,
      data: (data as GalleryItemWithURLType)
    }
  } catch(e) {
    return {
      hasError: true,
      error: e,
      data: undefined
    }
  }
}