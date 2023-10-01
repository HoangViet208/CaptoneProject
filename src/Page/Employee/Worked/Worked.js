import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

//date-picker-range
import { Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'

import { addDays, startOfDay } from 'date-fns'
//Firebase
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../../Config/FirebaseConfig'

//Mui
import { styled } from '@mui/system'
import {
    Popover,
    InputAdornment,
    TextField,
    OutlinedInput,
    Select,
    Button,
    FormControl,
    MenuItem,
    DialogActions,
    Tooltip,
    IconButton,
    InputLabel,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
//Icon
import EventNoteIcon from '@mui/icons-material/EventNote'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import FilterListIcon from '@mui/icons-material/FilterList'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

//Component
import TableData from '../../../Components/Table'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import PopupData from '../../../Components/Popup'
import PopupConfirm from '../../../Components/PopupConfirm'
import Navbar from '../Navbar'

//hooks
import {
    calculateDays,
    calculateTime,
    formatDate,
    formatTimeToDate,
    formattedDate,
    getDateRangeArray,
    getDayOfWeek,
} from '../../../Hook/useFormatDate'
import { useDispatch, useSelector } from 'react-redux'
import {
    PostWorkedAsyncApi,
    PutWorkedAsyncApi,
    getWorkedAsyncApi,
    getWorkedByIdAsyncApi,
} from '../../../Redux/Worked/WorkedSlice'
import { useSnackbar } from '../../../Hook/useSnackbar'
import TableLoadData from '../../../Components/TableLoad'

const CustomSelect = styled(Select)`
    color: #60a5fa; // Đổi màu chữ thành xanh
    & select:focus {
        background-color: transparent; // Loại bỏ màu nền khi focus
    }
    & svg {
        color: #60a5fa; // Đổi màu biểu tượng mũi tên thành xanh
    }
    & fieldset {
        border: none; // Loại bỏ viền xung quanh
    }
`

const columns = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'date', label: 'Date', minWidth: 150, align: 'center' },
    { id: 'checkInTime', label: 'Check In Time', maxWidth: 200, align: 'center' },
    { id: 'checkOutTime', label: 'Check Out Time', maxWidth: 200, align: 'center' },
    { id: 'slotStart', label: 'Slot Start', maxWidth: 150, align: 'center' },
    { id: 'slotEnd', label: 'Slot End', maxWidth: 150, align: 'center' },
    { id: 'status', label: 'Status', minWidth: 100, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 100, align: 'center' },
]

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Worked', icon: <BadgeIcon />, url: '/Employee/Worked', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

