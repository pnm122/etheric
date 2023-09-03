import { NotificationContext } from 'context/NotificationContext'
import { gsap } from 'gsap'
import { useEffect, useState, useContext } from 'react'
import { HiX } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import SplitType from 'split-type'
import getTitle from 'utils/getTitle'
import { textFrom, textTo } from 'utils/textAnimateOptions'

export default function Header({isSingleItem = false}) {
  const [siteTitle, setSiteTitle] = useState('')
  const { setNotification } = useContext(NotificationContext)

  useEffect(() => {
    getTitle().then(res => {
      if(!res) {
        setNotification('Unable to retrieve site title', true)
        return
      }

      setSiteTitle(res)
    }).catch(() => {
      setNotification('Unable to retrieve site title', true)
    })
  }, [])

  useEffect(() => {
    if(siteTitle == '') return

    const splitText = new SplitType('.header-text')

    gsap.fromTo(splitText.chars, textFrom, textTo)
  }, [siteTitle])

  return (
    <header className={`container diff ${isSingleItem ? 'single-item' : undefined}`} data-scroll-section>
      <div>
        <h1 aria-hidden={siteTitle == ''} className="header-text animate-in">{siteTitle}</h1>
        { isSingleItem && <Link to='/gallery'><HiX className="hover-target" /></Link> }
      </div>
    </header>
  )
}
