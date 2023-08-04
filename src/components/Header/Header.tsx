import { NotificationContext } from 'context/NotificationContext'
import { gsap } from 'gsap'
import React, { useEffect, useState, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import SplitType from 'split-type'
import getTitle from 'utils/getTitle'
import { textFrom, textTo } from 'utils/textAnimateOptions'

export default function Header() {
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

  return (
    <header className="container diff" data-scroll-section>
      <div>
        <h1 aria-hidden={siteTitle == ''} className="header-text animate-in">{siteTitle}</h1>
        <h1 aria-hidden={siteTitle == ''} className="secondary header-text animate-in">Energy In Present Time</h1>
      </div>
    </header>
  )
}
