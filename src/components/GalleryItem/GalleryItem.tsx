import styles from './GalleryItem.module.css'
import { GalleryItemWithURLType } from 'types/GalleryItemType';

export default function GalleryItem({ title, type, url } : GalleryItemWithURLType) {
  const scrollSpeed = Math.random() * 2.5 + 0.5;

  return (
    <div className={styles.container} data-scroll data-scroll-speed={scrollSpeed}>
      <span className="text animate-in">{title}</span>
      <a className={`${styles.img} img animate-in`}>
        { type == 'image' ? (
          <img alt={title} src={url} className="gallery-item"></img>
        ) : type == 'video' ? (
          <video src={url} className="gallery-item"></video>
        ) : type == 'audio' ? (
          <div><span>TODO: AUDIO</span></div>
        ) : (
          <div><span>Unknown file type: {type}</span></div>
        )}
      </a>
    </div>
  )
}
