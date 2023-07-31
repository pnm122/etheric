import styles from './Notification.module.css'
import { BiSolidErrorCircle } from 'react-icons/bi'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { useContext } from 'react'
import { NotificationContext } from 'context/NotificationContext'

interface Props {
  message: string
  isError: boolean
  isActive: boolean
}

export default function Notification({ message, isError, isActive } : Props) {
  const { closeNotification } = useContext(NotificationContext)
  
  return (
    <button id={styles.notification} aria-hidden={!isActive} onClick={() => closeNotification()}>
      { isError ? <BiSolidErrorCircle className="hover-target" /> : <BsFillCheckCircleFill className="hover-target" /> }
      <span className="hover-target">{message}</span>
    </button>
  )
}
