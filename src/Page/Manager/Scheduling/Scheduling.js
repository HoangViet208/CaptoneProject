import React, { Fragment, useCallback, useEffect, useState } from 'react'
import vnLocale from '@fullcalendar/core/locales/vi'
import FullCalendar from '@fullcalendar/react'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import timeGridWeek from '@fullcalendar/timegrid'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import dayGridPlugin from '@fullcalendar/daygrid'
//date-picker-range
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
//mui
import {
    Select,
    MenuItem,
    FormControl,
    DialogActions,
    Autocomplete,
    TextField,
    InputLabel,
    Button,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
//icon
import FilterListIcon from '@mui/icons-material/FilterList'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

//component
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import Navbar from '../Navbar'
import PopupData from '../../../Components/Popup'
import { formatDateExact, formattedDate } from '../../../Hook/useFormatDate'
import NavbarHR from '../NavbarHR'

//style
//style
import './Style.css'
import { useDispatch, useSelector } from 'react-redux'
import {
    GetWorkedSlotAsyncApi,
    PostWorkEmployeeByDepartmentAsyncApi,
    PostWorkedSlotAsyncApi,
    PostWorkedSlotEmployeeAsyncApi,
} from '../../../Redux/Worked/WorkedSlice'
import { getDepartmentAsyncApi } from '../../../Redux/Department/DepartmentSlice'
import { useSnackbar } from '../../../Hook/useSnackbar'
import { GetWorkedSlotForPersonalAsyncApi } from '../../../Redux/WorkSlotEmployee/WorkSlotEmployeeSlice'
import LinearWithValueLabel from '../../../Components/LoadingPercent'
import Loading from '../../Loading/Loading'

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Time Sheet', icon: <BadgeIcon />, url: '/Employee', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

const dataList = [
    {
        name: 'Việt',
        avatar: 'https://haycafe.vn/wp-content/uploads/2022/03/Anh-anime-nu-anh-anime-girl-449x600.jpg',
        working: [
            { out: '7:00', in: '7:00', work: '7:00', active: '7:00', date: new Date() },
            { out: '7:00', in: '7:00', work: '7:00', active: '7:00', date: new Date() },
            { out: '7:00', in: '7:00', work: '7:00', active: '7:00', date: new Date() },
            { out: '7:00', in: '7:00', work: '7:00', active: '7:00', date: new Date() },
            { out: '7:00', in: '7:00', work: '7:00', active: '7:00', date: new Date() },
            { out: '7:00', in: '7:00', work: '7:00', active: '7:00', date: new Date() },
            { out: '7:00', in: '7:00', work: '7:00', active: '7:00', date: new Date() },
            { out: '7:00', in: '7:00', work: '7:00', active: '7:00', date: new Date() },
            { out: '7:00', in: '7:00', work: '7:00', active: '7:00', date: new Date() },
            { out: '7:00', in: '7:00', work: '7:00', active: '7:00', date: new Date() },
        ],
    },
    {
        name: 'Đạt',
        avatar: 'https://antimatter.vn/wp-content/uploads/2022/11/hinh-anh-anime-nu-334x600.jpg',
        working: [
            { out: '00:00', in: '7:00', work: '7:00', active: '7:00', date: new Date() },
            { out: '7:00', in: '7:00', work: '7:00', active: '7:00', date: new Date() },
        ],
    },
]

export default function SchedulingHRandManagament() {
    const [open, setOpen] = useState()
    const [selectedDateRange, setSelectedDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    })
    const [loadingButton, setLoadingButton] = useState(false)
    const [open1, setOpen1] = useState(false)
    const [messageAlert, setMessageAlert] = useState('')
    const [alert, setAlert] = useState('')

    let callbackFunctionAlert = (childData) => {
        setAlert(childData)
    }

    let callbackFunctionPopup = (childData) => {
        setOpen(childData)
    }
    let callbackFunctionPopup1 = (childData) => {
        setOpen1(childData)
    }
    const moment = require('moment')
    const [currentMonth, setCurrentMonth] = useState(null) // Lưu trữ tháng hiện tại

    const { WorkedSlot, loading, WorkslotForPersonal } = useSelector((state) => state.WorkSlotEmployee)
  
    const dispatch = useDispatch()
    const userStringEmployeeName = localStorage.getItem('employeeId')
    const employeeId = JSON.parse(userStringEmployeeName)
    const [loadingData, setLoadingData] = useState(true)
    useEffect(() => {
    
        currentMonth &&   dispatch(
                GetWorkedSlotForPersonalAsyncApi({
                    month: formatDateExact(currentMonth),
                    id: employeeId,
                })
            ).then((response) => {
                if (response.meta.requestStatus == 'fulfilled') {
                    setLoadingData(false)
                }
            })
            .catch((error) => {
                setLoadingData(false)
            })
        return () => {}
    }, [currentMonth])

    const getAllCarschedule = () => {}
  

    const calendarRef = React.createRef()
    const [id, setid] = useState(null)
    const [event, setEvent] = useState(null)
    const [carStatusId, setCarStatusId] = useState(0)
    const [carId, setCarId] = useState(0)

    const handleDateRangeChange = (ranges) => {
        setSelectedDateRange(ranges.selection)
    }

    const clickOpenFalse = (event) => {
        setOpen(false)
        setSelectedDateRange({})
    }
    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClickSave = () => {
        setOpen(false)
    }
    const topName = ['khoa', 'việt', 'tài']
    const viewModalContent = (
        <Fragment>
            <div className=" gap-5 py-4 px-8 mb-5 lg:my-0"></div>

            <DialogActions>
                <div className="flex gap-5">
                    <Button variant="contained" color="inherit" autoFocus onClick={handleClickSave}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" autoFocus>
                        Save changes
                    </Button>
                </div>
            </DialogActions>
        </Fragment>
    )
    const viewModalAction = (
        <Button autoFocus onClick={handleClickSave}>
            Save changes
        </Button>
    )

    const handleChangeMonth = (info) => {
        const startDate = info.view.currentStart

        // Lấy ngày đầu của tháng
        const firstDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1)

        // Chuyển đổi định dạng ngày thành "yyyy/MM/dd"
        const formattedStartDate = firstDayOfMonth.toLocaleDateString('en-CA')
        const formattedDate = formattedStartDate.replace(/-/g, '/')
        // Hiển thị tháng hiện tại dưới dạng "yyyy/MM/dd"
        setCurrentMonth(formattedDate)
    }
  
    const events = [
        {
            title: 'Event 1',
            start: '2023-09-01',
        },
        {
            title: 'Event 2',
            start: '2023-09-02',
        },
        {
            title: 'Event 3',
            start: '2023-09-08',
        },
        {
            title: 'Event 4',
            start: '2023-09-09',
        },
    ]
    const newEvents = loadingData == true ? "" : WorkslotForPersonal.map((item, index) => {
        return {
            start: item.date,
            title: item.title,
            time: item.startTime + ' ~ ' + item.endTime,
        }
    })
    console.log('sada', newEvents)

    const dayHeaderContent = (info) => {
        const date = info.date
        const dayOfWeek = date.getDay()

        if (dayOfWeek === 0 /* Sunday */) {
            return (
                <div className="sunday-header" style={{ backgroundColor: '#FF0000', color: '#FFFFFF' }}>
                    {info.dayNumberText}
                </div>
            )
        }

        return info.dayNumberText
    }
    function renderEventContent(eventInfo) {
        // Tùy chỉnh cách hiển thị sự kiện
        console.log('eventInfo.event', eventInfo.event)
        if (eventInfo.event.title === 'Not working') {
            return (
                <div className="working-event text-black">
                    <b>{eventInfo.timeText}</b>
                    <div className="flex my-2 gap-2 bg-none items-center mx-auto ml-4">
                        <button className="rounded-full bg-gray-600 w-2 h-2"></button>
                        <p className=" ">{eventInfo.event.title}</p>
                    </div>
                </div>
            )
        } else {
            // Xử lý hiển thị các sự kiện khác
            return (
                <div className="text-black">
                {eventInfo.event.title == 'Working' ? (
                    <div className="flex bg-blue-500 p-2 rounded-md my-2 gap-2 bg-none items-center mx-auto">
                        <p className="text-white">{eventInfo.event.extendedProps.time}</p>
                    </div>
                ) : eventInfo.event.title == 'Overtime' ? (
                    <div className="flex bg-orange-500 p-2 rounded-md my-2 gap-2 bg-none items-center mx-auto ">
                        <p className="text-white">{eventInfo.event.extendedProps.time}</p>
                    </div>
                ) : eventInfo.event.title == 'Overtime' ? (
                    <div className="flex bg-orange-500 p-2 rounded-md my-2 gap-2 bg-none items-center mx-auto ">
                        <p className="text-white">{eventInfo.event.title}</p>
                    </div>
                ) : eventInfo.event.title == 'Leave' ? (
                    <div className="flex bg-emerald-500 p-2 rounded-md my-2 gap-2 bg-none items-center mx-auto ">
                        <p className="text-white">{eventInfo.event.title}</p>
                    </div>
                ) : (
                    <div className="flex bg-gray-500 p-2 rounded-md my-2 gap-2 bg-none items-center mx-auto ">
                        <p className="text-white">{eventInfo.event.title}</p>
                    </div>
                )}
            </div>
            )
        }
    }
    const [openPopup, setOpenPopup] = useState(false)
    const showSnackbar = useSnackbar()
  
    const [userRole, setUserRole] = useState(() => {
        const userString = localStorage.getItem('role')
        const userObject = JSON.parse(userString)
        return userObject || 'defaultRole'
    })
    return (
        <div>
            <PopupData
                open={open}
                clickOpenFalse={clickOpenFalse}
                viewTitle={'Create Work Slot Department'}
                viewContent={viewModalContent}
            />

            {userRole === 'Manager' ? <Navbar /> : <NavbarHR />}
            <div className="text-xl mb-5 sm:ml-64  pt-20 ">
                <div className="flex">
                    <div className="ml-4 flex  items-center gap-1">
                        <button className="h-6 w-6 bg-blue-500"></button> :<p>Working Date</p>
                    </div>
                    <div className="ml-4 flex  items-center gap-1">
                        <button className="h-6 w-6 bg-orange-500"></button> :<p>Overtime</p>
                    </div>
                </div>
            </div>
            <div className="sm:ml-64 bg-gray-50">
                <div className="w-full py-8 px-5 bg-white relative ">
                    <div className="  xl:flex mb-2 w-full  absolute right-[200px] top-[32px]">
                     
                     
                    </div>
                   
                    <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin]}
                    datesSet={handleChangeMonth}
                    initialView="dayGridMonth"
                    events={newEvents}
                    eventContent={renderEventContent}
                    headerToolbar={{
                        left: '',
                        center: 'title',
                        right: 'prev,next today',
                    }}
                    height="150vh"
                    daysOfWeek={(0, 1)}
                    DayGrid={true}
                    TimeGrid={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    daysHidden={[6, 5]}
                    editable={true}
                    droppable={true}
                    eventBackgroundColor={'#ffffff'}
                    eventBorderColor={'#ffffff'}
                    className="custom-calendar"
                />
                   
                </div>
            </div>
        </div>
    )
}
