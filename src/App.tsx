import Homepage from 'pages/Homepage/Homepage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'base.css'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { FiArrowRight } from 'react-icons/fi'
import Header from 'components/Header/Header'
import imagesLoaded from 'imagesloaded'
import LocomotiveScroll from 'locomotive-scroll'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Login from 'pages/Login/Login'
import Register from 'pages/Register/Register'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  let rendered = false

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: "etheric-fc36d.firebaseapp.com",
    projectId: "etheric-fc36d",
    storageBucket: "etheric-fc36d.appspot.com",
    messagingSenderId: "577470555750",
    appId: "1:577470555750:web:e7eef96441d02a9ca1afa7",
    measurementId: "G-MML15W7DKP"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  const analytics = getAnalytics(app)

  const auth = getAuth(app)

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log(user)
      // ...
    } else {
      // User is signed out
      // ...
      console.log('Signed out')
    }
  });

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
      <div data-scroll-container ref={containerRef} className="diff">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
