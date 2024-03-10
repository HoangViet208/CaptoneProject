import React, { Fragment, useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { NavLink } from 'react-router-dom'

//Mui
import { Avatar } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { LoadingButton } from '@mui/lab'
import { addDays, startOfDay, parse, set } from 'date-fns'
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
//Icon
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import FilterListIcon from '@mui/icons-material/FilterList'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EventNoteIcon from '@mui/icons-material/EventNote'
//Component
import Search from '../../../Components/Search'
import TableData from '../../../Components/Table'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import TabsData from '../../../Components/Tabs'
import PopupConfirm from '../../../Components/PopupConfirm'

//hooks
import { calculateDays, formatDate, formattedDate, getDayOfWeek } from '../../../Hook/useFormatDate'
import {
    GetApplyLeaveByRequestIdAsyncApi,
    GetApplyLeaveTypeAsyncApi,
    PutApplyLeaveAsyncApi,
    PutApproveApplyLeaveAsyncApi,
    getApplyLeaveAsyncApi,
} from '../../../Redux/ApplyLeave/ApplyLeaveSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from '../../../Hook/useSnackbar'
import NavbarHR from '../NavbarHR'
import TableLoadData from '../../../Components/TableLoad'
import { useFormik } from 'formik'
import PopupData from '../../../Components/Popup'
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
const columnsPending = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Employee Name', minWidth: 250, align: 'left' },
    { id: 'leavePeriod', label: 'Leave Period', minWidth: 250, align: 'left' },
    { id: 'days', label: 'Days', minWidth: 100, align: 'center' },
    { id: 'type', label: 'Type', minWidth: 100, align: 'left' },
    { id: 'applied', label: 'Applied On', minWidth: 50, align: 'center' },
    { id: 'reason', label: 'Reason', minWidth: 50, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 50, maxWidth: 50, align: 'left' },
]

const columnsApprove = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Employee Name', minWidth: 250, align: 'left' },
    { id: 'leavePeriod', label: 'Leave Period', minWidth: 250, align: 'left' },
    { id: 'days', label: 'Days', minWidth: 100, align: 'center' },

    { id: 'type', label: 'Type', minWidth: 100, align: 'center' },
    { id: 'reason', label: 'Reason', minWidth: 50, align: 'center' },
]
const columnsReject = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Employee Name', minWidth: 250, align: 'left' },
    { id: 'leavePeriod', label: 'Leave Period', minWidth: 250, align: 'left' },
    { id: 'days', label: 'Days', minWidth: 100, align: 'left' },

    { id: 'type', label: 'Type', minWidth: 100, align: 'left' },
    { id: 'reason', label: 'Reason', minWidth: 50, align: 'center' },
]
const columnsAll = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Employee Name', minWidth: 250, align: 'left' },
    { id: 'leavePeriod', label: 'Leave Period', minWidth: 250, align: 'left' },
    { id: 'days', label: 'Days', minWidth: 100, align: 'center' },

    { id: 'type', label: 'Type', minWidth: 100, align: 'left' },

    { id: 'status', label: 'Status', minWidth: 50, align: 'left' },
    { id: 'reason', label: 'Reason', minWidth: 50, align: 'center' },
    { id: 'actionAll', label: 'Actions', minWidth: 50, maxWidth: 50, align: 'left' },
]

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Manage Leave', icon: <BadgeIcon />, url: '/ManageLeave', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

