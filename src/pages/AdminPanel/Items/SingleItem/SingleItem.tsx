import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useContext, useState } from 'react'
import styles from '../../AdminPanel.module.css'
import getFile from 'utils/getFile'
import { NotificationContext } from 'context/NotificationContext'
import { GalleryItemWithURLType } from 'types/GalleryItemType'
import { LocomotiveScrollContext } from 'context/LocomotiveScrollContext'
import { GrUpdate } from 'react-icons/gr'

export default function SingleItem() {
  const [data, setData] = useState<GalleryItemWithURLType | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [edited, setEdited] = useState(false)

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
        setTitle(res.data.title)
        setDescription(res.data.description)
      })
      .catch(e => {
        console.error(e)
        navigate('/admin')
      })
  }, [])

  useEffect(() => {
    update()
  }, [data])

  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault()
  }

  const updateTitle = (newTitle: string) => {
    setEdited(true)
    setTitle(newTitle)
  }

  const updateDescription = (newDescription: string) => {
    setEdited(true)
    setDescription(newDescription)
  }

  return (
    <main data-scroll-section>
      <div className="container">
        { data ? (
          <div id={styles.itemEdit}>
            { data.type == 'image' ? (
                <img id={styles.content} src={data.url} alt={data.title}></img>
            ) : data.type == 'video' ? (
              <video id={styles.content} src={data.url}></video>
            ) : data.type =='audio' ? (
              <img id={styles.content} src={data.url}></img>
            ) : <span className="error">Unknown Data Type: {data.type}</span>}
            <form id={styles.editForm} onSubmit={handleSubmit}>
              <h2>Edit Metadata</h2>
              <div>
                <label htmlFor="title">Title</label>
                <input 
                  name="title"
                  value={title} 
                  onChange={e => updateTitle(e.target.value)} 
                  placeholder='Give this item a title...'
                />
              </div>
              <div>
                <label htmlFor="description">Description</label>
                <textarea 
                  name="description"
                  value={description} 
                  onChange={e => updateDescription(e.target.value)} 
                  placeholder='Give this item a description...'
                />
              </div>
              <button aria-disabled={!edited} className="filled-button">
                Update
                <GrUpdate className={edited ? 'hover-target' : undefined } />
              </button>
            </form>
          </div>
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </main>
  )
}
