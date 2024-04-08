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
import { addDays, startOfDay, parse, set } from 'date-fns'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import dayjs, { Dayjs } from 'dayjs'

//Firebase
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../../Config/FirebaseConfig'

//Mui
import { styled } from '@mui/system'
import { Popover, Select, Button, Tooltip, IconButton, TextField, DialogActions, FormControl } from '@mui/material'
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
    FormatDateToTime,
    calculateDays,
    calculateTime,
    formatDate,
    formatDateExact,
    formatTimeToDate,
    formattedDate,
    getDateRangeArray,
    getDayOfWeek,
} from '../../../Hook/useFormatDate'
import {
    DeleteOvertimeAsyncApi,
    PostOvertimeAsyncApi,
    PutOvertimeAsyncApi,
    getOvertimeByIdAsyncApi,
} from '../../../Redux/Overtime/OvertimeSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from '../../../Hook/useSnackbar'
import TableLoadData from '../../../Components/TableLoad'
import PopupAlert from '../../../Components/PopupAlert'
import { DatePicker } from '@mui/x-date-pickers'

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
    { id: 'timeStart', label: 'Start Time', maxWidth: 150, align: 'center' },
    { id: 'timeEnd', label: 'End Time', maxWidth: 150, align: 'center' },
    { id: 'time', label: 'Time', maxWidth: 200, align: 'center' },
    { id: 'statusReqeust', label: 'Request Status', minWidth: 100, align: 'center' },
    { id: 'status', label: 'Status', minWidth: 100, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 100, align: 'center' },
]

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Overtime', icon: <BadgeIcon />, url: '/Employee/Overtime', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

