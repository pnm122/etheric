import { QuerySnapshot, collection, getDocs, getFirestore, query } from "firebase/firestore";
import GalleryItemsType from "types/GalleryItemsType";

export default async function getGalleryItems() : Promise<GalleryItemsType> {
  const db = getFirestore()

  const ref = collection(db, 'files')
  const q = query(ref)
  try {
    const snap = await getDocs(q)
    return snap
  } catch(e) {
    return null
  }
}