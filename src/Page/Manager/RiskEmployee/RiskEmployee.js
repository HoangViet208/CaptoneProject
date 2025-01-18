import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

//Mui
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

//Icon
import VisibilityIcon from '@mui/icons-material/Visibility'
import FemaleIcon from '@mui/icons-material/Female'
import MaleIcon from '@mui/icons-material/Male'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import FilterListIcon from '@mui/icons-material/FilterList'
import EmailIcon from '@mui/icons-material/Email'

//Component
import Search from '../../../Components/Search'
import TableData from '../../../Components/Table'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import { GetEmployeeRisk } from '../../../Api/EmployeeApi'
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material'
import NavbarHR from '../NavbarHR'

const columns = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Name', minWidth: 200, align: 'left' },
    { id: 'teamName', label: 'Team', minWidth: 200, align: 'left' },
    { id: 'action', label: 'Actions', minWidth: 50, align: 'center' },
]

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Risk Employee', icon: <BadgeIcon />, url: '/Employee', status: false },
    ]
    return data
}

const Detailcolumns = [
    { id: 'date', label: 'Number', minWidth: 100, align: 'center' },
    { id: 'lateMinutes', label: 'Late Minutes', minWidth: 100, align: 'left' },
    { id: 'earlyLeaveMinutes', label: 'Early Minutes', minWidth: 100, align: 'left' },
    { id: 'checkInTime', label: 'Check In Time', minWidth: 100, align: 'center' },
    { id: 'checkOutTime', label: 'Check Out Time', minWidth: 100, align: 'center' },
    { id: 'expectCheckIn', label: 'Expect Check In', minWidth: 100, align: 'center' },
    { id: 'expectCheckOut', label: 'Expect Check Out', minWidth: 100, align: 'center' },
]

const dataBreadcrumbs = breadcrumbIcons()

export default function RiskEmployee() {
    const [data, setData] = useState([])
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    const [open, setOpen] = useState(false)
    const [detailData, setDetailData] = useState([])
    const handleOpen = () => setOpen(true)

    const handleClose = () => setOpen(false)

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    }
    const [month, setMonth] = useState(currentMonth)
    const [year, setYear] = useState(currentYear)
    const handleMonthChange = (event) => {
        setMonth(event.target.value)
    }

    const handleYearChange = (event) => {
        setYear(event.target.value)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await GetEmployeeRisk(month, year)
                if (result) {
                    console.log(result)
                    setData(result.violatingEmployees)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [month, year])

    const createRows = () => {
        return data.map((item, index) => ({
            ...item,

            info: (
                <div className="flex gap-2 items-center ">
                    {' '}
                    {/* Added the class 'align-center' for centering */}
                    <p className="font-bold">{item.employeeName}</p>
                </div>
            ),
            teamName: (
                <div className="flex gap-2 items-center ">
                    {' '}
                    {/* Added the class 'align-center' for centering */}
                    <p className="font-bold">{item.teamName}</p>
                </div>
            ),
            number: index + 1,
            action: (
                <div
                    onClick={() => {
                        handleOpen()
                        setDetailData(item.violations)
                    }}
                    className="flex gap-2 justify-center"
                >
                    <Tooltip title="View Detail">
                        <IconButton>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        }))
    }

    const rows = createRows()
    const createDetailRows = () => {
        return detailData.map((item, index) => ({
            ...item,

            info: (
                <div className="flex gap-2 items-center ">
                    {' '}
                    {/* Added the class 'align-center' for centering */}
                    <p className="font-bold">{item.employeeName}</p>
                </div>
            ),
            teamName: (
                <div className="flex gap-2 items-center ">
                    {' '}
                    {/* Added the class 'align-center' for centering */}
                    <p className="font-bold">{item.teamName}</p>
                </div>
            ),
            number: index + 1,
            action: (
                <div onClick={() => handleOpen()} className="flex gap-2 justify-center">
                    <Tooltip title="View Detail">
                        <IconButton>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        }))
    }

    const rowsDetail = createDetailRows()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState('')
    const handleChangePage = (newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const [pageDetail, setPageDetail] = useState(0)
    const [rowsPerPageDetail, setRowsPerPageDetail] = useState(10)
    const handleChangePageDetail = (newPage) => {
        setPageDetail(newPage)
    }

    const handleChangeRowsPerPageDetail = (event) => {
        setRowsPerPageDetail(+event.target.value)
        setPageDetail(0)
    }
    const callbackSearch = (childData) => {
        setSearch(childData)
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Box sx={style}>
                    <Typography id="simple-modal-title" variant="h6" component="h2">
                        Detail Risk
                    </Typography>
                    <TableData
                        tableHeight={400}
                        rows={rowsDetail}
                        columns={Detailcolumns}
                        page={pageDetail}
                        rowsPerPage={rowsPerPageDetail}
                        handleChangePage={handleChangePageDetail}
                        handleChangeRowsPerPage={handleChangeRowsPerPageDetail}
                    />
                </Box>
            </Modal>
            <NavbarHR />
            <div className="sm:ml-64 h-screen pt-12 bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4">Risk Employee List </h2>

                    <div className="mb-8 font-semibold">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                    </div>
                    <div className="bg-white p-4">
                        <div className="mb-5 flex items-center">
                            <FormControl size={'small'} variant="outlined" sx={{ minWidth: 120, marginRight: 2 }}>
                                <InputLabel id="month-label">Month</InputLabel>
                                <Select
                                    labelId="month-label"
                                    id="month"
                                    value={month}
                                    onChange={handleMonthChange}
                                    label="Month"
                                    size="small"
                                >
                                    {[
                                        { label: 'January', value: 1 },
                                        { label: 'February', value: 2 },
                                        { label: 'March', value: 3 },
                                        { label: 'April', value: 4 },
                                        { label: 'May', value: 5 },
                                        { label: 'June', value: 6 },
                                        { label: 'July', value: 7 },
                                        { label: 'August', value: 8 },
                                        { label: 'September', value: 9 },
                                        { label: 'October', value: 10 },
                                        { label: 'November', value: 11 },
                                        { label: 'December', value: 12 },
                                    ].map((month) => (
                                        <MenuItem key={month.value} value={month.value}>
                                            {month.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl size={'small'} variant="outlined" sx={{ minWidth: 120 }}>
                                <InputLabel id="year-label">Year</InputLabel>
                                <Select
                                    labelId="year-label"
                                    id="year"
                                    value={year}
                                    onChange={handleYearChange}
                                    label="Year"
                                    size={'small'}
                                >
                                    {Array.from(new Array(50), (v, i) => new Date().getFullYear() - i).map((y) => (
                                        <MenuItem key={y} value={y}>
                                            {y}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <TableData
                                tableHeight={400}
                                rows={rows}
                                columns={columns}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
