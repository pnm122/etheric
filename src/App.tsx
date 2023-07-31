import Homepage from 'pages/Homepage/Homepage.tsx'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import 'base.css'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { FiArrowRight } from 'react-icons/fi'
import imagesLoaded from 'imagesloaded'
import LocomotiveScroll from 'locomotive-scroll'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Login from 'pages/Auth/Login'
import Register from 'pages/Auth/Register'
import AdminPanel from 'pages/AdminPanel/AdminPanel'
import isAdmin from 'utils/isAdmin'
import Error from 'pages/Error/Error'
import Upload from 'pages/AdminPanel/Upload/Upload'
import Items from 'pages/AdminPanel/Items/Items'
import NotificationProvider from 'context/NotificationContext'

function App() {
  const navigate = useNavigate()
  const location = useLocation()

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

    const mouseIsOnEdge = (x: number, y: number) => {
      const CUTOFF = 10
      const w = window.innerWidth
      const h = window.innerHeight

      return  x < CUTOFF ||
              x > w - CUTOFF ||
              y < CUTOFF ||
              y > h - CUTOFF
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

      if(mouseIsOnEdge(e.clientX, e.clientY)) {
        console.log('1')
        cursor.classList.add('hidden')
        return
      } else {
        console.log('2')
        cursor.classList.remove('hidden')
      }

      if(!e.target) return
      
      const target = (e.target as HTMLElement)

      const tag = target.tagName

      if(target.classList.contains('gallery-item')) {
        cursor.classList.add('hover-item')
        return;
      }
      if(tag == 'A' || 
         tag == 'BUTTON' || 
         target.classList.contains('hover-target') ||
         (target.parentElement && target.parentElement.classList.contains('hover-target'))) {
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
  }, [location.pathname])

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if(location.pathname == '/' || 
           location.pathname == '/login' || 
           location.pathname == '/register') {
          navigate('/gallery')
        }

        // If the user tries to access the admin page, check if they're an admin first
        // If they are, set the location state so that the admin page knows we're authenticated
        // If they aren't, navigate to the gallery page
        if(location.pathname == '/admin') {
          isAdmin().then(res => {
            console.log(res)
            if(res) {
              location.state = { authed: true }
            } else {
              navigate('/gallery')
            }
          })
        }
      } else {
        // User is signed out
        console.log('Signed out...')

        // Navigate to login page when the user tries to access anything that requires authentication
        if(location.pathname != '/register') {
          navigate('/login')
        }
      }
    });
  }, [location.pathname, location.state])

  return (
    <NotificationProvider>
      <div id="cursor">
        <span>View</span>
        <FiArrowRight />
      </div>
      <div data-scroll-container ref={containerRef} className="diff">
        <Routes>
          <Route path="/gallery" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />}>
            <Route path="" element={<Items />} />
            <Route path="upload" element={<Upload />} />
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </NotificationProvider>
  )
}

export default App
