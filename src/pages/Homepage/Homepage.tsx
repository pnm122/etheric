import { useEffect, useState, useContext } from "react"
import styles from './Homepage.module.css'
import { gsap } from "gsap"
import SplitType from "split-type"
import GalleryItem from "components/GalleryItem/GalleryItem"
import { textFrom, textTo } from "utils/textAnimateOptions"
import Header from "components/Header/Header"
import Footer from "components/Footer/Footer"
import getAllFiles from "utils/getAllFiles"
import { NotificationContext } from "context/NotificationContext"
import { GalleryItemWithURLType } from "types/GalleryItemType"

export default function Homepage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItemWithURLType[]>([])

  const { setNotification } = useContext(NotificationContext)

  const tl = gsap.timeline()
  
  const animateIn = () => {
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
    getAllFiles().then(res => {
      console.log(res)
      if(!res) {
        setNotification('Failed to load gallery', true)
        return
      }

      setGalleryItems(res as GalleryItemWithURLType[])
    })
  }, [])

  useEffect(() => {
    if(galleryItems.length == 0) return

    animateIn()
  }, [galleryItems])

  const galleryItemsRender = galleryItems.map((item) => {
    return (
      <GalleryItem
        key={item.title + item.src}
        title={item.title}
        type={item.type}
        src={item.src}
        description={item.description}
        slug={item.slug}
        timestamp={item.timestamp}
        url={item.url}
        coverUrl={item.coverUrl}
      />
    )
  })

  return (
    <>
      <Header />
      <div id="loading-img-container" className={`${styles.loadingImgContainer}`}>
        <img src="assets/loading.png"></img>
      </div>
      <main data-scroll-section>
        <div className="container" id={styles.gallery}>
          {galleryItemsRender}
        </div>
      </main>
      <Footer />
    </>
  )
}
