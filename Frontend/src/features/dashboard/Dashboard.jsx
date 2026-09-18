import { useEffect, useState } from 'react'
import './Dashboard.css'
import Header from "../../components/ui/Header.jsx"
import Progressbar from './components/Progressbar.jsx'
import Classes from './components/Classes.jsx'
import Todos from './components/Todos.jsx'
import {
  fetchDashboard,
  fetchLastWeekTodos,
  fetchTotalAttendance,
} from './DashboardApi.js'


const Dashbord = () => {

  const [totalClasses, setTotalClasses] = useState(0)
  const [totalAttended, setTotalAttended] = useState(0)
  const [totalTodos, setTotalTodos] = useState(0)
  const [totalCompletedTodos, setTotalCompletedTodos] = useState(0)
  const [todayClasses, setTodayClasses] = useState([])
  const [upcomingTodos, setUpcomingTodos] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const [dashboardResult, attendanceResult, todosResult] = await Promise.allSettled([
        fetchDashboard(),
        fetchTotalAttendance(),
        fetchLastWeekTodos(),
      ])

      const dashboard = dashboardResult.status === 'fulfilled'
        ? dashboardResult.value.data?.result || {}
        : {}
      const attendance = attendanceResult.status === 'fulfilled'
        ? attendanceResult.value.data?.result || {}
        : {}
      const todos = todosResult.status === 'fulfilled'
        ? todosResult.value.data?.result || {}
        : {}

      setTodayClasses(Array.isArray(dashboard.todayClasses) ? dashboard.todayClasses : [])
      setUpcomingTodos(Array.isArray(dashboard.upcomingTodos) ? dashboard.upcomingTodos : [])
      setTotalClasses(attendance.totalClasses || 0)
      setTotalAttended(attendance.totalAttended || 0)
      setTotalTodos(todos.totalTodos || 0)
      setTotalCompletedTodos(todos.completedTodos || 0)

      if (dashboardResult.status === 'rejected') {
        setError(dashboardResult.reason?.response?.data?.message || 'Unable to load dashboard data.')
      } else {
        setError('')
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className='dashbord_warraper'>
      <div className="dashbord_header">
        <Header name="dashboard" variant="dashboard" />
      </div>
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="dahbord_grid">
          <section className="dashboard-card">
            <Progressbar total={totalClasses} attended={totalAttended} type="attendance" />
          </section>
          <section className="dashboard-card">
            <Progressbar total={totalTodos} attended={totalCompletedTodos} type="todo" />
          </section>
          <section className="dashboard-card">
            <Classes classes={todayClasses} error={error} />
          </section>
          <section className="dashboard-card">
            <Todos todos={upcomingTodos} error={error} />
          </section>
        </div>
      )}
    </div>
  )
}

const DashboardSkeleton = () => (
  <div className="dahbord_grid dahbord_grid--skeleton" aria-busy="true" aria-label="Loading dashboard">
    {[1, 2, 3, 4].map((item) => (
      <section className="dashboard-card dashboard-card--skeleton" key={item}>
        <span />
        <span />
        <span />
      </section>
    ))}
  </div>
)

export default Dashbord