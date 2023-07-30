import GalleryItemType from 'types/GalleryItemType'
import styles from './AdminPanel.module.css'
import { BiSolidVideo, BiSolidImageAlt, BiSolidMusic } from 'react-icons/bi'
import { Timestamp } from 'firebase/firestore'
import secToDateString from 'utils/secToDateString'

export default function GalleryItem({ title, type, timestamp } : GalleryItemType) {
  const date = secToDateString(timestamp.seconds)

  return (
    <a href="#" className={styles.galleryItem}>
      <div className={`${styles.itemTitle} hover-target`}>
        { type === 'image' ? <BiSolidImageAlt className="hover-target" /> :
          type === 'video' ? <BiSolidVideo className="hover-target" /> :
          <BiSolidMusic className="hover-target" /> }
        <h3 className="hover-target">{title}</h3>
      </div>
      <span className="hover-target">{date}</span>
    </a>
  )
}
