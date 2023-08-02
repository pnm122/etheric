import LocomotiveScroll from 'locomotive-scroll'
import { createContext, useState, useEffect, useRef, useLayoutEffect } from 'react'
import imagesLoaded from 'imagesloaded'

interface LocomotiveScrollContextType {
  ready: boolean
  scroll: LocomotiveScroll | null
  update: (() => void)
}

export const LocomotiveScrollContext = createContext<LocomotiveScrollContextType>({
  ready: false,
  scroll: null,
  update: () => {}
})

interface Props {
  children: React.ReactNode | React.ReactNode[]
}

export default function LocomotiveScrollProvider({children} : Props) {
  const [ready, setReady] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [scroll, setScroll] = useState<LocomotiveScroll | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  let s = 0

  // useLayoutEffect only calls once synchronously after DOM mutations
  // Perfect for creating the scroll. Don't want two calls like useEffect,
  // because this breaks the scroll
  useLayoutEffect(() => {
    s++
    // Initialize Locomotive Scroll after all images are loaded
    const imageElements = document.querySelectorAll('img')
    const imgLoad = imagesLoaded(imageElements)
    
    let scrollOptions : LocomotiveScroll.InstanceOptions = {
      smooth: true,
      lerp: 0.08,
      el: containerRef.current ?? undefined,
      tablet: {
        breakpoint: 768,
        smooth: true
      }
    }
    imgLoad.on('done', () => {
      setScroll(new LocomotiveScroll(scrollOptions))
      setReady(true)
      setRendered(true)
    })

    return () => {
      if(scroll) {
        scroll.destroy()
      }
    }
  }, [location.pathname])

  useLayoutEffect(() => {
    if(!scroll) return

    new ResizeObserver(() => {
      scroll!.update()
    }).observe(
      document.querySelector("[data-scroll-container]")!
    );
  }, [scroll])

  const update = () => {
    if(ready) {
      scroll?.update()
    }
  }

  return (
    <LocomotiveScrollContext.Provider value={{ ready, scroll: scroll ?? null, update }}>
      <div data-scroll-container ref={containerRef} className="diff">
        {children}
      </div>
    </LocomotiveScrollContext.Provider>
  )
}