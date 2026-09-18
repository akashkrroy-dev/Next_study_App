import React, { useState, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext.jsx'
import Avtar from '../../features/profile/components/Avatar.jsx'
import './css/zSidebar.css'
import {
  Chart2,
  Settings,
  CodeScan,
  AlertSquare,
  AngleDown,
  AngleUp,
  AnglesRight2,
  AnglesLeft2,
} from 'reicon-react'

const Sidebar = () => {

  // * SIDEBAR OPTIONS
  const sidebarItems = [
    { title: 'Dashboard', path: '/', icon: CodeScan },
    {
      title: 'Activities',
      path: '/activities',
      icon: Chart2,
      Children: [
        { title: 'Attendances', path: '/activities', color: '#6C5CE7' },
        { title: 'Habits', path: '/activities/habits', color: '#1ABC9C' },
        { title: 'Todos', path: '/activities/todos', color: '#F0A93B' },
        { title: 'Events', path: '/activities/events', color: '#E84393' },
      ],
    },
    { title: 'Notifications', path: '/notifications', icon: AlertSquare },
    { title: 'Settings', path: '/profile', icon: Settings },
  ]

  // * STATES
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)
  const [openMenu, setOpenMenu] = useState(null)

  const toggleSidebar = () => setIsOpen((i) => !i)

  // * CLICK ACTION
  const handleOptionClick = (item) => {
    if (item.Children) {
      setOpenMenu((i) => (i === item.title ? null : item.title))
    } else {
      navigate(item.path)
    }
  }

  //* --- SIDEBAR COLLAPSE/EXPAND ---
  const sidebarRef = useRef(null)

  useGSAP(
    () => {
      const el = sidebarRef.current
      if (!el) return

      const tl = gsap.timeline({
        defaults: { duration: 0.35, ease: 'power3.inOut' },
      })

      // * CONTAINER WIDTH
      tl.to(
        el,
        { width: isOpen ? '16rem' : 'calc(24px + 1.5rem * 2)' },
        0
      )

      // * PADDING
      tl.to(
        '.sidebar-header, .sidebar-profile',
        {
          paddingLeft: isOpen ? '1.5rem' : '0rem',
          paddingRight: isOpen ? '1.5rem' : '0rem',
          gap: isOpen ? "0.75rem" : 0,
        },
        0
      )

      tl.to(
        '.option',
        {
          gap: isOpen ? '0.75rem' : 0,
          paddingLeft: isOpen ? '0.75rem' : '0rem',
          paddingRight: isOpen ? '0.75rem' : '0rem',
        },
        0
      )

      tl.to('.sidebar-profile', { gap: isOpen ? '0.75rem' : 0 }, 0)

      //* CHILD OPTIONS
      tl.to(
        '.child-options-parent',
        { paddingLeft: isOpen ? '1.9rem' : '0rem' },
        0
      )
      tl.to(
        '.child-options',
        { paddingLeft: isOpen ? '0.6rem' : '0rem' },
        0
      )
      tl.to(
        '.child-options > div',
        {
          gap: isOpen ? '0.6rem' : 0,
          paddingLeft: isOpen ? '0.6rem' : '0rem',
          paddingRight: isOpen ? '0.6rem' : '0rem',
          width: isOpen ? "100%" : "2.1rem"
        },
        0
      )

      //* LABLES: collapse flex-grow + width so icons can center 
      tl.to(
        '.lable, .app-name, .profile-data, .sub-lable',
        {
          opacity: isOpen ? 1 : 0,
          flexGrow: isOpen ? 1 : 0,
          width: isOpen ? 'auto' : 0,
          duration: isOpen ? 0.3 : 0.18,
        },
        isOpen ? 0.12 : 0
      )

      tl.to(
        '.chevron',
        {
          opacity: isOpen ? 1 : 0,
          width: isOpen ? 'auto' : 0,
          duration: isOpen ? 0.3 : 0.18,
        },
        isOpen ? 0.12 : 0
      )

    },
    { dependencies: [isOpen] }
  )

  //* --- SUBMENU ANIMATION ---
  const childRefs = useRef({})

  useGSAP(() => {
    sidebarItems.forEach((item) => {
      if (!item.Children) return
      const el = childRefs.current[item.title]
      if (el) gsap.set(el, { height: 0, opacity: 0, overflow: 'hidden' })
    })
  }, [])

  useGSAP(
    () => {
      sidebarItems.forEach((item) => {
        if (!item.Children) return
        const el = childRefs.current[item.title]
        if (!el) return

        const opening = openMenu === item.title
        gsap.to(el, {
          height: opening ? 'auto' : 0,
          opacity: opening ? 1 : 0,
          duration: opening ? 0.3 : 0.25,
          ease: opening ? 'power2.out' : 'power2.in',
        })
      })
    },
    { dependencies: [openMenu] }
  )

  // * user fatched data from user context
  const { user, userLoading } = useUser()

  return (
    <div className="sidebar-body" ref={sidebarRef}>
      <div className="sidebar-header">
        <div className="app-name">next.study</div>
        <div className="icon" onClick={toggleSidebar}>
          {isOpen ? <AnglesLeft2 size={24} /> : <AnglesRight2 size={24} />}
        </div>
      </div>

      <div className="sidebar-options">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isSubOpen = openMenu === item.title
          return (
            <div className="options" key={item.title}>
              <div className="option" onClick={() => handleOptionClick(item)}>
                <div className="icon">
                  <Icon size={24} />
                </div>
                <div className="lable">{item.title}</div>
                {item.Children && (
                  <div className="chevron">
                    {isSubOpen ? <AngleUp size={24} /> : <AngleDown size={24} />}
                  </div>
                )}
              </div>

              <div
                className="child-options-parent"
                ref={(el) => (childRefs.current[item.title] = el)}
              >
                {item.Children && (
                  <div className="child-options">
                    {item.Children.map((child) => (
                      <div
                        key={child.title}
                        onClick={() => navigate(child.path)}
                      >
                        <div
                          className="dot"
                          style={{ backgroundColor: child.color }}
                        ></div>
                        <div className="sub-lable">{child.title}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="sidebar-profile">
        <div className="profile-img" onClick={() => navigate("/profile")}>
          <Avtar username={user?.username} imgUrl={user?.profileImg?.url} size={40} />
        </div>
        <div className="profile-data">
          <div className="username">{user?.username}</div>
          <div className="email">{user?.email}</div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar