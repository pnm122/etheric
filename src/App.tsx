import Homepage from 'pages/Homepage/Homepage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'base.css'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { FiArrowRight } from 'react-icons/fi'
import Header from 'components/Header/Header'
import { LocomotiveScrollProvider } from 'react-locomotive-scroll'

function App() {
  useEffect(() => {

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

    return () => {
    }
  }, [])

  return (
    <BrowserRouter>
      <LocomotiveScrollProvider 
        options={{ smooth: true }}
        watch={[]}>
        <div data-scroll-container>
          <div data-scroll-section>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
          </div>
          <Header />
          <div id="cursor">
            <span>View</span>
            <FiArrowRight />
          </div>
          <Routes>
            <Route path="/" element={<Homepage />} />
          </Routes>
        </div>
      </LocomotiveScrollProvider>
    </BrowserRouter>
  )
}

export default App
