import Homepage from 'pages/Homepage/Homepage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'base.css'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { FiArrowRight } from 'react-icons/fi'
import Header from 'components/Header/Header'
import imagesLoaded from 'imagesloaded'
import LocomotiveScroll from 'locomotive-scroll'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  let rendered = false

  useEffect(() => {
    // Initialize Locomotive Scroll after all images are loaded
    const imageElements = document.querySelectorAll('img')
    const imgLoad = imagesLoaded(imageElements)
    let scroll : LocomotiveScroll
    let scrollOptions : LocomotiveScroll.InstanceOptions = {
      smooth: true,
      lerp: 0.08,
      el: containerRef.current ?? undefined,
      tablet: {
        breakpoint: 768,
        smooth: true
      }
    }
    // make sure only one instance of locomotive scroll (just for development, doesn't effect production build)
    if(!rendered) { 
      imgLoad.on('done', () => {
        scroll = new LocomotiveScroll(scrollOptions)
      })
    }

    window.onmousemove = e => {
      const cursor = document.querySelector('#cursor');
      if(!cursor) return;

      // Enable the trailing effect using GSAP
      gsap.to(cursor, {
        duration: 0.5, // Adjust the duration as per your preference
        scale: 1,
        x: e.clientX,
        y: e.clientY,
        ease: 'power3.out'
      });

      if(!e.target) return
      
      const target = (e.target as HTMLElement)

      const tag = target.tagName

      if(target.classList.contains('gallery-item')) {
        cursor.classList.add('hover-item')
        return;
      }
      if(tag == 'A' || tag == 'BUTTON') {
        cursor.classList.add('hover')
      } else {
        cursor.className = ''
      }
    }

    rendered = true

    return () => {
      if(scroll) {
        scroll.destroy()
      }
    }
  }, [])

  return (
    <BrowserRouter>
      <div id="cursor">
        <span>View</span>
        <FiArrowRight />
      </div>
      <div data-scroll-container ref={containerRef}>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
