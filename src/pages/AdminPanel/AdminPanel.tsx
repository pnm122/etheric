import styles from './AdminPanel.module.css'
import { Outlet } from 'react-router-dom'
import { FaCheck, FaEdit } from 'react-icons/fa'
import { useState, useContext, useEffect } from 'react'
import { NotificationContext } from 'context/NotificationContext'
import getTitle from 'utils/getTitle'
import setTitle from 'utils/setTitle'

export default function AdminPanel() {
  const [editing, setEditing] = useState(false)
  const [siteTitle, setSiteTitle] = useState('')
  const { setNotification } = useContext(NotificationContext)

  const toggleEditTitle = () => {
    if(editing) {
      setTitle(siteTitle).then(res => {
        if(res) {
          setEditing(false)
        } else {
          setNotification('Failed to update site title', true)
        }
        return
      })
    }

    setEditing(!editing)
  }

  useEffect(() => {
    getTitle().then(res => {
      if(!res) {
        setNotification('Unable to retrieve site title', true)
        return
      }

      setSiteTitle(res)
    }).catch(e => {
      setNotification('Unable to retrieve site title', true)
    })
  }, [])

  return (
    <>
      <div className="container" data-scroll-section>
        <div id={styles.header}>
          { editing ? (
            <input 
              value={siteTitle} 
              placeholder='Enter a title for the site...'
              onChange={e => setSiteTitle(e.target.value)}
            />
          ) : ( 
            <h1>{siteTitle}</h1>
          )}
          <button onClick={toggleEditTitle}>
            { editing ? (
              <FaCheck className="hover-target" />
            ) : ( 
              <FaEdit className="hover-target" />
            )}
          </button>
        </div>
      </div>
      <Outlet />
    </>
  )
}
