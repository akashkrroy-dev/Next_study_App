import { useContext, createContext, useState } from "react";
import { useUser } from "./UserContext.jsx";

export const TimetableListContext = createContext(null);
export const CurrentTimetableContext = createContext(null);
export const CurrentTimetableIdContext = createContext(null);
export const CurrentTimetableScheduleContext = createContext(null);

export const AttendanceProvider = ({ children }) => {
    const [timetable_list, setTimetableList] = useState([])
    const [hasCheckedTimetables, setHasCheckedTimetables] = useState(false)
    const [listLoading, setListLoading] = useState(false)
    const [listError, setListError] = useState(null)
    const [currentTimetable, setCurrentTimetable] = useState(null)
    const [currentTimetableId, setCurrentTimetableId] = useState(null)
    const [currentLoading, setCurrentLoading] = useState(false)
    const [currentError, setCurrentError] = useState(null)
    const [classes, setClasses] = useState([])
    const [scheduleLoading, setScheduleLoading] = useState(false)
    const [scheduleError, setScheduleError] = useState(null)
    const [attendanceRevision, setAttendanceRevision] = useState(0)

    return (
        <TimetableListContext.Provider value={{ timetable_list, setTimetableList, hasCheckedTimetables, setHasCheckedTimetables, listLoading, setListLoading, listError, setListError }}>
            <CurrentTimetableContext.Provider value={{ currentTimetable, setCurrentTimetable, currentLoading, setCurrentLoading, currentError, setCurrentError }}>
                <CurrentTimetableIdContext.Provider value={{ currentTimetableId, setCurrentTimetableId }}>
                    <CurrentTimetableScheduleContext.Provider value={{ classes, setClasses, scheduleLoading, setScheduleLoading, scheduleError, setScheduleError, attendanceRevision, bumpAttendanceRevision: () => setAttendanceRevision((current) => current + 1) }}>
                        {children}
                    </CurrentTimetableScheduleContext.Provider>
                </CurrentTimetableIdContext.Provider>
            </CurrentTimetableContext.Provider>
        </TimetableListContext.Provider>
    )
}

const useRequiredContext = (context, name) => {
    const value = useContext(context)
    if (!value) throw new Error(`${name} must be used inside an <AttendanceProvider>`)
    return value
}

export const useTimetableList = () => useRequiredContext(TimetableListContext, "useTimetableList")
export const useCurrentTimetable = () => useRequiredContext(CurrentTimetableContext, "useCurrentTimetable")
export const useCurrentTimetableId = () => useRequiredContext(CurrentTimetableIdContext, "useCurrentTimetableId")
export const useCurrentTimetableSchedule = () => useRequiredContext(CurrentTimetableScheduleContext, "useCurrentTimetableSchedule")

export function useAttendance() {
    const { user } = useUser()
    const { timetable_list, setTimetableList, hasCheckedTimetables, setHasCheckedTimetables, listLoading, setListLoading, listError, setListError } = useTimetableList()
    const { currentTimetable, setCurrentTimetable, currentLoading, setCurrentLoading, currentError, setCurrentError } = useCurrentTimetable()
    const { currentTimetableId, setCurrentTimetableId } = useCurrentTimetableId()
    const { classes, setClasses, scheduleLoading, setScheduleLoading, scheduleError, setScheduleError, attendanceRevision, bumpAttendanceRevision } = useCurrentTimetableSchedule()

    return {
        user,
        timetable_list, setTimetableList,
        currentTimetable, setCurrentTimetable, currentTimetableId, setCurrentTimetableId,
        classes, setClasses,
        hasTimetable: timetable_list.length > 0,
        hasCheckedTimetables, setHasCheckedTimetables,
        timetableLoading: listLoading || currentLoading || scheduleLoading,
        setTimetableLoading: (value) => {
            setListLoading(value)
            setCurrentLoading(value)
            setScheduleLoading(value)
        },
        error: listError || currentError || scheduleError,
        setError: (value) => {
            setListError(value)
            setCurrentError(value)
            setScheduleError(value)
        },
        attendanceRevision,
        bumpAttendanceRevision,
    }
}
