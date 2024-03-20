import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { NavLink } from 'react-router-dom'

//Mui
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Avatar, TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import dayjs from 'dayjs'
import { LoadingButton } from '@mui/lab'
//Icon
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import FilterListIcon from '@mui/icons-material/FilterList'
import DeleteIcon from '@mui/icons-material/Delete'

//Component
import Search from '../../../Components/Search'
import TableData from '../../../Components/Table'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import TabsData from '../../../Components/Tabs'
import PopupConfirm from '../../../Components/PopupConfirm'

//hooks
import { formatDate, formatDateExact } from '../../../Hook/useFormatDate'
import { useDispatch, useSelector } from 'react-redux'
import { PutOvertimeAsyncApi, getOvertimeAsyncApi } from '../../../Redux/Overtime/OvertimeSlice'
import { useSnackbar } from '../../../Hook/useSnackbar'
import NavbarHR from '../NavbarHR'
import TableLoadData from '../../../Components/TableLoad'

const columnsPending = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Employee Name', minWidth: 250, align: 'left' },
    { id: 'dayAndTime', label: 'Date', minWidth: 250, align: 'left' },
    { id: 'timeInMonth', label: 'Time In Month', minWidth: 100, align: 'center' },
    { id: 'timeInYear', label: 'Time In Year', minWidth: 100, align: 'center' },
    { id: 'files', label: 'File', minWidth: 100, align: 'left' },
    { id: 'applied', label: 'Applied On', minWidth: 50, align: 'center' },
    { id: 'reason', label: 'Reason', minWidth: 50, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 50, maxWidth: 50, align: 'left' },
]

const columnsApprove = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Employee Name', minWidth: 250, align: 'left' },
    { id: 'dayAndTime', label: 'Date', minWidth: 250, align: 'left' },
    { id: 'files', label: 'File', minWidth: 100, align: 'left' },
    { id: 'applied', label: 'Applied On', minWidth: 50, align: 'center' },

    { id: 'reason', label: 'Reason', minWidth: 50, align: 'center' },
]
const columnsReject = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Employee Name', minWidth: 250, align: 'left' },
    { id: 'dayAndTime', label: 'Date', minWidth: 250, align: 'left' },
    { id: 'files', label: 'File', minWidth: 100, align: 'left' },
    { id: 'applied', label: 'Applied On', minWidth: 50, align: 'center' },

    { id: 'reason', label: 'Reason', minWidth: 50, align: 'center' },
]
const columnsAll = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Employee Name', minWidth: 250, align: 'left' },
    { id: 'dayAndTime', label: 'Date', minWidth: 250, align: 'left' },
    { id: 'files', label: 'File', minWidth: 100, align: 'left' },
    { id: 'applied', label: 'Applied On', minWidth: 50, align: 'center' },
    { id: 'status', label: 'Status', minWidth: 50, align: 'left' },
    { id: 'reason', label: 'Reason', minWidth: 50, align: 'center' },
    { id: 'actionAll', label: 'Actions', minWidth: 50, maxWidth: 50, align: 'left' },
]

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Manage Overtime', icon: <BadgeIcon />, url: '/ManageOvertime', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

