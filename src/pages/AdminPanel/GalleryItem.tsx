import GalleryItemType from 'types/GalleryItemType'
import styles from './AdminPanel.module.css'
import { BiSolidVideo, BiSolidImageAlt, BiSolidMusic } from 'react-icons/bi'
import secToDateString from 'utils/secToDateString'
import { Link } from 'react-router-dom'

export default function GalleryItem({ title, type, timestamp, slug } : GalleryItemType) {
  const date = secToDateString(timestamp.seconds)

  return (
    <Link to={slug} className={styles.galleryItem}>
      <div className={`${styles.itemTitle} hover-target`}>
        { type === 'image' ? <BiSolidImageAlt className="hover-target" /> :
          type === 'video' ? <BiSolidVideo className="hover-target" /> :
          <BiSolidMusic className="hover-target" /> }
        <h3 className="hover-target">{title}</h3>
      </div>
      <span className="hover-target">{date}</span>
    </Link>
  )
}
