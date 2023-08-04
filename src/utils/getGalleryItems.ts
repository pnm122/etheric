import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import GalleryItemType from "types/GalleryItemType";
import GalleryItemsType from "types/GalleryItemsType";

export default async function getGalleryItems() : Promise<GalleryItemsType> {
  const db = getFirestore()

  const ref = collection(db, 'files')
  const q = query(ref)
  try {
    const snap = await getDocs(q)
    let items = snap.docs.map(d => {
      const data = d.data()
      data.slug = d.id

      return data
    })

    items = (items as GalleryItemType[]).sort((item1, item2) => {
      return item2.timestamp.seconds - item1.timestamp.seconds
    })

    return items as GalleryItemType[]
  } catch(e) {
    return null
  }
}