export default function Worked() {
    const [loadingButton, setLoadingButton] = useState(false)
    //popover
    const [anchorEl, setAnchorEl] = React.useState(null)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const [error, SetError] = useState()
    const [errorImport, seterrorImport] = useState(false)
    const [chosenFileName, setChosenFileName] = useState('Chosen file')
    const fileInputRef = useRef(null)
    const openPopover = Boolean(anchorEl)
    const id = openPopover ? 'simple-popover' : undefined
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [open, setOpen] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [isAction, setIsAction] = useState(0)
    const [search, setSearch] = useState('')
    const [selectedImage, setSelectedImage] = useState()
    const [click, SetClick] = useState(false)
    const [leaveDays, setLeaveDays] = useState(0)
    const [leaveDaysDate, setLeaveDaysDate] = useState([])
    const today = new Date()
    const [reason, setReason] = useState('')
    const threeDaysLater = addDays(today, 3)
    const [selectedStartTime, setSelectedStartTime] = useState(null)
    const [selectedEndTime, setSelectedEndTime] = useState(null)
    const [workslotEmployeeId, setworkslotEmployeeId] = useState()
    const [requestId, setrequestId] = useState()
    const userStringEmployeeName = localStorage.getItem('employeeId')
    const employeeId = JSON.parse(userStringEmployeeName)
    const showSnackbar = useSnackbar()
    //setting redux
    const { WorkedByEmployee, loading } = useSelector((state) => state.worked)

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getWorkedByIdAsyncApi(employeeId))
        return () => {}
    }, [])
    const handleClose = () => {
        setAnchorEl(null)
        setIsAction(0)
        setSelectedStartTime(null)
        setSelectedEndTime(null)
        setworkslotEmployeeId()
        setReason()
        seterrorImport(false)
        setChosenFileName('Chosen file')
    }
    const handleChangeStartTime = (newTime) => {
        setSelectedStartTime(newTime)
    }
    const handleChangeEndTime = (newTime) => {
        setSelectedEndTime(newTime)
    }
    const handleBrowseButtonClick = () => {
        fileInputRef.current.click()
    }
    const [dateRange, setDateRange] = useState([
        {
            startDate: threeDaysLater,
            endDate: threeDaysLater,
            key: 'selection',
        },
    ])
    const minDate = startOfDay(threeDaysLater)
    const dataLeaveType = ['Casual Leave', 'Sick Leave']

    const handleChangePage = (newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }
    const callbackSearch = (childData) => {
        setSearch(childData)
    }
    const handleFileInputChange = (event) => {
        const selectedFile = event.target.files[0]
        seterrorImport(false)
        setSelectedImage(event.target.files[0])
        SetClick(true)
        SetError()
        if (selectedFile) {
            setChosenFileName(selectedFile.name)
            seterrorImport(true)
        }
    }
    const handleClickOpenAdd = () => {
        setOpen(true)
        setIsAction(1)
    }
    const handleClickOpenUpdate = (data, event) => {
        setAnchorEl(event.currentTarget)
        setIsAction(1)
        const startTime = formatTimeToDate(data.slotStart)
        const endTime = formatTimeToDate(data.slotEnd)
        console.log(1234, startTime, endTime, data.timeLate)
        setSelectedStartTime(startTime)
        setSelectedEndTime(endTime)

        setworkslotEmployeeId(data.workslotEmployeeId)
        if (data.statusName != 'Lack Of Work Time') {
            setReason(data.reason)
            setrequestId(data.requestId)
            setChosenFileName(data.linkFile)
            seterrorImport(true)
            setIsAction(2)
        }
    }
    console.log(1234, selectedEndTime)
    const clickOpenFalse = (event) => {
        setOpen(false)
        setIsAction(0)

        setDateRange([
            {
                startDate: threeDaysLater,
                endDate: threeDaysLater,
                key: 'selection',
            },
        ])
        setLeaveDays(0)
        setLeaveDaysDate([])
    }
    const handleClickOpenConfirm = () => {
        setOpenConfirm(true)
    }
    const clickOpenFalseConfirm = (event) => {
        setOpenConfirm(false)
    }
    const handleClickSave = () => {
        setOpen(false)
    }
    const handleClickRequest = () => {
        setLoadingButton(true)
        console.log('chay 1')
        const storageRef = ref(storage, `Package/${selectedImage.name}`)
        const uploadTask = uploadBytesResumable(storageRef, selectedImage)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            },
            (error) => {
                alert(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    const body = {
                        name: 'request work time',
                        workslotEmployeeId: workslotEmployeeId,
                        status: 0,
                        reason: reason,
                        linkFile: downloadURL,
                    }
                    dispatch(PostWorkedAsyncApi({ id: employeeId, body: body }))
                        .then((response) => {
                            setLoadingButton(false)
                            console.log('Response', response.meta.requestStatus == 'fulfilled')
                            if (response.meta.requestStatus == 'fulfilled') {
                                setAnchorEl(null)
                                showSnackbar({
                                    severity: 'success',
                                    children: 'Request Successfully',
                                })
                                setChosenFileName('Chosen file')
                                setIsAction(0)
                                setSelectedStartTime()
                                setSelectedEndTime()
                                setworkslotEmployeeId()

                                seterrorImport(false)

                                setReason()
                                setSelectedImage()
                                dispatch(getWorkedByIdAsyncApi(employeeId))
                                SetClick(false)
                            }
                        })
                        .catch((err) => {
                            setLoadingButton(false)
                        })
                })
            }
        )
    }

    const handleClickRequestUpdate = () => {
        console.log('chay 2', click)
        if (click == false) {
            const body = {
                id: requestId,
                name: 'request work time',
                workslotEmployeeId: workslotEmployeeId,
                status: 0,
                reason: reason,
            }
            dispatch(PutWorkedAsyncApi({ id: employeeId, body: body })).then((response) => {
                console.log('Response', response.meta.requestStatus == 'fulfilled')
                if (response.meta.requestStatus == 'fulfilled') {
                    setAnchorEl(null)
                    showSnackbar({
                        severity: 'success',
                        children: 'Request Successfully',
                    })
                    setChosenFileName('Chosen file')
                    setIsAction(0)
                    setSelectedStartTime()
                    setSelectedEndTime()

                    setReason()
                    setSelectedImage()
                    dispatch(getWorkedByIdAsyncApi(employeeId))
                    SetClick(false)
                }
            })
        } else {
            const storageRef = ref(storage, `Package/${selectedImage.name}`)
            const uploadTask = uploadBytesResumable(storageRef, selectedImage)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                },
                (error) => {
                    alert(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        const body = {
                            id: requestId,
                            name: 'request work time',
                            workslotEmployeeId: workslotEmployeeId,
                            status: 0,
                            reason: reason,
                            linkFile: downloadURL,
                        }
                        dispatch(PutWorkedAsyncApi({ id: employeeId, body: body })).then((response) => {
                            console.log('Response', response.meta.requestStatus == 'fulfilled')
                            if (response.meta.requestStatus == 'fulfilled') {
                                setAnchorEl(null)
                                showSnackbar({
                                    severity: 'success',
                                    children: 'Request Successfully',
                                })
                                setChosenFileName('Chosen file')
                                setIsAction(0)
                                setSelectedStartTime()
                                setSelectedEndTime()

                                setReason()
                                setSelectedImage()
                                dispatch(getWorkedByIdAsyncApi(employeeId))
                                SetClick(false)
                            }
                        })
                    })
                }
            )
        }
    }

    const createRows = () => {
        const data = [
            {
                id: '1',
                Date: '2022/06/12',
                timeStart: '8:00',
                timeEnd: '16:00',
                timeLate: '9:00',
                timeEarly: '16:00',
                status: 'Approved',
                reason: 'Làm thêm',
            },
            {
                id: '1',
                Date: '2022/06/12',
                timeStart: '08:00',
                timeEnd: '16:00',
                timeLate: '09:00',
                timeEarly: '16:00',
                status: 'Approved',
                reason: 'Làm thêm',
            },
            {
                id: '1',
                Date: '2022/06/12',
                timeStart: '8:00',
                timeEnd: '16:00',
                timeLate: '9:00',
                timeEarly: '16:00',
                status: 'pending',
                reason: 'Làm thêm',
            },
        ]

        return WorkedByEmployee.map((item, index) => ({
            ...item,
            date: <div className="text-blue-600 font-medium">{formatDate(item.date)}</div>,
            status: <button className="bg-orange-300  font-semibold py-1 px-5 rounded-xl">{item.statusName}</button>,
            number: index + 1,
            action: (
                <div className="flex gap-2 justify-center">
                    <Tooltip onClick={(event) => handleClickOpenUpdate(item, event)} title="Edit">
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip onClick={handleClickOpenConfirm} title="Delete">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        }))
    }
    const rows = createRows()
    console.log('search', search)
    return (
        <div>
            <Navbar />
            <PopupConfirm open={openConfirm} clickOpenFalse={clickOpenFalseConfirm} />
            {openPopover && (
                <Popover
                    id={id}
                    open={openPopover}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <div className="md:flex">
                        <div className="mx-2 flex flex-col items-center justify-center">
                            <div className="mb-2 mt-2 relative">
                                <input
                                    className="hidden w-full" // Ẩn input mặc định
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileInputChange}
                                />
                                <button
                                    onClick={handleBrowseButtonClick}
                                    className="border-[1px] cursor-pointer rounded-md h-10 bg-gray-300 px-4 absolute "
                                >
                                    Browse
                                </button>
                                <div>
                                    <button
                                        onClick={handleBrowseButtonClick}
                                        className="cursor-pointer  block rounded-md h-10 text-left w-[260px] pl-[90px] font-medium text-gray-600  border border-gray-300   bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                        variant="contained"
                                    >
                                        {chosenFileName.length > 16
                                            ? chosenFileName.slice(0, 16).concat('...')
                                            : chosenFileName}
                                    </button>
                                    {error && <div className="text-red-500 w-[260px]">{error}</div>}
                                </div>
                            </div>
                            <div className="mb-2">
                                <TextField
                                    onChange={(e) => setReason(e.target.value)}
                                    label="Reason"
                                    multiline
                                    className="w-[260px]"
                                    rows={3}
                                    value={reason}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <hr />
                        <div className="my-2 float-right mr-4">
                            <LoadingButton
                                startIcon={<AddIcon />}
                                onClick={
                                    isAction == 1 ? handleClickRequest : isAction == 2 ? handleClickRequestUpdate : null
                                }
                                disabled={error || !errorImport}
                                loading={loadingButton}
                                loadingPosition="start"
                                variant="contained"
                                color="primary"
                                sx={{
                                    textAlign: 'center',
                                }}
                                autoFocus
                            >
                                Save changes
                            </LoadingButton>
                        </div>
                    </div>
                </Popover>
            )}
            <div className="sm:ml-64 pt-20 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4"> Worked List </h2>
                    <div className="w-full mb-8 flex font-semibold items-center">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                        <div className="ml-auto uppercase"></div>
                    </div>
                    <div className="bg-white p-4">
                        <div>
                            {loading == true ? (
                                <TableLoadData columns={columns} tableHeight={620} />
                            ) : (
                                <TableData
                                    tableHeight={570}
                                    rows={rows}
                                    columns={columns}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    handleChangePage={handleChangePage}
                                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
