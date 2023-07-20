import styles from './GalleryItem.module.css'

export default function GalleryItem() {
  const scrollSpeed = Math.random() * 3;

  return (
    <div className={styles.container} data-scroll data-scroll-speed={scrollSpeed}>
      <span className="text animate-in">Gallery Item</span>
      <a className={`${styles.img} img animate-in`}>
        <img alt="Placeholder" src="assets/placeholders/2.png" className="gallery-item"></img>
      </a>
    </div>
  )
}
