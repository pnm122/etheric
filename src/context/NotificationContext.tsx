import Notification from 'components/Notification/Notification'
import { createContext, useState } from 'react'

interface NotificationContextType {
  setNotification: (message: string, isError: boolean) => void
  closeNotification: () => void
}

export const NotificationContext = createContext<NotificationContextType>({
  setNotification: () => {},
  closeNotification: () => {}
})

interface Props {
  children: React.ReactNode[]
}

export default function NotificationProvider({children} : Props) {
  const [message, setMessage] = useState('')
  const [isErr, setIsErr] = useState(false)
  const [active, setActive] = useState(false)

  const setNotification = (message: string, isError: boolean) => {
    setMessage(message)
    setIsErr(isError)
    setActive(true)
  }

  const closeNotification = () => {
    setActive(false)
  }

  return (
    <NotificationContext.Provider value={{setNotification, closeNotification}}>
      <Notification message={message} isError={isErr} isActive={active} />
      {children}
    </NotificationContext.Provider>
  )
}