export default function ManageOvertime() {
    const [loadingButton, setLoadingButton] = useState(false)
    const [loadingRJButton, setLoadingRJButton] = useState(false)
    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState('')
    const showSnackbar = useSnackbar()
    const today = new Date()
    console.log('date', formatDateExact(today))
    const [selectedDate, setSelectedDate] = useState(dayjs())
    //setting redux
    const { valueTabs } = useSelector((state) => state.applyLeave)
    const { OvertimeList, loading } = useSelector((state) => state.overTime)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(
            getOvertimeAsyncApi({
                name: search,
                status: valueTabs == 3 ? -1 : valueTabs,
                date: formatDateExact(selectedDate),
            })
        )
        return () => {}
    }, [search, valueTabs, selectedDate])
    const handleChangePage = (newPage) => {
        setPage(newPage)
    }
 const [userRole, setUserRole] = useState(() => {
        const userString = localStorage.getItem('role')
        const userObject = JSON.parse(userString)
        return userObject || 'defaultRole' // Provide a default role if undefined
    })
    useEffect(() => {
        // Update the userRole state whenever 'role' is changed in localStorage
        const handleStorageChange = () => {
            const userString = localStorage.getItem('role')
            const userObject = JSON.parse(userString)
            setUserRole(userObject || 'defaultRole')
        }

        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }
    const callbackSearch = (childData) => {
        setSearch(childData)
    }
    const handleClickOpen = () => {
        setOpen(true)
    }
    const clickOpenFalse = (event) => {
        setOpen(false)
    }

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate)
    }
    console.log('123', selectedDate)
    const searchData = (data) => {
        return (
            <div className="p-4">
                <div className="mb-5 flex items-center">
                    <Search parentCallback={callbackSearch} />
                    <div className="ml-auto md:mr-4 mr-4 -mt-1">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                label="Month"
                                size="small"
                                openTo="month"
                                views={['year', 'month']}
                                value={selectedDate}
                                onChange={handleDateChange}
                                inputFormat="DD/MM/YYYY "
                                // onChange={() => 1}
                                renderInput={(params) => (
                                    <TextField
                                        size="small"
                                        // error={
                                        //     formik.errors.rentFrom &&
                                        //         formik.touched.rentFrom
                                        //         ? true
                                        //         : undefined
                                        // }
                                        {...params}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </div>
                </div>
                {data}
            </div>
        )
    }
    const handleClickApprove = (data) => {
        setLoadingButton(true)
        const Updatedata = {
            requestId: data.id,
            status: 1,
        }
        dispatch(PutOvertimeAsyncApi({ id: data.employeeId, body: Updatedata }))
            .then((response) => {
                setLoadingButton(false)
                if (response.meta.requestStatus == 'fulfilled') {
                    dispatch(
                        getOvertimeAsyncApi({
                            name: search,
                            status: valueTabs == 3 ? -1 : valueTabs,
                            date: formatDateExact(selectedDate),
                        })
                    )
                    showSnackbar({
                        severity: 'success',
                        children: 'Approved request',
                    })
                }
            })
            .catch((error) => {
                setLoadingButton(false)
            })
    }
    const handleClickReject = (data) => {
        setLoadingRJButton(true)
        const Updatedata = {
            requestId: data.id,
            status: 2,
        }
        dispatch(PutOvertimeAsyncApi({ id: data.employeeId, body: Updatedata }))
            .then((response) => {
                setLoadingRJButton(true)
                if (response.meta.requestStatus == 'fulfilled') {
                    dispatch(
                        getOvertimeAsyncApi({
                            name: search,
                            status: valueTabs == 3 ? -1 : valueTabs,
                            date: formatDateExact(selectedDate),
                        })
                    )
                    showSnackbar({
                        severity: 'success',
                        children: 'Reject request',
                    })
                }
            })
            .catch((error) => {
                setLoadingRJButton(true)
            })
    }
    const createRows = () => {
  

        return OvertimeList.map((item, index) => ({
            ...item,
            reason: (
                <Tooltip title={item.reason}>
                    <div>{item.reason.length > 5 ? item.reason.slice(0, 5) + '...' : item.reason}</div>
                </Tooltip>
            ),
            dayAndTime: formatDate(item.date) + ' , ' + item.timeStart + ' ~ ' + item.timeEnd,
            timeInMonth: item.timeInMonth + '/40 hours',
            timeInYear: item.timeInYear + '/200 hours',
            files: (
                <a className="mt-2 text-blue-400 underline" href={item.linkFile} target="_blank">
                    Link
                </a>
            ),
            applied: formatDate(item.submitDate),
            info: (
                <div className="flex gap-2 items-center ">
                    {' '}
                    {/* Added the class 'align-center' for centering */}
                    <p className="font-bold">{item.employeeName}</p>
                </div>
            ),
            number: index + 1,
            action: userRole === 'Manager' ? (
                <div className="flex gap-2">
                    <div className="border-[1px] border-green-500 text-green-500 px-4 py-1 rounded-3xl hover:bg-green-500 hover:text-white">
                        <LoadingButton
                            type="submit"
                            loading={loadingButton}
                            sx={{
                                textAlign: 'center',
                                color: 'rgb(34 197 94)',
                                '&:hover': {
                                    color: 'white',
                                },
                            }}
                            autoFocus
                            onClick={() => handleClickApprove(item)}
                        >
                            Approve
                        </LoadingButton>
                    </div>
                    <div className="border-[1px] border-red-500 text-red-500 px-4 py-1 rounded-3xl hover:bg-red-500 hover:text-white">
                        <LoadingButton
                            type="submit"
                            loading={loadingRJButton}
                            sx={{
                                textAlign: 'center',
                                color: 'rgb(239 68 68)',
                                '&:hover': {
                                    color: 'white',
                                },
                            }}
                            autoFocus
                            onClick={() => handleClickReject(item)}
                        >
                            Reject
                        </LoadingButton>
                    </div>
                </div>
            ) : '',
            actionAll: (
                <Tooltip title="Delete">
                    <div onClick={handleClickOpen}>
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </Tooltip>
            ),
           
            status:   item.status == 'Approved' ? (
                <p className="text-green-500">{item.status}</p>
            ) : item.status == 'Rejected' ? (
                <p className="text-red-500">{item.status}</p>
            ) : (
                <p className="text-yellow-500">{item.status}</p>
            ) ,
               
        }))
    }

    const rows = createRows()
    const filteredColumnsPending = userRole === 'HR'
    ? columnsPending.filter(column => column.id !== 'action')
    : columnsPending;
    const tabsData = [
        {
            label: 'Pending Overtime',
            view: searchData(
                loading == true ? (
                    <TableLoadData columns={columnsPending} tableHeight={540} />
                ) : (
                    <TableData
                        tableHeight={480}
                        rows={rows}
                        columns={filteredColumnsPending}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )
            ),
        },
        {
            label: 'Approved Overtime',
            view: searchData(
                loading == true ? (
                    <TableLoadData columns={columnsPending} tableHeight={540} />
                ) : (
                    <TableData
                        tableHeight={480}
                        rows={rows}
                        columns={columnsApprove}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )
            ),
        },
        {
            label: 'Reject Overtime',
            view: searchData(
                loading == true ? (
                    <TableLoadData columns={columnsPending} tableHeight={540} />
                ) : (
                    <TableData
                        tableHeight={480}
                        rows={rows}
                        columns={columnsReject}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )
            ),
        },
        {
            label: 'All Overtimes',
            view: searchData(
                loading == true ? (
                    <TableLoadData columns={columnsPending} tableHeight={540} />
                ) : (
                    <TableData
                        tableHeight={480}
                        rows={rows}
                        columns={columnsAll}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )
            ),
        },
    ]
   
    return (
        <div>
            {userRole === 'Manager' ? <Navbar /> : <NavbarHR />}
            <PopupConfirm open={open} clickOpenFalse={clickOpenFalse} />
            <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4">Manage Overtime List </h2>
                    <div className="mb-8 font-semibold">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                    </div>
                    <div className="bg-white">
                        <TabsData data={tabsData} />
                    </div>
                </div>
            </div>
        </div>
    )
}
