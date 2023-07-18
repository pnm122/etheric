import React from 'react'
import styles from './GalleryItem.module.css'

export default function GalleryItem() {
  return (
    <div>
      <span className="text animate-in">Gallery Item</span>
      <a className={`${styles.img} img animate-in`}>
        <img src="assets/placeholders/1.png" className="gallery-item"></img>
      </a>
    </div>
  )
}
