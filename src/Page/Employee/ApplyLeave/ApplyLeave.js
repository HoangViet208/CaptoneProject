import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

//date-picker-range
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import './DateRangePickerCustomStyles.css'
import { addDays, startOfDay, parse, set } from 'date-fns'
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
import DoneIcon from '@mui/icons-material/Done'
import PersonIcon from '@mui/icons-material/Person'
//Component
import TableData from '../../../Components/Table'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import PopupData from '../../../Components/Popup'
import PopupConfirm from '../../../Components/PopupConfirm'
import Navbar from '../Navbar'

//hooks
import {
    calculateDays,
    formatDate,
    formattedDate,
    getDateRangeArray,
    getDayOfWeek,
    isNonWorkingDay,
} from '../../../Hook/useFormatDate'
import { useDispatch, useSelector } from 'react-redux'
import {
    GetApplyLeaveTypeAsyncApi,
    GetWorkDateSettingByIdAsyncApi,
    PostApplyLeaveAsyncApi,
    PutApplyLeaveAsyncApi,
    getApplyLeaveByIdAsyncApi,
} from '../../../Redux/ApplyLeave/ApplyLeaveSlice'
import TableLoadData from '../../../Components/TableLoad'
import { useSnackbar } from '../../../Hook/useSnackbar'
import PopupAlert from '../../../Components/PopupAlert'

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
    { id: 'date', label: 'Date', minWidth: 200, align: 'left' },
    { id: 'day', label: 'Day', maxWidth: 100, align: 'right' },
    { id: 'type', label: 'Leave Type', minWidth: 150, align: 'left' },
    { id: 'status', label: 'Status', minWidth: 150, align: 'center' },
    { id: 'reason', label: 'Reason', minWidth: 150, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 100, align: 'center' },
]

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/Employee/Dashboard', status: true },
        { title: 'Apply Leave', icon: <BadgeIcon />, url: '/Employee/ApplyLeave', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

export default function ApplyLeave() {
    const [loadingButton, setLoadingButton] = useState(false)
    //popover
    const [anchorEl, setAnchorEl] = React.useState(null)
    const showSnackbar = useSnackbar()
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }
    const [errorEdit, SetErrorEdit] = useState(false)
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
    const [openAlert, setOpenAlert] = useState(false)
    const [isAction, setIsAction] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedImage, setSelectedImage] = useState()
    const [click, SetClick] = useState(false)
    const [leaveErorr, setLeaveErorr] = useState()
    const [leaveDays, setLeaveDays] = useState(0)
    const [leaveDaysDate, setLeaveDaysDate] = useState([])
    const today = new Date()
    const threeDaysLater = addDays(today, 3)
    const [RequestId, setRequestId] = useState()
    const userStringEmployeeName = localStorage.getItem('employeeId')
    const employeeId = JSON.parse(userStringEmployeeName)
    const listDayOff = {
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: false,
        Friday: true,
        Saturday: false,
        Sunday: false,
    }
    const [dateRange, setDateRange] = useState([
        {
            startDate: threeDaysLater,
            endDate: threeDaysLater,
            key: 'selection',
        },
    ])
    //setting redux
    const { ApplyLeaveByEmployee, ApplyLeaveTypeList, WorkSetting, loading } = useSelector((state) => state.applyLeave)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(GetWorkDateSettingByIdAsyncApi(employeeId))
        dispatch(getApplyLeaveByIdAsyncApi(employeeId))
        dispatch(GetApplyLeaveTypeAsyncApi())
        return () => {}
    }, [])
    const minDate = startOfDay(threeDaysLater)
    const initialValues = {
        leaveReason: '',
        leaveType: '',
        leaveDate: '',
        Substitute: '',
    }
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            leaveReason: Yup.string().required(),
            leaveType: Yup.string().required(),
        }),
        onSubmit: (values) => {
            console.log('chay', click)
            setIsLoading(true)

            if (click == true) {
                const { format, parse } = require('date-fns')
                let transformedDates = leaveDaysDate.map((date) => {
                    if (date.type !== 'nonWorkingDay') {
                        // Biến đổi title thành định dạng "YYYY/MM/DD"
                        const parsedDate = parse(date.title, 'dd MMM, yyyy', new Date())
                        const formattedDateStr = format(parsedDate, 'yyyy/MM/dd')

                        return {
                            title: formattedDateStr,
                            type: date.type,
                        }
                    } else {
                        return date // Giữ nguyên các mục có type là 'nonWorkingDay'
                    }
                })
                // Lọc bỏ các mục có type là 'nonWorkingDay'
                transformedDates = transformedDates.filter((date) => date.type !== 'nonWorkingDay')
                const startDateStr = format(dateRange[0].startDate, 'yyyy/MM/dd')
                const endDateStr = format(dateRange[0].endDate, 'yyyy/MM/dd')
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
                            const data = {
                                Name: 'Request Leave Of Employee',
                                startDate: startDateStr,
                                endDate: endDateStr,
                                leaveTypeId: values.leaveType,
                                reason: values.leaveReason,
                                linkFile: downloadURL,
                                dateRange: transformedDates,
                            }
                            const Updatedata = {
                                id: RequestId,
                                startDate: startDateStr,
                                endDate: endDateStr,
                                leaveTypeId: values.leaveType,
                                reason: values.leaveReason,
                                linkFile: downloadURL,
                                dateRange: transformedDates,
                            }
                            console.log('thanh cong', data, isAction)
                            if (isAction == 1) {
                                dispatch(PostApplyLeaveAsyncApi({ id: employeeId, body: data }))
                                    .then((response) => {
                                        console.log('Response', response.meta.requestStatus == 'fulfilled')
                                        if (response.meta.requestStatus == 'fulfilled') {
                                            setSelectedImage()
                                            setIsLoading(false)
                                            showSnackbar({
                                                severity: 'success',
                                                children: 'Request Successfully',
                                            })
                                            setOpen(false)
                                            setIsAction(0)
                                            formik.setTouched({})
                                            SetClick(false)
                                            formik.setErrors({})
                                            setChosenFileName('Chosen file')
                                            formik.setValues({
                                                leaveReason: '',
                                                leaveType: '',
                                                leaveDate: '',
                                            })
                                            setDateRange([
                                                {
                                                    startDate: threeDaysLater,
                                                    endDate: threeDaysLater,
                                                    key: 'selection',
                                                },
                                            ])
                                            setLeaveDays(0)
                                            setLeaveDaysDate([])
                                            dispatch(getApplyLeaveByIdAsyncApi(employeeId))
                                        }
                                        setIsLoading(false)
                                    })
                                    .catch((error) => {
                                        // Xử lý lỗi ở đây
                                        setIsLoading(false)
                                        console.error('Lỗi API:', error)
                                    })
                            } else if (isAction == 2) {
                                dispatch(PutApplyLeaveAsyncApi({ id: employeeId, body: Updatedata }))
                                    .then((response) => {
                                        if (response.meta.requestStatus == 'fulfilled') {
                                            setRequestId()
                                            showSnackbar({
                                                severity: 'success',
                                                children: 'Request Successfully',
                                            })
                                            setOpen(false)
                                            setIsAction(0)
                                            SetClick(false)
                                            formik.setTouched({})
                                            formik.setErrors({})
                                            setChosenFileName('Chosen file')
                                            formik.setValues({
                                                leaveReason: '',
                                                leaveType: '',
                                                leaveDate: '',
                                            })
                                            setSelectedImage()
                                            setDateRange([
                                                {
                                                    startDate: threeDaysLater,
                                                    endDate: threeDaysLater,
                                                    key: 'selection',
                                                },
                                            ])
                                            setLeaveDays(0)
                                            setLeaveDaysDate([])
                                            dispatch(getApplyLeaveByIdAsyncApi(employeeId))
                                        }
                                        setIsLoading(false)
                                    })
                                    .catch((error) => {
                                        setIsLoading(false)
                                        console.error('Lỗi API:', error)
                                    })
                            }
                        })
                    }
                )
            } else {
                console.log('chay1')
                setIsLoading(true)
                const { format, parse } = require('date-fns')
                let transformedDates = leaveDaysDate.map((date) => {
                    if (date.type !== 'nonWorkingDay') {
                        // Biến đổi title thành định dạng "YYYY/MM/DD"
                        const parsedDate = parse(date.title, 'dd MMM, yyyy', new Date())
                        const formattedDateStr = format(parsedDate, 'yyyy/MM/dd')

                        return {
                            title: formattedDateStr,
                            type: date.type,
                        }
                    } else {
                        return date // Giữ nguyên các mục có type là 'nonWorkingDay'
                    }
                })
                // Lọc bỏ các mục có type là 'nonWorkingDay'
                transformedDates = transformedDates.filter((date) => date.type !== 'nonWorkingDay')
                const startDateStr = format(dateRange[0].startDate, 'yyyy/MM/dd')
                const endDateStr = format(dateRange[0].endDate, 'yyyy/MM/dd')
                const Updatedata = {
                    id: RequestId,
                    startDate: startDateStr,
                    endDate: endDateStr,
                    leaveTypeId: values.leaveType,
                    reason: values.leaveReason,
                    dateRange: transformedDates,
                }
                dispatch(PutApplyLeaveAsyncApi({ id: employeeId, body: Updatedata }))
                    .then((response) => {
                        if (response.meta.requestStatus == 'fulfilled') {
                            setRequestId()

                            showSnackbar({
                                severity: 'success',
                                children: 'Request Successfully',
                            })
                            setOpen(false)
                            setIsAction(0)
                            SetClick(false)
                            formik.setTouched({})
                            formik.setErrors({})
                            setChosenFileName('Chosen file')
                            formik.setValues({
                                leaveReason: '',
                                leaveType: '',
                                leaveDate: '',
                            })
                            setSelectedImage()
                            setDateRange([
                                {
                                    startDate: threeDaysLater,
                                    endDate: threeDaysLater,
                                    key: 'selection',
                                },
                            ])
                            setLeaveDays(0)
                            setLeaveDaysDate([])
                            dispatch(getApplyLeaveByIdAsyncApi(employeeId))
                        }
                        setIsLoading(false)
                    })
                    .catch((error) => {
                        setIsLoading(false)
                        console.error('Lỗi API:', error)
                    })
            }
        },
    })

    const handleDateChange = (ranges) => {
        setDateRange([ranges.selection])
        setLeaveErorr()
        if (ranges.selection.startDate && ranges.selection.endDate) {
            const newDate = []
            const daysToAdd = calculateDays(ranges.selection.startDate, ranges.selection.endDate)
            const dateArray = getDateRangeArray(ranges.selection.startDate, ranges.selection.endDate)
            const RuleDay = calculateDays(today, ranges.selection.startDate)
            console.log('ngu', daysToAdd, RuleDay, RuleDay > 2, RuleDay < 5, daysToAdd <= 3)
            if (RuleDay > 2 && RuleDay < 5 && daysToAdd > 3) {
                setLeaveErorr('đăng ký trước 2 ngày với đơn nghỉ dưới 3 ngày')
            }
            if (RuleDay > 3 && RuleDay < 7 && daysToAdd > 7) {
                setLeaveErorr('trước 5 ngày vs đơn từ 3-7 ngày')
            }
            if (RuleDay < 10 && daysToAdd > 7) {
                setLeaveErorr('trước 5 ngày vs đơn từ 3-7 ngày')
            } else {
                for (let i = 0; i < daysToAdd; i++) {
                    console.log(
                        'hikika',
                        dateArray[i],
                        WorkSetting.dateStatus,
                        isNonWorkingDay(dateArray[i], WorkSetting.dateStatus)
                    )
                    newDate.push({
                        title: dateArray[i],
                        type:
                            isNonWorkingDay(dateArray[i], WorkSetting.dateStatus) == false
                                ? 'nonWorkingDay'
                                : 'Full Day',
                    })
                }
                setLeaveDaysDate(newDate)
                setLeaveDays(calculateDays(ranges.selection.startDate, ranges.selection.endDate))
            }
        }
    }
    console.log('day', leaveDays, formik.values, ApplyLeaveByEmployee.length)
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
    const handleClickOpenUpdate = (data) => {
        if (data.status != 0) {
            SetErrorEdit(true)
        }
        setOpen(true)
        setRequestId(data.id)

        setIsAction(2)
        console.log('data', data.startDate, parse(data.startDate, 'dd/MM/yyyy', new Date()))
        const newDate = data.dateRange.map((item, index) => ({
            title: formatDate(item.title),
            type: item.type,
        }))
        setLeaveDaysDate(newDate)
        setLeaveDays(data.dateRange.length)
        setChosenFileName(data.linkFile)
        seterrorImport(true)
        setDateRange([
            {
                startDate: parse(data.startDate, 'yyyy/MM/dd', new Date()),
                endDate: parse(data.endDate, 'yyyy/MM/dd', new Date()),
                key: 'selection',
            },
        ])
        formik.setValues({
            leaveReason: data.reason,
            leaveType: data.leaveTypeId,
            leaveDate: '',
        })
    }
    const handleFileInputChange = (event) => {
        event.preventDefault()
        const selectedFile = event.target.files[0]
        seterrorImport(false)
        SetClick(true)
        setSelectedImage(event.target.files[0])
        SetError()
        if (selectedFile) {
            setChosenFileName(selectedFile.name)
            seterrorImport(true)
        }
    }
    const handleBrowseButtonClick = (event) => {
        event.preventDefault()
        fileInputRef.current.click()
    }
    const clickOpenFalse = (event) => {
        SetErrorEdit(false)
        setOpen(false)
        setRequestId()
        setIsAction(0)
        setSelectedImage()
        seterrorImport(false)
        formik.setTouched({})
        formik.setErrors({})
        setChosenFileName('Chosen file')
        formik.setValues({
            leaveReason: '',
            leaveType: '',
            leaveDate: '',
        })
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
    const handleClickOpenAlert = () => {
        setOpenAlert(true)
    }
    const clickOpenFalseConfirm = (event) => {
        setOpenConfirm(false)
    }
    const clickOpenFalseAlert = (event) => {
        setOpenAlert(false)
    }

    const handleClickSave = () => {
        setOpen(false)
    }
    const viewModalContent = (
        <Fragment>
            <form onSubmit={formik.handleSubmit}>
                <div className="grida md:grid-cols-2 gap-5 py-4 px-8 mb-5 lg:my-0">
                    <div>
                        <div className="my-2">
                            <div className="mb-1">
                                <strong className=" text-gray-500">Leave Type</strong> <i className="text-red-500">*</i>
                            </div>
                            <FormControl fullWidth>
                                <Select
                                    id="outlined-basic"
                                    size="small"
                                    type="date"
                                    error={formik.touched.leaveType && formik.errors.leaveType ? true : undefined}
                                    onChange={formik.handleChange}
                                    className="mt-2 w-full"
                                    value={formik.values.leaveType}
                                    name="leaveType"
                                    variant="outlined"
                                >
                                    {ApplyLeaveTypeList.map((item, index) => {
                                        return (
                                            <MenuItem key={index} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            {formik.errors.leaveType && formik.touched.leaveType && (
                                <div className="text mt-1 text-red-600 font-semibold">{formik.errors.leaveType}</div>
                            )}
                        </div>
                        <div className="my-2">
                            <div className="mb-1">
                                <strong className=" text-gray-500">Leave Dates</strong>{' '}
                                <i className="text-red-500">*</i>
                            </div>
                            <div>
                                <OutlinedInput
                                    type="text"
                                    aria-describedby={id}
                                    placeholder="Select Date Range"
                                    size="small"
                                    fullWidth
                                    onClick={handleClick}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" edge="end">
                                                <EventNoteIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    value={
                                        formattedDate(dateRange[0].startDate) +
                                        ' - ' +
                                        formattedDate(dateRange[0].endDate)
                                    }
                                    readOnly
                                />

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
                                        <DateRange
                                            ranges={dateRange}
                                            onChange={handleDateChange}
                                            showSelectionPreview={false} // Ẩn chức năng filter
                                            editableDateInputs={true} // Cho phép người dùng nhập trực tiếp ngày
                                            moveRangeOnFirstSelection={false} // Không di chuyển khoảng ngày khi chọn ngày đầu tiên
                                            minDate={minDate}
                                        />
                                    </Popover>
                                )}
                            </div>
                        </div>
                        <div className="my-2 text-xs text-gray-400 ">
                            <h2>Leave regulations</h2>
                            <p>-Register 2 working days in advance if the leave application is less than 3 days</p>
                            <p>-Register 5 working days in advance if the leave application is from 3 to 7 days</p>
                            <p>-Register 10 working days in advance if the leave application is 7 days or more</p>
                        </div>
                        <div className="bg-blue-100 relative">
                            <h2 className="font-medium m-4 text-lg text-gray-500">Your Leave Details</h2>
                            <div className="h-[280px]  px-4  overflow-auto">
                                {leaveErorr ? (
                                    <div className="text-red-500 text-center">{leaveErorr}</div>
                                ) : leaveDaysDate.length < 1 ? (
                                    <div className="text-center  text-gray-400">Yet to select dates</div>
                                ) : (
                                    leaveDaysDate.map((item, index) => {
                                        return (
                                            <div key={index} className="flex mb-5  items-center">
                                                <div className="font-bold">
                                                    {item.title}{' '}
                                                    <strong className="font-semibold text-gray-500">
                                                        ({getDayOfWeek(item.title)}){' '}
                                                    </strong>
                                                </div>
                                                <div className="flex gap-3 text-blue-400 font-bold ml-auto">
                                                    {item.type == 'nonWorkingDay' ? (
                                                        <strong className="font-semibold text-gray-500">
                                                            Non Working days
                                                        </strong>
                                                    ) : (
                                                        <CustomSelect
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            className="outline-none text-blue-400"
                                                            variant="standard"
                                                            value={item.type}
                                                            onChange={(e) => {
                                                                const updatedDataList = [...leaveDaysDate]
                                                                updatedDataList[index].type = e.target.value
                                                                setLeaveDaysDate(updatedDataList)
                                                            }}
                                                        >
                                                            <MenuItem value={'Full Day'}>Full Day</MenuItem>
                                                            <MenuItem value={'Morning'}>Morning</MenuItem>
                                                            <MenuItem value={'Afternoon'}>Afternoon</MenuItem>
                                                        </CustomSelect>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>

                        {/* <div className="absolute font-medium text-gray-500 bottom-0 p-4 text-lg  w-full flex ">
                            <div>Total Leave</div>
                            <div className="ml-auto">{leaveDays}</div>
                        </div> */}
                        <div className="my-2">
                            <Button
                                startIcon={<AddIcon />}
                                type="submit"
                                loadingPosition="start"
                                variant="contained"
                                color="error"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                <span>Manage Leave</span>
                                <span></span>
                            </Button>
                        </div>

                        <div className="my-2">
                            <div className="mb-1">
                                <strong className=" text-gray-500">Manager Approve</strong>{' '}
                            </div>
                            <FormControl fullWidth>
                                <Button
                                    disabled
                                    endIcon={<DoneIcon color="success" />}
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
                                    <span className="text-black">Manage Leave</span>
                                    <span></span>
                                </Button>
                            </FormControl>
                        </div>
                        <div className="my-2">
                            <div className="mb-1">
                                <strong className=" text-gray-500">Total Leave</strong>{' '}
                            </div>
                            <FormControl fullWidth>
                                <Button
                                    disabled
                                    endIcon={<DoneIcon color="success" />}
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

                        <div className="my-2">
                            <div className="mb-1">
                                <strong className=" text-gray-500">Substitute support staff</strong>{' '}
                            </div>
                            <FormControl fullWidth>
                                <Select
                                    id="outlined-basic"
                                    size="small"
                                    error={formik.touched.Substitute && formik.errors.Substitute ? true : undefined}
                                    onChange={formik.handleChange}
                                    className="mt-2 w-full"
                                    value={formik.values.Substitute}
                                    name="Substitute"
                                    variant="outlined"
                                    IconComponent={() => (
                                        <PersonIcon className='mr-3' />
                                      )}
                                >
                                    {ApplyLeaveTypeList.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="my-2">
                            <div className="mb-1">
                                <strong className=" text-gray-500">Leave Reason</strong>{' '}
                                <i className="text-red-500">*</i>
                            </div>
                            <FormControl fullWidth>
                                <TextField
                                    multiline
                                    rows={6}
                                    id="outlined-basic"
                                    size="small"
                                    error={formik.touched.leaveReason && formik.errors.leaveReason ? true : undefined}
                                    onChange={formik.handleChange}
                                    className="mt-2 w-full"
                                    value={formik.values.leaveReason}
                                    name="leaveReason"
                                    variant="outlined"
                                />
                            </FormControl>
                            {formik.errors.leaveReason && formik.touched.leaveReason && (
                                <div className="text mt-1 text-red-600 font-semibold">{formik.errors.leaveReason}</div>
                            )}
                        </div>
                        <div className="my-2 relative">
                            <div className="mb-1">
                                <strong className=" text-gray-500">Chosen File</strong>{' '}
                                <i className="text-red-500">*</i>
                            </div>
                            <input
                                className="hidden w-full" // Ẩn input mặc định
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileInputChange}
                            />
                            <button
                                onClick={(e) => handleBrowseButtonClick(e)}
                                className="border-[1px] cursor-pointer rounded-md h-10 bg-gray-300 px-4 absolute "
                            >
                                Browse
                            </button>
                            <div>
                                <button
                                    onClick={(e) => handleBrowseButtonClick(e)}
                                    className="cursor-pointer  block rounded-md h-10 text-left w-full pl-[90px] font-medium text-gray-600  border border-gray-300   bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                    variant="contained"
                                >
                                    {chosenFileName.length > 16
                                        ? chosenFileName.slice(0, 16).concat('...')
                                        : chosenFileName}
                                </button>
                                {error && <div className="text-red-500 w-full">{error}</div>}
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

                <DialogActions>
                    <div className="flex gap-5">
                        <Button variant="contained" color="inherit" autoFocus onClick={clickOpenFalse}>
                            Cancel
                        </Button>
                        <LoadingButton
                            startIcon={<AddIcon />}
                            disabled={error || !errorImport || errorEdit}
                            type="submit"
                            loading={isLoading}
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
            </form>
        </Fragment>
    )

    const createRows = () => {
        const data = [
            {
                id: '1',
                startDate: '2022/06/12',
                endDate: '2022/07/10',
                leaveType: 'Sick Leave',
                status: 'Approved',
                reason: 'nghỉ ốm',
                dateRange: [
                    { title: '15 Sep', type: 'Full Day' },
                    { title: '16 Sep', type: 'Full Day' },
                    { title: '17 Sep', type: 'Full Day' },
                ],
            },
            {
                id: '2',
                startDate: '2022/09/08',
                endDate: '2022/09/12',
                leaveType: 'Casual Leave',
                status: 'Reject',
                reason: 'nghỉ phép',
                dateRange: [
                    { title: '15 Sep', type: 'Full Day' },
                    { title: '16 Sep', type: 'Full Day' },
                    { title: '17 Sep', type: 'Full Day' },
                ],
            },
            {
                id: '3',
                startDate: '2022/11/12',
                endDate: '2022/11/14',
                leaveType: 'Sick Leave',
                status: 'Pending',
                reason: 'nghỉ ốm',
                dateRange: [
                    { title: '15 Sep', type: 'Full Day' },
                    { title: '16 Sep', type: 'Full Day' },
                    { title: '17 Sep', type: 'Full Day' },
                ],
            },
        ]

        return ApplyLeaveByEmployee.map((item, index) => ({
            ...item,

            type: item.leaveType,
            date: (
                <div className="text-blue-600 font-medium">
                    {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
                </div>
            ),
            day: item.dateRange.length,
            status:
                item.status == 1 ? (
                    <button className="bg-green-300 w-24 text-green-700 font-semibold py-1 px-2 rounded-xl">
                        Approved
                    </button>
                ) : item.status == 2 ? (
                    <button className="bg-red-300 text-red-700  w-24 font-semibold py-1 px-2 rounded-xl">Reject</button>
                ) : (
                    <button className="bg-orange-300 text-orange-700 w-24 font-semibold py-1 px-2 rounded-xl">
                        Pending
                    </button>
                ),
            number: index + 1,
            action: (
                <div className="flex gap-2 justify-center">
                    <Tooltip title="Edit">
                        <IconButton onClick={() => handleClickOpenUpdate(item)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={item.status == 0 ? handleClickOpenConfirm : handleClickOpenAlert}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        }))
    }
    const rows = createRows()
    console.log('search', dateRange)
    return (
        <div>
            <Navbar />
            <PopupConfirm open={openConfirm} clickOpenFalse={clickOpenFalseConfirm} />
            <PopupAlert open={openAlert} clickOpenFalse={clickOpenFalseAlert} />
            <PopupData
                open={open}
                clickOpenFalse={clickOpenFalse}
                viewTitle={isAction == 1 ? 'Apply Leave' : isAction == 2 ? 'Edit Leave' : ''}
                viewContent={viewModalContent}
                size="md"
            />
            <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4"> Apply Leave List </h2>
                    <div className="w-full mb-8 flex font-semibold items-center">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                        <div className="ml-auto uppercase">
                            <Button
                                onClick={handleClickOpenAdd}
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
