import styles from './GalleryItem.module.css'
import { GalleryItemWithURLType } from 'types/GalleryItemType';
import { Link } from 'react-router-dom';

export default function GalleryItem({ title, type, url, coverUrl, slug } : GalleryItemWithURLType) {
  const scrollSpeed = Math.random() * 2.5 + 0.5

  return (
    <div className={styles.container} data-scroll data-scroll-speed={scrollSpeed}>
      <span className="text animate-in">{title}</span>
      <Link to={slug} className={`${styles.content} animate-in`}>
        { type == 'image' ? (
          <img alt={title} src={url[0]} className="gallery-item"></img>
        ) : type == 'video' ? (
          <video src={url[0]} className="gallery-item"></video>
        ) : type == 'audio' ? (
          <img alt={title} src={coverUrl} className="gallery-item"></img>
        ) : (
          <div><span>Unknown file type: {type}</span></div>
        )}
      </Link>
    </div>
  )
}
