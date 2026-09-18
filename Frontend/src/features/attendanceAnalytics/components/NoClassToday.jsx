import React, { useMemo } from 'react'
import Button from '../../../components/ui/buttons/Button.jsx'

const DATA = [
  {
    heading: "No classes today!",
    message: "Enjoy the free time — nothing's scheduled for you right now."
  },
  {
    heading: "You're all clear!",
    message: "Your timetable is empty for today. Take a breather."
  },
  {
    heading: "Nothing on the schedule",
    message: "Looks like today is wide open — a good day to catch up or relax."
  }
]

const NEEDS_SETUP = [
  {
    heading: "Set up your timetable",
    message: "You haven't added any classes yet — add your subjects to get started."
  }
]

const NoclassToday = ({ hasClass, onSetClasses }) => {
  const pool = hasClass ? DATA : NEEDS_SETUP

  const { heading, message } = useMemo(
    () => pool[Math.floor(Math.random() * pool.length)],
    [pool]
  )

  const handleClick = () => {
    onSetClasses?.(true)
  }

  return (
    <div className='no_class_today'>
      <h3 className="apply_clash">{heading}</h3>
      <p className="apply_poppins">{message}</p>
      {!hasClass && <Button text="Set Classes" onClick={handleClick} />}
    </div>
  )
}

export default NoclassToday