import { collection, getDocs, getFirestore } from "firebase/firestore";
import GalleryItemType from "types/GalleryItemType";

export default async function getSlugs() {
  const db = getFirestore()

  try {
    let files = await getDocs(collection(db, 'files'))
    let data : GalleryItemType[] = []

    for(let document of files.docs) {
      let d = document.data()
      d.slug = document.id

      data.push(d as GalleryItemType)
    }

    data = data.sort((d1, d2) => {
      return d2.timestamp.seconds - d1.timestamp.seconds
    })

    let slugs : string[] = []

    data.forEach(d => {
      slugs.push(d.slug)
    })

    return slugs
  } catch(e) {
    return null
  }
}