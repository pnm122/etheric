import { gsap } from 'gsap'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SplitType from 'split-type'

export default function Header() {
  const location = useLocation()

  useEffect(() => {
    const splitText = new SplitType('.header-text')

    gsap.fromTo(splitText.chars, {
      y: '-100%',
      rotate: -15,
    }, {
      y: 0,
      rotate: 0,
      duration: 0.8,
      delay: 0.2,
      stagger: 0.02,
      ease: 'expo.out'
    })
  }, [location.pathname])

  return (
    <header className="container diff" data-scroll-section>
      <h1 className="header-text animate-in">Etheric</h1>
      <h1 className="secondary header-text animate-in">Energy In Present Time</h1>
    </header>
  )
}
