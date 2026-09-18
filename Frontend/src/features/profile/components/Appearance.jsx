import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useUser } from '../../../context/UserContext.jsx'
import { applyTheme } from '../../../utils/js/applyTheme.js'
import { ACCENT_COLORS, applyAccentColor } from '../../../utils/js/applyAccentColor.js'
import Header from '../../../components/ui/Header.jsx'
import "./css/zAppearance.css"

const themeOptions = [
  {
    type: "DARK",
    name: "Dark",
    colorPalatte: { base: "#18191b", text: "#f0f1f5" },
  },
  {
    type: "LIGHT",
    name: "Light",
    colorPalatte: { base: "#f0f1f5", text: "#18191b" },
  }
]

const accentColors = [
  { name: "royal-blue", color: ACCENT_COLORS["royal-blue"] },
  { name: "forest-green", color: ACCENT_COLORS["forest-green"] },
  { name: "crimson-red", color: ACCENT_COLORS["crimson-red"] },
]

const textSizes = [
  { name: 'Small', type: "SMALL" },
  { name: 'Medium', type: "MEDIUM" },
  { name: 'Large', type: "LARGE" },
]

const navStyles = [
  { type: 'SIDEBAR', name: 'Sidebar', desc: 'A normal fixed sidebar.' },
  { type: 'DRAGGABLE', name: 'Draggable popup', desc: 'Sidebar opens as a popup you can drag anywhere.' },
]

const Appearance = () => {

  const { updateChanges } = useOutletContext()
  const { settings, userLoading, setSettings } = useUser()


  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('nexstudy-theme')
    return storedTheme === 'LIGHT' || storedTheme === 'DARK' ? storedTheme : 'DARK'
  })
  const [accent, setAccent] = useState({ name: 'royal-blue', color: ACCENT_COLORS["royal-blue"] })
  const [textSize, setTextSize] = useState('MEDIUM')
  const [reduceMotion, setReduceMotion] = useState(false)
  const [navStyle, setNavStyle] = useState('SIDEBAR')

  useEffect(() => {
    if (
      !userLoading &&
      (settings?.theme === 'LIGHT' || settings?.theme === 'DARK')
    ) {
      setTheme(settings.theme)
    }
    const savedAccent = typeof settings?.accent === "string"
      ? accentColors.find((color) => color.name === settings.accent)
      : settings?.accent
    if (savedAccent && accentColors.some((color) => color.name === savedAccent.name && color.color === savedAccent.color)) {
      setAccent(savedAccent)
      applyAccentColor(savedAccent)
    }
  }, [userLoading, settings])

  const chooseTheme = (type) => {
    const current = document.documentElement.getAttribute('data-theme')
    if (current === type) return

    applyTheme(type)
    setTheme(type)
    setSettings((prev) => ({ ...prev, theme: type }))
    localStorage.setItem("nexstudy-theme", type)
    updateChanges('appearance', { theme: type })
  }

  const chooseAccent = (name) => {
    const selected = accentColors.find((color) => color.name === name)
    if (!selected) return
    setAccent(selected)
    applyAccentColor(selected)
    updateChanges('appearance', { accent: selected })
  }

  const chooseTextSize = (type) => {
    setTextSize(type)
    // updateChanges('appearance', { textSize: type })
  }

  const toggleReduceMotion = () => {
    setReduceMotion((prev) => {
      const updated = !prev
      // updateChanges('appearance', { reduceMotion: updated })
      return updated
    })
  }

  const chooseNavStyle = (type) => {
    setNavStyle(type)
    // updateChanges('appearance', { navStyle: type })
  }

  return (
    <div className='profile_apperance'>
      <Header name="appearance" variant="section" />

      <p className="section_label">Theme</p>
      <div className="theme">
        {themeOptions.map((them) => (
          <div
            className={`theme_wrapper ${theme === them.type ? 'selected' : ''}`}
            key={them.type}
            onClick={() => chooseTheme(them.type)}
          >
            <div
              className="theme_gradinet"
              style={{ background: `linear-gradient(90deg, ${them.colorPalatte.base} 75%, ${them.colorPalatte.text} 25%)` }}
            ></div>
            <div className="theme_name">{them.name}</div>
          </div>
        ))}
      </div>

      <p className="section_label">Accent color</p>
      <div className='accent_clr_row'>
        {accentColors.map((clr) => (
          <div
            className={`accent_clr_wrapper ${accent.name === clr.name ? 'selected' : ''}`}
            key={clr.name}
            onClick={() => chooseAccent(clr.name)}
            role="button"
            tabIndex={0}
            aria-label={`Use ${clr.name} accent`}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                chooseAccent(clr.name)
              }
            }}
          >
            <div className="accent_dot" style={{ background: clr.color }} />
          </div>
        ))}
      </div>

      {/* <p className="section_label">Text size</p>
      <div className='text_size_row'>/
        {textSizes.map((text) => (
          <div
            key={text.type}
            className={`text_size_option ${textSize === text.type ? 'selected' : ''}`}
            onClick={() => chooseTextSize(text.type)}
          >
            {text.name}
          </div>
        ))}
      </div>

      <div className='row_with_toggle'>
        <div>
          <div className="row_title">Reduce motion</div>
          <p className="row_desc">Turns off page transitions and animated entrances.</p>
        </div>
        <div
          className={`toggle_btn ${reduceMotion ? 'on' : ''}`}
          onClick={toggleReduceMotion}
        ></div>
      </div>

      <div className="navbar_style">
        <div>
          <p className="row_title">Navigation layout</p>
          <p className="row_desc">Choose how you move between sections of NexStudy.</p>
        </div>
        <div className="options_navstyle">
          {navStyles.map((nav) => (
            <div
              key={nav.type}
              className={`option_navstyle ${navStyle === nav.type ? 'selected' : ''}`}
              onClick={() => chooseNavStyle(nav.type)}
            >
              <div className="option_navstyle_name">{nav.name}</div>
              <div className="option_navstyle_desc">{nav.desc}</div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}

export default Appearance