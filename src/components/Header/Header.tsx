import { NotificationContext } from 'context/NotificationContext'
import { gsap } from 'gsap'
import { useEffect, useState, useContext } from 'react'
import { HiX } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import SplitType from 'split-type'
import getTitle from 'utils/getTitle'
import { textFrom, textTo } from 'utils/textAnimateOptions'

export default function Header({isSingleItem = false}) {
  const [siteTitle, setSiteTitle] = useState('')
  const location = useLocation()
  const { setNotification } = useContext(NotificationContext)

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

  useEffect(() => {
    if(siteTitle == '') return

    const splitText = new SplitType('.header-text')

    gsap.fromTo(splitText.chars, textFrom, textTo)
  }, [siteTitle])

  console.log('test', isSingleItem)

  return (
    <header className={`container diff ${isSingleItem ? 'single-item' : undefined}`} data-scroll-section>
      <div>
        <h1 aria-hidden={siteTitle == ''} className="header-text animate-in">{siteTitle}</h1>
        { isSingleItem ? (
          <Link to='/gallery'><HiX className="hover-target" /></Link>
        ) : (
          <h1 aria-hidden={siteTitle == ''} className="secondary header-text animate-in">Energy In Present Time</h1>
        )}
      </div>
    </header>
  )
}
