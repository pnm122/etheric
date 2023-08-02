import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import GalleryItemType, { GalleryItemWithURLType } from "types/GalleryItemType";

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
      console.error('No data') 
      return {
        hasError: true,
        error: `${slug} not found in the database.`,
        data: undefined
      }
    }

    // Once the item has been found, get src
    // This is the path to the file in the Firebase Storage
    const path = (data as GalleryItemType).src

    // Create a reference to the file we want to download
    const storage = getStorage();
    const starsRef = ref(storage, path);
    
    try {
      // Get the download URL
      const url = await getDownloadURL(starsRef);
      data.url = url
      return {
        hasError: false,
        error: undefined,
        data: (data as GalleryItemType & { url: string })
      }
    } catch (error : any) {
      if(error && (typeof error.code != 'string')) {
        console.error(`Unknown error: ${error}`)
        return {
          hasError: true,
          error: error,
          data: undefined
        }
      }

      let errorMessage;

      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          errorMessage = `Firebase Storage: ${path} not found.`
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          errorMessage = `Firebase Storage: Access to ${path} forbidden`
          break;
        case 'storage/canceled':
          // User canceled the upload
          errorMessage = `Firebase Storage: Upload to ${path} was canceled`
          break;
        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          errorMessage = `Firebase Storage: Unknown error at ${path}`
          break;
        default:
          errorMessage = `Firebase Storage: Not sure what happened at ${path}`
          break;
      }

      return {
        hasError: true,
        error: errorMessage,
        data: undefined
      }
    }
  } catch(e) {
    return {
      hasError: true,
      error: e,
      data: undefined
    }
  }
}