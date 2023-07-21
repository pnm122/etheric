import { useEffect, useState } from 'react';
import styles from './GalleryItem.module.css'

export default function GalleryItem() {
  // const [mobile, setMobile] = useState(false)

  const scrollSpeed = Math.random() * 3;

  // useEffect(() => {
  //   setMobile(window.innerWidth <= 768)

  //   window.onresize = e => {
  //     setMobile(window.innerWidth <= 768)
  //   }
  // }, [])

  return (
    <div className={styles.container} data-scroll data-scroll-speed={scrollSpeed}>
      <span className="text animate-in">Gallery Item</span>
      <a className={`${styles.img} img animate-in`}>
        <img alt="Placeholder" src="assets/placeholders/2.png" className="gallery-item"></img>
      </a>
    </div>
  )
}
