import { gsap } from 'gsap'

let overlay = null
let currentTween = null

export const applyTheme = (theme) => {
  if (!overlay) {
    overlay = document.createElement('div')
    overlay.style.position = 'fixed'
    overlay.style.inset = '0'
    overlay.style.zIndex = '9999'
    overlay.style.pointerEvents = 'none'
    overlay.style.opacity = '0'
    overlay.style.background = 'var(--base-clr-01)'
    document.body.appendChild(overlay)
  }

  if (currentTween) currentTween.kill()
  currentTween = gsap.timeline()
    .to(overlay, { opacity: 1, duration: 0.22, ease: 'power1.inOut' })
    .add(() => {
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('nexstudy-theme', theme)
    })
    .to(overlay, { opacity: 0, duration: 0.32, ease: 'power1.inOut', delay: 0.03 })
}