export default function ManageLeave() {
    const [loadingButton, setLoadingButton] = useState(false)
    const [loadingRJButton, setLoadingRJButton] = useState(false)
    const [open, setOpen] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [page, setPage] = useState(0)
    const showSnackbar = useSnackbar()
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState('')
    const [requestId, setRequestId] = useState()
    const [status, setStatus] = useState(-1)
    const userStringEmployeeName = localStorage.getItem('employeeId')
    const employeeId = JSON.parse(userStringEmployeeName)
    const handleChangePage = (newPage) => {
        setPage(newPage)
    }
    //setting redux
    const { ApplyLeaveList, ApplyLeaveTypeList, valueTabs, loading } = useSelector((state) => state.applyLeave)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(GetApplyLeaveTypeAsyncApi())
        dispatch(getApplyLeaveAsyncApi({ name: search, status: valueTabs == 3 ? -1 : valueTabs }))
        return () => {}
    }, [search, valueTabs])

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

    const searchData = (data) => {
        return (
            <div className="p-4">
                <div className="mb-5 flex items-center">
                    <Search parentCallback={callbackSearch} />
                    <div className="ml-auto md:mr-4 mr-4"></div>
                </div>
                {data}
            </div>
        )
    }

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ])
    const [userRole, setUserRole] = useState(() => {
        const userString = localStorage.getItem('role');
        const userObject = JSON.parse(userString);
        return userObject || 'defaultRole'; // Provide a default role if undefined
      });
    
      useEffect(() => {
        // Update the userRole state whenever 'role' is changed in localStorage
        const handleStorageChange = () => {
          const userString = localStorage.getItem('role');
          const userObject = JSON.parse(userString);
          setUserRole(userObject || 'defaultRole');
        };
    
        window.addEventListener('storage', handleStorageChange);
    
        return () => {
          window.removeEventListener('storage', handleStorageChange);
        };
      }, []);
    const [isLoading, setIsLoading] = useState(false)
    const [leaveDays, setLeaveDays] = useState(0)
    const [leaveDaysDate, setLeaveDaysDate] = useState([])
    const [chosenFileName, setChosenFileName] = useState('Chosen file')
    const initialValues = {
        leaveReason: '',
        leaveType: '',
        leaveDate: '',
    }
    const formik = useFormik({
        initialValues: initialValues,
    })
    const handleClickOpenUpdate = (data) => {
        dispatch(GetApplyLeaveByRequestIdAsyncApi(data.id)).then((res) => {
            if (res.meta.requestStatus == 'fulfilled') {
                const newDate = res.payload.dateRange.map((item, index) => ({
                    title: formatDate(item.title),
                    type: item.type,
                }))
                setLeaveDaysDate(newDate)
                setLeaveDays(res.payload.dateRange.length)
                setChosenFileName(res.payload.linkFile)
                setRequestId(res.payload.id)
                setDateRange([
                    {
                        startDate: parse(res.payload.startDate, 'yyyy/MM/dd', new Date()),
                        endDate: parse(res.payload.endDate, 'yyyy/MM/dd', new Date()),
                        key: 'selection',
                    },
                ])
                formik.setValues({
                    leaveReason: res.payload.reason,
                    leaveType: res.payload.leaveTypeId,
                    leaveDate: '',
                })
            }
        })
        setOpenModal(true)
    }
    const clickOpenFalseModal = (event) => {
        setOpenModal(false)
        setRequestId()
        setChosenFileName('Chosen file')
        formik.setValues({
            leaveReason: '',
            leaveType: '',
            leaveDate: '',
        })
        setDateRange([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection',
            },
        ])
        setLeaveDays(0)
        setLeaveDaysDate([])
    }
    const handleClickApprove = () => {
        setLoadingButton(true)

        dispatch(PutApproveApplyLeaveAsyncApi(requestId))
            .then((response) => {
                setLoadingButton(false)
                if (response.meta.requestStatus == 'fulfilled') {
                    dispatch(getApplyLeaveAsyncApi({ name: search, status: valueTabs == 3 ? -1 : valueTabs }))
                    showSnackbar({
                        severity: 'success',
                        children: 'Approved request',
                    })
                    setOpenModal(false)
                    setRequestId()
                    setChosenFileName('Chosen file')
                    formik.setValues({
                        leaveReason: '',
                        leaveType: '',
                        leaveDate: '',
                    })
                    setDateRange([
                        {
                            startDate: new Date(),
                            endDate: new Date(),
                            key: 'selection',
                        },
                    ])
                    setLeaveDays(0)
                    setLeaveDaysDate([])
                }
            })
            .catch((error) => {
                setLoadingButton(false)
            })
    }
    const handleClickReject = () => {
        setLoadingRJButton(true)
        const Updatedata = {
            id: requestId,
            status: 2,
        }
        dispatch(PutApplyLeaveAsyncApi({ id: employeeId, body: Updatedata }))
            .then((response) => {
                if (response.meta.requestStatus == 'fulfilled') {
                    setLoadingRJButton(false)
                    dispatch(getApplyLeaveAsyncApi({ name: search, status: valueTabs == 3 ? -1 : valueTabs }))
                    showSnackbar({
                        severity: 'success',
                        children: 'Reject request',
                    })
                    setOpenModal(false)
                    setRequestId()
                    setChosenFileName('Chosen file')
                    formik.setValues({
                        leaveReason: '',
                        leaveType: '',
                        leaveDate: '',
                    })
                    setDateRange([
                        {
                            startDate: new Date(),
                            endDate: new Date(),
                            key: 'selection',
                        },
                    ])
                    setLeaveDays(0)
                    setLeaveDaysDate([])
                }
            })
            .catch((error) => {
                setLoadingRJButton(false)
            })
    }
    const createRows = () => {
      

        return ApplyLeaveList.map((item, index) => ({
            ...item,
            reason: (
                <Tooltip title={item.reason}>
                    <div>{item.reason.length > 5 ? item.reason.slice(0, 5) + '...' : item.reason}</div>
                </Tooltip>
            ),
            file: (
                <a className="mt-2 text-blue-400 underline" href={item.linkFile} target="_blank">
                    Link
                </a>
            ),
            days: item.numberOfLeaveDate,
            type: item.leaveType,
            leavePeriod: formatDate(item.startDate) + ' - ' + formatDate(item.endDate),
            applied: formatDate(item.submitDate),
            info: (
                <div className="flex gap-2 items-center ">
                    {' '}
                    {/* Added the class 'align-center' for centering */}
                    <p className="font-bold">{item.employeeName}</p>
                </div>
            ),
            number: index + 1,
            action: (
                <Tooltip title="Approve or Reject">
                    <div>
                        <IconButton onClick={() => handleClickOpenUpdate(item)}>
                            <VisibilityIcon />
                        </IconButton>
                    </div>
                </Tooltip>
            ),
            actionAll: (
                <Tooltip title="Delete">
                    <div>
                        <IconButton onClick={handleClickOpen}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </Tooltip>
            ),
            status:
                item.status == 1 ? (
                    <p className="text-green-500">Approved</p>
                ) : item.status == 2 ? (
                    <p className="text-red-500">Reject</p>
                ) : (
                    <p className="text-yellow-500">Pending</p>
                ),
        }))
    }

    const rows = createRows()

    const tabsData = [
        {
            label: `Pending Leave`,
            view: searchData(
                loading == true ? (
                    <TableLoadData columns={columnsPending} tableHeight={540} />
                ) : (
                    <TableData
                        tableHeight={480}
                        rows={rows}
                        columns={columnsPending}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )
            ),
        },
        {
            label: `Approved Leave`,
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
            label: `Reject Leave`,
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
            label: `All Leaves`,
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
                        </div>
                        <div className="my-2">
                            <div className="mb-1">
                                <strong className=" text-gray-500">Leave Dates</strong>{' '}
                                <i className="text-red-500">*</i>
                            </div>
                            <div>
                                <OutlinedInput
                                    type="text"
                                    aria-describedby={'simple-popover'}
                                    placeholder="Select Date Range"
                                    size="small"
                                    fullWidth
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
                            </div>

                       
                   
                    <div className="my-2 text-xs text-gray-400 ">
                            <h2>leave regulations</h2>
                            <p>-Register 2 working days in advance if the leave application is less than 3 days</p>
                            <p>-Register 5 working days in advance if the leave application is from 3 to 7 days</p>
                            <p>-Register 10 working days in advance if the leave application is 7 days or more</p>
                        </div>
                        <div className="bg-blue-100 relative">
                            <h2 className="font-medium m-4 text-lg text-gray-500">Your Leave Details</h2>
                            <div className="h-[280px]  px-4  overflow-auto">
                                {  leaveDaysDate.length < 1 ? (
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
                                    <div className="mb-1">
                                        <strong className=" text-gray-500">Manager Approve</strong>{' '}
                                    </div>
                                    <FormControl fullWidth>
                                        <TextField
                                            multiline
                                            id="outlined-basic"
                                            size="small"
                                            disabled
                                            className="bg-gray-300 text-black"
                                            value={'Đặng Hoàng Việt'}
                                            name="Manager Approve"
                                            variant="outlined"
                                            InputProps={{
                                                style: { color: 'black' },
                                            }}
                                        />
                                    </FormControl>
                                    {formik.errors.leaveReason && formik.touched.leaveReason && (
                                        <div className="text mt-1 text-red-600 font-semibold">
                                            {formik.errors.leaveReason}
                                        </div>
                                    )}
                                </div>
                           
                            <div className="my-2">
                                <div className="mb-1">
                                    <strong className=" text-gray-500">Total Leave</strong>{' '}
                                </div>
                                <FormControl fullWidth>
                                    <TextField
                                        multiline
                                        id="outlined-basic"
                                        size="small"
                                        disabled
                                        className="bg-gray-300 text-black"
                                        value={leaveDays}
                                        name="leaveReason"
                                        variant="outlined"
                                        InputProps={{
                                            style: { color: 'black' },
                                        }}
                                    />
                                </FormControl>
                                {formik.errors.leaveReason && formik.touched.leaveReason && (
                                    <div className="text mt-1 text-red-600 font-semibold">
                                        {formik.errors.leaveReason}
                                    </div>
                                )}
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
                                        error={
                                            formik.touched.leaveReason && formik.errors.leaveReason ? true : undefined
                                        }
                                        className="mt-2 w-full"
                                        value={formik.values.leaveReason}
                                        name="leaveReason"
                                        variant="outlined"
                                    />
                                </FormControl>
                            </div>
                            <div className="my-2 relative">
                                <div className="mb-1">
                                    <strong className=" text-gray-500">Chosen File</strong>{' '}
                                    <i className="text-red-500">*</i>
                                </div>

                                <a className="mt-2 text-blue-400 underline" href={chosenFileName} target="_blank">
                                    Link
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogActions>
                    <div className="flex gap-5">
                        <Button variant="contained" color="inherit" autoFocus onClick={clickOpenFalse}>
                            Cancel
                        </Button>
                        {userRole === 'Manager' ?
                        <Fragment>
                             <LoadingButton
                            onClick={handleClickReject}
                            loading={loadingRJButton}
                            variant="contained"
                            color="error"
                            sx={{
                                textAlign: 'center',
                            }}
                            autoFocus
                        >
                            Reject
                        </LoadingButton>
                        <LoadingButton
                            onClick={handleClickApprove}
                            loading={loadingButton}
                            variant="contained"
                            color="primary"
                            sx={{
                                textAlign: 'center',
                            }}
                            autoFocus
                        >
                            Approve
                        </LoadingButton>
                        </Fragment>
                        : ``}
                       
                    </div>
                </DialogActions>
            </form>
        </Fragment>
    )
   
    return (
        <div>
            {userRole === 'Manager' ? <Navbar /> : <NavbarHR />}
            <PopupData
                open={openModal}
                clickOpenFalse={clickOpenFalseModal}
                viewTitle={'Apply Leave Detail'}
                viewContent={viewModalContent}
                size="md"
            />
            <PopupConfirm open={open} clickOpenFalse={clickOpenFalse} />
            <div className="sm:ml-64 pt-20 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4">Manage Leave List </h2>
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
