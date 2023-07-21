import { gsap } from 'gsap'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SplitType from 'split-type'
import { textFrom, textTo } from 'utils/textAnimateOptions'

export default function Header() {
  const location = useLocation()

  useEffect(() => {
    const splitText = new SplitType('.header-text')

    gsap.fromTo(splitText.chars, textFrom, textTo)
  }, [location.pathname])

  return (
    <header className="container diff" data-scroll-section>
      <div>
        <h1 className="header-text animate-in">Etheric</h1>
        <h1 className="secondary header-text animate-in">Energy In Present Time</h1>
      </div>
    </header>
  )
}
