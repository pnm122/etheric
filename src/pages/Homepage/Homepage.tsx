import { useEffect, useState } from "react"
import styles from './Homepage.module.css'
import { gsap } from "gsap"
import SplitType from "split-type"
import GalleryItem from "components/GalleryItem/GalleryItem"
import { textFrom, textTo } from "utils/textAnimateOptions"
import Header from "components/Header/Header"

export default function Homepage() {
  const [loading, setLoading] = useState(true)

  const tl = gsap.timeline()
  
  const animateIn = () => {
    setLoading(false)

    const SLIDE_OUT_DURATION = 0.8
    const GALLERY_DELAY = 0.5

    tl.to('#loading-img-container', {
      height: 0,
      duration: SLIDE_OUT_DURATION,
      ease: 'expo.inOut'
    }, '>')

    const splitText = new SplitType('.text.animate-in')

    tl.fromTo(splitText.chars, textFrom, textTo, SLIDE_OUT_DURATION + GALLERY_DELAY)

    const galleryItems = document.getElementsByClassName('gallery-item')

    tl.fromTo(galleryItems, {
      y: '-101%',
    }, {
      y: 0,
      duration: 1.5,
      ease: 'expo.inOut',
      stagger: 0.25
    }, SLIDE_OUT_DURATION + GALLERY_DELAY)
  }

  useEffect(() => {
    const t = setTimeout(() => {
      animateIn()
    }, 1500)

    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Header />
      <div id="loading-img-container" className={`${styles.loadingImgContainer}`}>
        <img src="assets/loading.png"></img>
      </div>
      <main data-scroll-section>
        <div className="container" id={styles.gallery}>
          <GalleryItem />
          <GalleryItem />
          <GalleryItem />
          <GalleryItem />
          <GalleryItem />
          <GalleryItem />
          <GalleryItem />
          <GalleryItem />
          <GalleryItem />
          <GalleryItem />
          <GalleryItem />
          <GalleryItem />
          <GalleryItem />
          <GalleryItem />
        </div>
      </main>
    </>
  )
}
