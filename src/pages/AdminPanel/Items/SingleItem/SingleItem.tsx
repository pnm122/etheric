import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useContext, useState } from 'react'
import styles from '../../AdminPanel.module.css'
import getFile from 'utils/getFile'
import { NotificationContext } from 'context/NotificationContext'
import { GalleryItemWithURLType } from 'types/GalleryItemType'
import { LocomotiveScrollContext } from 'context/LocomotiveScrollContext'
import { GrUpdate } from 'react-icons/gr'
import { BiSolidTrashAlt } from 'react-icons/bi'
import updateItem from 'utils/updateItem'
import deleteItem from 'utils/deleteItem'
import { AiFillCaretLeft } from 'react-icons/ai'
import FileDisplay from 'components/FileDisplay/FileDisplay'

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

  const handleUpdate = (e : React.FormEvent) => {
    e.preventDefault()
    
    if(!edited) return

    // Slug must be non-null since we would have navigated otherwise
    updateItem({id: slug!, title, description}).then(res => {
      if(res) {
        setNotification('Update successful!', false)
        setEdited(false)
      } else {
        setNotification('Update failed. Check the console.', true)
      }
    }).catch(e => {
      console.error(e)
      setNotification('An error occurred. Check the console.', true)
    })
  }

  const handleDelete = () => {
    deleteItem(slug!, data!.src, data!.coverSrc).then(res => {
      if(res[0] && res[1] && (res[2] != null ? res[2] : true)) {
        setNotification(`Successfully deleted ${slug}.`, false)
        navigate('/admin')
      } else {
        setNotification('Delete failed. Check the console.', true)
      }
    }).catch(e => {
      console.error(e)
      setNotification('An error occurred. Check the console.', true)
    })
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
    <main id={styles.outlet} data-scroll-section>
      <div className="container">
        <Link to="/admin" id={styles.back}>
          <AiFillCaretLeft className="hover-target" />
          Back to Items
        </Link>
        { data ? (
          <div id={styles.itemEdit}>
            <FileDisplay 
              url={data.url}
              coverUrl={data.coverUrl}
              type={data.type}
              title={data.title}
            />
            <form id={styles.editForm} onSubmit={handleUpdate}>
              <h2>Edit</h2>
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
              <div id={styles.itemButtons}>
                <button type="submit" aria-disabled={!edited} className="filled-button">
                  Update
                  <GrUpdate className={edited ? 'hover-target' : undefined } />
                </button>
                <button type="button" className="filled-button" onClick={handleDelete}>
                  Delete
                  <BiSolidTrashAlt className='hover-target' />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </main>
  )
}
