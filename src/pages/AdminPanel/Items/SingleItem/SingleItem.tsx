import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useContext, useState } from 'react'
import styles from '../../AdminPanel.module.css'
import getFile from 'utils/getFile'
import { NotificationContext } from 'context/NotificationContext'
import { GalleryItemWithURLType } from 'types/GalleryItemType'
import { LocomotiveScrollContext } from 'context/LocomotiveScrollContext'

export default function SingleItem() {
  const [data, setData] = useState<GalleryItemWithURLType | null>(null)

  const { slug } = useParams()
  const { setNotification } = useContext(NotificationContext)
  const { ready, update } = useContext(LocomotiveScrollContext)
  const navigate = useNavigate()

  useEffect(() => {
    if(slug == null) {
      // TODO: show an error
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
          
          navigate('/admin')
          return
        }

        if(!res.data) {
          setNotification('An unknown error occurred.', true)
          navigate('/admin')
          return
        }

        setData(res.data)
      })
      .catch(e => {
        console.error(e)
        navigate('/admin')
      })
  }, [])

  useEffect(() => {
    update()
  }, [data])

  return (
    <main data-scroll-section>
      <div className="container">
        { data ? (
          <>
            <img id={styles.img} src={data.url}></img>
          </>
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </main>
  )
}
