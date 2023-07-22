import React, { useEffect } from 'react'
import { getFirestore, doc, getDoc, query, collection, getDocs } from 'firebase/firestore'

export default function AdminPanel() {

  const checkIfAdmin = async () => {
    const db = getFirestore()

    const q = query(collection(db, 'admins'))
    const snap = await getDocs(q)

    console.log(snap)
  }

  useEffect(() => {
    checkIfAdmin()
  }, [])

  return (
    <div>AdminPanel</div>
  )
}
