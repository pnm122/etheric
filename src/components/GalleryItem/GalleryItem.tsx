import React, { useEffect } from 'react'
import styles from './GalleryItem.module.css'
import LocomotiveScroll from 'locomotive-scroll'

export default function GalleryItem() {

  return (
    <div>
      <span className="text animate-in">Gallery Item</span>
      <a className={`${styles.img} img animate-in`}>
        {/* <h1>Test</h1>
        <h1>Test</h1>
        <h1>Test</h1>
        <h1>Test</h1>
        <h1>Test</h1>
        <h1>Test</h1> */}
        <img alt="Placeholder" src="assets/placeholders/2.png" className="gallery-item"></img>
      </a>
    </div>
  )
}
