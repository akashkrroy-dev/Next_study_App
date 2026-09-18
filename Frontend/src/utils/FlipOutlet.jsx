import { useRef, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import './FlipOutlet.css'

const FlipOutlet = () => {
  const location = useLocation()
  const outlet = useOutlet()
  const wipeRef = useRef(null)
  const tlRef = useRef(null)

  const [displayOutlet, setDisplayOutlet] = useState(outlet)
  const currentPath = useRef(location.pathname)
  const isFirstRender = useRef(true)

  useGSAP(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      currentPath.current = location.pathname
      return
    }
    if (location.pathname === currentPath.current) return

    if (tlRef.current) tlRef.current.kill()

    gsap.set(wipeRef.current, { clipPath: "inset(0% 100% 0% 0%)" })

    tlRef.current = gsap.timeline()
    tlRef.current
      .to(wipeRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.22,
        ease: "power1.inOut",
        onComplete: () => {
          setDisplayOutlet(outlet)
          currentPath.current = location.pathname
        }
      })
      .to(wipeRef.current, {
        clipPath: "inset(0% 0% 0% 100%)",
        duration: 0.26,
        ease: "power2.out"
      })
  }, [location.pathname])

  return (
    <div className="flip-viewport">
      <div className="flip-card">
        {displayOutlet}
        <div className="wipe-overlay" ref={wipeRef}></div>
      </div>
    </div>
  )
}

export default FlipOutlet