export default function Overtime() {
    const [loadingButton, setLoadingButton] = useState(false)
    //popover
    const [anchorEl, setAnchorEl] = React.useState(null)
    const today = new Date()
    const threeDaysLater = addDays(today, 3)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
        setIsAction(1)
        const startTime = formatTimeToDate('18:00')
        const endTime = formatTimeToDate('20:00')

        setSelectedStartTime(startTime)
        setSelectedEndTime(endTime)

        setDate(threeDaysLater)
    }
    const showSnackbar = useSnackbar()
    const [idDelete, setIdDelete] = useState()
    const [errorEdit, SetErrorEdit] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [error, SetError] = useState()
    const [errorImport, seterrorImport] = useState(false)
    const [chosenFileName, setChosenFileName] = useState('Chosen file')
    const fileInputRef = useRef(null)
    const openPopover = Boolean(anchorEl)
    const id = openPopover ? 'simple-popover' : undefined
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [open, setOpen] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [isAction, setIsAction] = useState(0)
    const [search, setSearch] = useState('')
    const [selectedImage, setSelectedImage] = useState()
    const [leaveDays, setLeaveDays] = useState(0)
    const [IdRequest, setIdRequest] = useState()
    const [reason, setReason] = useState('')
    const [leaveDaysDate, setLeaveDaysDate] = useState([])
    const [date, setDate] = useState(null)
    const DaysLater = addDays(today, 2)
    const [click, SetClick] = useState(false)
    console.log('day', leaveDays)
    const [selectedStartTime, setSelectedStartTime] = useState(null)
    const [selectedEndTime, setSelectedEndTime] = useState(null)
    const userStringEmployeeName = localStorage.getItem('employeeId')
    const employeeId = JSON.parse(userStringEmployeeName)
    //setting redux
    const { OvertimeByEmployee, loading } = useSelector((state) => state.overTime)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getOvertimeByIdAsyncApi(employeeId))
        return () => {}
    }, [])
    const handleChangeStartTime = (newTime) => {
        setSelectedStartTime(newTime)
    }
    const handleChangeEndTime = (newTime) => {
        setSelectedEndTime(newTime)
    }

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
    const handleClickOpenAdd = () => {
        setOpen(true)
        setIsAction(1)
    }
    const [selectedDate, setSelectedDate] = useState(today)

    const handleDateChange = (date) => {
        setSelectedDate(date)
    }
    const handleClickOpenUpdate = (data, event) => {
        if (data.statusRequest != 0) {
            SetErrorEdit(true)
        }
        console.log('selectedDate', data.date)
        if (data.date) {
            // Đặt giá trị đã chuyển đổi vào selectedDate
            setSelectedDate(data.date)
        }
        setIdRequest(data.id)
        setAnchorEl(event.currentTarget)
        setOpen(true)
        setIsAction(2)
        const startTime = formatTimeToDate(data.timeStart)
        const endTime = formatTimeToDate(data.timeEnd)
        console.log(1234, startTime, endTime, data.timeLate)
        setSelectedStartTime(startTime)
        setSelectedEndTime(endTime)
        setReason(data.reason)
        setChosenFileName(data.linkFile)
        seterrorImport(true)
        setDate(parse(data.date, 'yyyy/MM/dd', new Date()))
        console.log('data', data)
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
    const handleBrowseButtonClick = () => {
        fileInputRef.current.click()
    }
    const clickOpenFalse = (event) => {
        setOpen(false)
        setIsAction(0)

        setLeaveDays(0)
        setLeaveDaysDate([])
    }
    const handleClickOpenConfirm = (id) => {
        setIdDelete(id)
        setOpenConfirm(true)
    }
    const clickOpenFalseConfirm = (event) => {
        setOpenConfirm(false)
    }
    const handleClickOpenAlert = () => {
        setOpenAlert(true)
    }

    const clickOpenFalseAlert = (event) => {
        setOpenAlert(false)
    }
    const handleClickSave = () => {
        setOpen(false)
    }

    console.log('mn', selectedStartTime)
    const handleRequest = () => {
        console.log('chay new')
        setLoadingButton(true)
        const { format, parse } = require('date-fns')
        // const parsedDate = parse(date, 'dd MMM, yyyy', new Date())
        // const formattedDateStr = format(parsedDate, 'yyyy/MM/dd')
        const newDate = formatDateExact(selectedDate)
        const timeStart = FormatDateToTime(selectedStartTime)
        const endTime = FormatDateToTime(selectedEndTime)
        const storageRef = ref(storage, `Package/${selectedImage.name}`)
        const uploadTask = uploadBytesResumable(storageRef, selectedImage)
        console.log('mnr', formatDateExact(date), selectedStartTime, timeStart)
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
                        name: 'request to OT',
                        date: newDate,
                        timeStart: timeStart,
                        timeEnd: endTime,
                        reason: reason,
                        linkFile: downloadURL,
                        workingStatusId: '959b7066-4d74-11ee-be56-0242ac120002',
                    }
                    dispatch(PostOvertimeAsyncApi({ id: employeeId, body: body }))
                        .then((response) => {
                            console.log('Response', response.meta.requestStatus == 'fulfilled')

                            if (response.meta.requestStatus == 'fulfilled') {
                                setAnchorEl(null)
                                setLoadingButton(false)
                                showSnackbar({
                                    severity: 'success',
                                    children: 'Request Successfully',
                                })
                                setChosenFileName('Chosen file')
                                setIsAction(0)
                                setSelectedStartTime()
                                setSelectedEndTime()
                                setDate()
                                setReason()
                                setSelectedImage()
                                setSelectedDate()
                                dispatch(getOvertimeByIdAsyncApi(employeeId))
                                SetClick(false)
                            }
                            if (response.meta.requestStatus == 'reject') {
                                setLoadingButton(false)
                            }
                        })
                        .catch((err) => {
                            setLoadingButton(false)
                        })
                })
            }
        )
    }
    console.log('selectedDate', selectedDate)
    const handleRequestUpdate = () => {
        console.log('chay update')
        const { format, parse } = require('date-fns')
        // const parsedDate = parse(date, 'dd MMM, yyyy', new Date())
        // const formattedDateStr = format(parsedDate, 'yyyy/MM/dd')
        const newDate = formatDateExact(selectedDate)
        const timeStart = FormatDateToTime(selectedStartTime)
        const endTime = FormatDateToTime(selectedEndTime)
        setLoadingButton(true)

        console.log('mnr', formatDateExact(date), selectedStartTime, timeStart)
        if (click == false) {
            const body = {
                requestId: IdRequest,
                name: 'request to OT',
                date: newDate,
                timeStart: timeStart,
                timeEnd: endTime,
                reason: reason,
                workingStatusId: '959b7066-4d74-11ee-be56-0242ac120002',
            }
            dispatch(PutOvertimeAsyncApi({ id: employeeId, body: body }))
                .then((response) => {
                    console.log('Response', response.meta.requestStatus == 'fulfilled')
                    if (response.meta.requestStatus == 'fulfilled') {
                        setAnchorEl(null)
                        setLoadingButton(false)

                        showSnackbar({
                            severity: 'success',
                            children: 'Update Request Successfully',
                        })
                        setChosenFileName('Chosen file')
                        setIsAction(0)
                        setSelectedStartTime()
                        setSelectedEndTime()
                        setDate()
                        setReason()
                        setSelectedImage()
                        setIdRequest()
                        dispatch(getOvertimeByIdAsyncApi(employeeId))
                    }
                    setLoadingButton(false)
                })
                .catch((err) => {
                    setLoadingButton(false)
                })
        } else if (click == true) {
            setLoadingButton(true)
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
                            requestId: IdRequest,
                            name: 'request to OT',
                            date: newDate,
                            timeStart: timeStart,
                            timeEnd: endTime,
                            reason: reason,
                            linkFile: downloadURL,
                            workingStatusId: '959b7066-4d74-11ee-be56-0242ac120002',
                        }
                        dispatch(PostOvertimeAsyncApi({ id: employeeId, body: body }))
                            .then((response) => {
                                setLoadingButton(false)
                                console.log('Response', response.meta.requestStatus == 'fulfilled')
                                if (response.meta.requestStatus == 'fulfilled') {
                                    setAnchorEl(null)

                                    showSnackbar({
                                        severity: 'success',
                                        children: 'Update Request Successfully',
                                    })
                                    setIdRequest()
                                    setChosenFileName('Chosen file')
                                    setIsAction(0)
                                    setSelectedStartTime()
                                    setSelectedEndTime()
                                    setDate()
                                    setReason()
                                    setSelectedImage()
                                    dispatch(getOvertimeByIdAsyncApi(employeeId))
                                }
                            })
                            .catch((err) => {
                                setLoadingButton(false)
                            })
                    })
                }
            )
        }
    }
    const userId = localStorage.getItem('employeeId')
    const UserParseId = JSON.parse(userId)
    const handleDelete = () => {
        setLoadingButton(true)
        dispatch(DeleteOvertimeAsyncApi({ idDelete, employeeId }))
            .then((response) => {
                if (response.meta.requestStatus == 'fulfilled') {
                    dispatch(getOvertimeByIdAsyncApi(employeeId))
                    showSnackbar({
                        severity: 'success',
                        children: 'Delete request successfully',
                    })
                    setOpenConfirm(false)
                    setLoadingButton(false)
                }
                if (response.meta.requestStatus == 'rejected') {
                    showSnackbar({
                        severity: 'error',
                        children: 'Workslot of dateRange not already',
                    })
                    setOpenConfirm(false)
                    setLoadingButton(false)
                }
            })
            .catch((error) => {
                setLoadingButton(false)
            })
    }
    const handleClose = () => {
        setAnchorEl(null)
        setChosenFileName('Chosen file')
        setIsAction(0)
        setSelectedStartTime()
        setSelectedEndTime()
        setDate()
        setReason()
        setSelectedImage()
        SetErrorEdit(false)
        SetClick(false)
        SetError()
        seterrorImport(false)
    }
    const createRows = () => {
        return OvertimeByEmployee.map((item, index) => ({
            ...item,
            time: calculateTime(item.timeStart, item.timeEnd),
            type: item.leaveType,
            date: <div className="text-blue-600 font-medium">{formatDate(item.date)}</div>,
            day: 1,
            statusReqeust: (
                <button className="bg-orange-300  font-semibold py-1 px-4 rounded-xl">{item.workingStatus}</button>
            ),
            status:
                item.status == 'Approved' ? (
                    <button className="bg-green-500 w-32 text-green-800 font-semibold py-1 px-2 rounded-xl">
                        Approved
                    </button>
                ) : item.status == 'Rejected' ? (
                    <button className="bg-red-500 text-red-800  w-32 font-semibold py-1 px-2 rounded-xl">Reject</button>
                ) : item.status == 'Cancel' ? (
                    <button className="bg-orange-500 text-orange-800  w-32 font-semibold py-1 px-2 rounded-xl">Cancel</button>
                ) : (
                    <button className="bg-yellow-500 text-yellow-800  w-32 font-semibold py-1 px-2 rounded-xl">Pending</button>
                ),
            number: index + 1,
            action: (
                <div className="flex gap-2 justify-center">
                    <Tooltip onClick={(event) => handleClickOpenUpdate(item, event)} title="Edit">
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            onClick={
                                item.statusRequest == 0 ? () => handleClickOpenConfirm(item.id) : handleClickOpenAlert
                            }
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        }))
    }
    const rows = createRows()
    console.log('search', search)
    const minTime = new Date()
    minTime.setHours(17, 30) // 5:30 PM
    const maxTime = new Date()
    maxTime.setHours(22, 30) // 10:30 PM

    console.log('selectedDate', selectedDate)
    const viewModalContent = (
        <Fragment>
            <div className="w-full">
                <div className="mx-2 w-full flex flex-col items-center justify-center">
                    <div className="mb-2 w-full">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    className="w-full"
                                    label={
                                        <span>
                                            Registration Date <span style={{ color: 'red' }}>*</span>
                                        </span>
                                    }
                                    value={dayjs(selectedDate)}
                                    onChange={handleDateChange}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <div className="my-2 text-xs text-gray-400 w-full">
                        <h2>Regulations for registering to work overtime:</h2>
                        <p>-Register in advance or no later than 02 days after the overtime day</p>
                    </div>
                    <div className="mb-2 w-full">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DemoContainer components={['TimePicker']}>
                                <TimePicker
                                    className="w-full"
                                    label={
                                        <span>
                                            Start Time <span style={{ color: 'red' }}>*</span>
                                        </span>
                                    }
                                    slotProps={{ textField: { size: 'small', readOnly: true } }}
                                    value={selectedStartTime}
                                    onChange={handleChangeStartTime}
                                    //minTime={minTime}
                                    //maxTime={selectedEndTime || maxTime} // Để ngăn người dùng chọn thời gian kết thúc trước thời gian bắt đầu
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <div className="mb-2 w-full">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DemoContainer components={['TimePicker']}>
                                <TimePicker
                                    className="w-full"
                                    label={
                                        <span>
                                            End Time <span style={{ color: 'red' }}>*</span>
                                        </span>
                                    }
                                    slotProps={{ textField: { size: 'small', readOnly: true } }}
                                    value={selectedEndTime}
                                    onChange={handleChangeEndTime}
                                    //  minTime={selectedStartTime || minTime} // Để ngăn người dùng chọn thời gian kết thúc trước thời gian bắt đầu
                                    //maxTime={maxTime}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>

                    <div className="my-2 w-full">
                        <div className="mb-1">
                            <strong className=" text-gray-500">
                                Number of hours registered for compensatory leave
                            </strong>{' '}
                        </div>
                        <FormControl fullWidth>
                            <Button
                                disabled
                                className="w-full"
                                variant="contained"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                    textTransform: 'none',
                                    height: '40px',
                                    text: 'black',
                                }}
                            >
                                <span className="text-black">{leaveDays}</span>
                                <span></span>
                            </Button>
                        </FormControl>
                    </div>
                    <div className="my-2 w-full">
                        <div className="mb-1">
                            <strong className=" text-gray-500">Number of hours accumulated during the month</strong>{' '}
                        </div>
                        <FormControl fullWidth>
                            <Button
                                disabled
                                variant="contained"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                    textTransform: 'none',
                                    height: '40px',
                                    text: 'black',
                                }}
                            >
                                <span className="text-black">{leaveDays}</span>
                                <span></span>
                            </Button>
                        </FormControl>
                    </div>
                    <div className="my-2  w-full">
                        <div className="mb-1">
                            <strong className=" text-gray-500">Cumulative number of hours per year</strong>{' '}
                        </div>
                        <FormControl fullWidth>
                            <Button
                                disabled
                                variant="contained"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                    textTransform: 'none',
                                    height: '40px',
                                    text: 'black',
                                }}
                            >
                                <span className="text-black">{leaveDays}</span>
                                <span></span>
                            </Button>
                        </FormControl>
                    </div>
                    <div className="mb-2 w-full">
                        <TextField
                            onChange={(e) => setReason(e.target.value)}
                            label={
                                <span>
                                    Reason <span style={{ color: 'red' }}>*</span>
                                </span>
                            }
                            multiline
                            className="w-full"
                            rows={3}
                            value={reason}
                        />
                    </div>
                    <div className="mb-2 relative w-full">
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
                                className="cursor-pointer w-full  block rounded-md h-10 text-left  pl-[90px] font-medium text-gray-600  border border-gray-300   bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                variant="contained"
                            >
                                {chosenFileName.length > 20
                                    ? chosenFileName.slice(0, 20).concat('...')
                                    : chosenFileName}
                            </button>
                            {error && <div className="text-red-500 ">{error}</div>}
                            {isAction == 2 && (
                                <a
                                    className="mt-2 text-blue-400 underline"
                                    href={chosenFileName}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Link
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="">
                <hr />
                <DialogActions>
                    <div className=" float-right">
                        <LoadingButton
                            onClick={() =>
                                isAction == 1 ? handleRequest() : isAction == 2 ? handleRequestUpdate() : null
                            }
                            startIcon={<AddIcon />}
                            disabled={error || !errorImport || errorEdit}
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
                </DialogActions>
            </div>
        </Fragment>
    )

    return (
        <div>
            <Navbar />
            <PopupConfirm open={openConfirm} clickOpenFalse={clickOpenFalseConfirm} clickDelete={handleDelete} />
            <PopupAlert open={openAlert} clickOpenFalse={clickOpenFalseAlert} />
            <PopupData
                open={openPopover}
                clickOpenFalse={handleClose}
                viewTitle={isAction == 1 ? 'Apply Overtime' : isAction == 2 ? 'Edit Overtime' : ''}
                viewContent={viewModalContent}
                size="sm"
            />
            {/* {openPopover && (
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
                    
                </Popover>
            )} */}
            <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4"> Request Overtime List </h2>
                    <div className="w-full mb-8 flex font-semibold items-center">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                        <div className="ml-auto uppercase">
                            <Button
                                onClick={handleClick}
                                startIcon={<AddIcon />}
                                variant="contained"
                                color="primary"
                                className=""
                            >
                                Add New
                            </Button>
                        </div>
                    </div>
                    <div className="bg-white p-4">
                        <div>
                            {loading == true ? (
                                <TableLoadData columns={columns} tableHeight={480} />
                            ) : (
                                <TableData
                                    tableHeight={470}
                                    rowsPerPageOptions={[5, 25, 50]}
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
