import React from 'react'
import { Plus } from "reicon-react"
import Button from "../../../components/ui/buttons/Button.jsx"
import "./css/zCreateTimetable.css"

const TIME_TABLE_CREATE_TEXT = [
  {
    title: "No timetable yet",
    message: "Create your timetable to organize your classes and keep track of your schdules",
  },
  {
    title: "Your timetable is empty",
    message: "Add your classes to get started"
  },
  {
    title: "Let's set up your timetable",
    message: "Add your classes and build your weekly schedule"
  }
]

let variantIndex = 0

const CreateTimetable = ({ onCreate }) => {

  const text = TIME_TABLE_CREATE_TEXT[variantIndex++ % TIME_TABLE_CREATE_TEXT.length]

  return (
    <div className='timetable_create_warrper'>
      <h3>{text.title}</h3>
      <p>{text.message}</p>
      <Button text="Create timetable" icon={Plus} onClick={onCreate} />
    </div>
  )
}

export default CreateTimetable
