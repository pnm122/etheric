import { doc, getFirestore, setDoc } from "firebase/firestore"

interface Props {
  id: string
  title: string
  description: string
}

export default async function updateItem({ id, title, description } : Props) {
  const db = getFirestore()

  return setDoc(doc(db, 'files', id), {
    title,
    description
  }, {
    merge: true
  }).then(res => {
    return true
  }).catch(e => {
    console.error(e)
    return false
  })
}