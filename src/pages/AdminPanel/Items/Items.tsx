import GalleryItem from '../GalleryItem'
import { useState, useEffect } from 'react'
import GalleryItemType, { GalleryItemFromDBType } from 'types/GalleryItemType'
import GalleryItemsType from 'types/GalleryItemsType'
import getGalleryItems from 'utils/getGalleryItems'
import styles from '../AdminPanel.module.css'
import { Link } from 'react-router-dom'

export default function Items() {
  const [items, setItems] = useState<GalleryItemType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGalleryItems().then((res : GalleryItemsType) => {
      if(res) {
        const i = res.docs.map((item) => {
          const data = item.data() as GalleryItemFromDBType
          return {
            type: data.type,
            title: data.title,
            timestamp: data.timestamp,
            src: data.src,
            slug: item.id, // Slug is the ID of the item
            description: data.description
          }
        })
        setItems(i)
        setLoading(false)
      } else {
        console.error('Error loading files')
      }
    })
  }, [])

  const itemsRender = items.map(item => {
    return (
      <GalleryItem
        key={item.timestamp.milliseconds}
        type={item.type}
        title={item.title}
        timestamp={item.timestamp}
        src={item.src}
        slug={item.slug}
        description={item.description}
      />
    )
  })

  return (
    <main data-scroll-section>
      <div className="container" id={styles.main}>
        <h2 id={styles.itemsTitle}>Gallery Items</h2>
        { loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div id={styles.items}>
              {itemsRender}
            </div>
            <Link to="upload" className="filled-button">Upload Item</Link>
          </>
        )}
      </div>
    </main>
  )
}
