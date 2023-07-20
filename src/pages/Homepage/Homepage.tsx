import { useEffect, useState } from "react"
import styles from './Homepage.module.css'
import { gsap } from "gsap"
import SplitType from "split-type"
import GalleryItem from "components/GalleryItem/GalleryItem"

export default function Homepage() {
  const [loading, setLoading] = useState(true)

  // const tl = gsap.timeline()
  
  // const animateIn = () => {
  //   setLoading(false)

  //   const SLIDE_OUT_DURATION = 0

  //   // tl.to('#loading-img-container', {
  //   //   height: 0,
  //   //   duration: SLIDE_OUT_DURATION,
  //   //   ease: 'expo.inOut'
  //   // }, '>')

  //   const splitText = new SplitType('.text.animate-in')

  //   tl.fromTo(splitText.chars, {
  //     y: '-100%',
  //     rotate: -15,
  //   }, {
  //     y: 0,
  //     rotate: 0,
  //     duration: 0.8,
  //     delay: 0.2,
  //     stagger: 0.02,
  //     ease: 'expo.out'
  //   }, SLIDE_OUT_DURATION)

  //   const galleryItems = document.getElementsByClassName('gallery-item')

  //   tl.fromTo(galleryItems, {
  //     opacity: 0,
  //   }, {
  //     opacity: 1,
  //     duration: 0.8,
  //     ease: 'expo.inOut',
  //     stagger: 1
  //   }, SLIDE_OUT_DURATION)
  // }

  // useEffect(() => {
  //   const t = setTimeout(() => {
  //     animateIn()
  //   }, 1000)

  //   return () => clearTimeout(t)
  // }, [])

  return (
    <>
      {/* <div id="loading-img-container" className={`${styles.loadingImgContainer}`}>
        <img src="assets/loading.png"></img>
      </div> */}
      <main data-scroll-section>
        <div className="container">
          <GalleryItem />
          <GalleryItem />
        </div>
      </main>
    </>
  )
}
