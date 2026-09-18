import React from 'react'
import { Outlet } from "react-router-dom";
import "../../layouts/css/zMainLayout.css"

const Activities = () => {
  return (
    <div className='outlet-higth'>
      <Outlet />
    </div>
  )
}

export default Activities