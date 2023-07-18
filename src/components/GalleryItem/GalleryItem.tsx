import React, { useEffect } from 'react'
import styles from './GalleryItem.module.css'
import { useLocomotiveScroll } from 'react-locomotive-scroll'
import LocomotiveScroll from 'locomotive-scroll'

export default function GalleryItem() {
  const scroll = useLocomotiveScroll()

  useEffect(() => {
    console.log('update')
    if(scroll.scroll) {
      (scroll.scroll as LocomotiveScroll).update()
    }
  }, [scroll])

  return (
    <div>
      <span className="text animate-in">Gallery Item</span>
      <a className={`${styles.img} img animate-in`}>
        <img src="assets/placeholders/1.png" className="gallery-item"></img>
      </a>
    </div>
  )
}
