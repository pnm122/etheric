import { NotificationContext } from 'context/NotificationContext'
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from 'components/Header/Header'
import FileDisplay from 'components/FileDisplay/FileDisplay'
import Footer from 'components/Footer/Footer'
import getFile from 'utils/getFile'
import { GalleryItemWithURLType } from 'types/GalleryItemType'
import styles from './SingleItem.module.css'
import getSlugs from 'utils/getSlugs'

export default function SingleItem() {
  const [data, setData] = useState<GalleryItemWithURLType | null>(null)
  const [slugs, setSlugs] = useState<string[] | null>(null)
  const { slug } = useParams()
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
          { data && slugs ? (
            <div id={styles.data}>
              <FileDisplay url={data.url} coverUrl={data.coverUrl} type={data.type} title={data.title} />
              <h1 id={styles.title}>{data.title}</h1>
              <h2 id={styles.description}>{data.description}</h2>
              <div id={styles.nav}>
                <Link to={`/gallery/${prevSlug}`}>Prev</Link>
                <Link to='/gallery'>Gallery</Link>
                <Link to={`/gallery/${nextSlug}`}>Next</Link>
              </div>
            </div>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      </main>
      <Footer isSingleItem />
    </>
  )
}
