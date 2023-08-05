import { NotificationContext } from 'context/NotificationContext'
import { useContext, useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from 'components/Header/Header'
import FileDisplay from 'components/FileDisplay/FileDisplay'
import Footer from 'components/Footer/Footer'
import getFile from 'utils/getFile'
import { GalleryItemWithURLType } from 'types/GalleryItemType'
import styles from './SingleItem.module.css'
import getSlugs from 'utils/getSlugs'
import { gsap } from 'gsap'
import SplitType from 'split-type'
import { textFrom, textTo } from 'utils/textAnimateOptions'
import debounce from 'lodash.debounce'

export default function SingleItem() {
  const [data, setData] = useState<GalleryItemWithURLType | null>(null)
  const [slugs, setSlugs] = useState<string[] | null>(null)
  const { slug } = useParams()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const { setNotification } = useContext(NotificationContext)

  // Only need to get all slugs once!
  useEffect(() => {
    getSlugs().then(slugs => {
      if(!slugs) {
        setNotification('Unable to retrieve all slugs', true)
        navigate('/gallery')
        return
      }

      setSlugs(slugs)
    }).catch(e => {
      setNotification('Unable to retrieve all slugs', true)
      navigate('/gallery')
    })
  }, [])

  useEffect(() => {
    if(slug == null) {
      setNotification('No slug found, check console.', true)
      navigate('/gallery')
      return
    }

    setData(null)

    getFile(slug)
      .then(res => {
        if(res.hasError) {
          if(typeof res.error == 'string') {
            setNotification(res.error, true)
          } else {
            console.error(res.error)
          }
          
          navigate('/gallery')
          return
        }

        if(!res.data) {
          setNotification('An unknown error occurred.', true)
          navigate('/gallery')
          return
        }

        setData(res.data)
      })
      .catch(e => {
        console.error(e)
        navigate('/gallery')
      })
  }, [location.pathname])

  // useEffect(() => {
  //   if(!slugs || !data || !containerRef) return

  //   const makeTextResponsive = () => {
  //     // Reposition text after the container is resized (simplified version)
  //     // This example uses lodash#debounce to ensure the split method only
  //     // gets called once after the resize is complete.
  //     const resizeObserver = new ResizeObserver(
  //       debounce(([entry]) => {
  //         // Note: you should add additional logic so the `split` method is only
  //         // called when the **width** of the container element has changed.
  //         splitText.split({})
  //       }, 500)
  //     )

  //     resizeObserver.observe(containerRef.current!)
  //   }

  //   const tl = gsap.timeline({ onComplete: makeTextResponsive })
  //   const splitText = new SplitType('.text.animate-in')
  //   const splitLinks = new SplitType('.link.animate-in', {
  //     lineClass: 'line hover-target',
  //     wordClass: 'word hover-target',
  //     charClass: 'char hover-target'
  //   })
  //   const content = document.getElementById('content')
  //   const footer = document.getElementsByTagName('footer')[0]

  //   let file
  //   if(data.type == 'image' || data.type == 'audio') {
  //     file = document.getElementsByTagName('img')[0]
  //     file.onload = () => {
  //       tl.resume()
  //     }
  //   } else {
  //     file = document.getElementsByTagName('video')[0]
  //     file.onloadeddata = () => {
  //       tl.resume()
  //     }
  //   }
    
  //   tl.fromTo(content!.firstChild, {
  //     y: '-101%',
  //   }, {
  //     y: 0,
  //     duration: 1.5,
  //     ease: 'expo.inOut',
  //   })

  //   // tl.fromTo(document.querySelector('.text.animate-in'), textFrom, textTo)


  //   tl.fromTo(footer, { opacity: 0}, { opacity: 1, duration: 0.5 })

  //   tl.pause()
    
  // }, [slugs, data, containerRef])

  let nextSlug, prevSlug

  if(slugs) {
    const currIndex = slugs.indexOf(slug!)
    nextSlug = slugs[(currIndex + 1 + slugs.length) % slugs.length]
    prevSlug = slugs[(currIndex - 1 + slugs.length) % slugs.length]
  }

  return (
    <>
      <Header isSingleItem />
      <main data-scroll-section>
        <div className="container">
          <div id={styles.data} ref={containerRef}>
            <div id="content">
              { data && <FileDisplay singleItem url={data.url} coverUrl={data.coverUrl} type={data.type} title={data.title} /> }
            </div>
            <h1 id={styles.title} className="text animate-in" data-scroll>{data && data.title}</h1>
            <h2 id={styles.description} className="text animate-in" data-scroll>{data && data.description}</h2>
            <div id={styles.nav}>
              <Link className="link animate-in" to={`/gallery/${prevSlug}`}>Prev</Link>
              <Link className="link animate-in" to='/gallery'>Gallery</Link>
              <Link className="link animate-in" to={`/gallery/${nextSlug}`}>Next</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer isSingleItem />
    </>
  )
}
