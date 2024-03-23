import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

//Mui
import { Avatar, IconButton, Tooltip } from '@mui/material'

//Icon
import VisibilityIcon from '@mui/icons-material/Visibility'
import FemaleIcon from '@mui/icons-material/Female'
import MaleIcon from '@mui/icons-material/Male'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import FilterListIcon from '@mui/icons-material/FilterList'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'

//Component
import Search from '../../../Components/Search'
import TableData from '../../../Components/Table'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'

//redux
import { getEmployeeAsyncApi, getEmployeeByIdAsyncApi } from '../../../Redux/Employee/employeeSlice'

const columns = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'email', label: 'Email', minWidth: 200, align: 'left' },
    { id: 'info', label: 'Name', minWidth: 200, align: 'left' },
    { id: 'departmentName', label: 'Team', minWidth: 250, align: 'left' },
    { id: 'address', label: 'Address', minWidth: 250, align: 'left' },
    { id: 'phoneNumber', label: 'Phone Number', minWidth: 150, align: 'left' },
    { id: 'gender', label: 'Gender', minWidth: 50, align: 'center' },
    { id: 'status', label: 'Status', minWidth: 50, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 50, align: 'center' },
]

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Employee', icon: <BadgeIcon />, url: '/Employee', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

export default function Employee() {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState('')
    const { EmployeeList } = useSelector((state) => state.employee)
    const dispatch = useDispatch()
    useEffect(() => {
        const userStringEmployeeName = localStorage.getItem('employeeId')
        const employeeId = JSON.parse(userStringEmployeeName)
        dispatch(getEmployeeByIdAsyncApi(employeeId)).then((response) => {
            if (response.meta.requestStatus == 'fulfilled') {
                console.log('effect', response)
                dispatch(getEmployeeAsyncApi({ roleId: '', departmentId: response.payload.departmentId, name: search }))
            }
        })

        return () => {}
    }, [search])
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
    const createRows = () => {
        return EmployeeList.map((item, index) => ({
            ...item,
            email: (
                <button className="flex items-center gap-2 border-[1px] rounded-full py-2 px-3">
                    <EmailIcon className="w-8 h-8" />
                    {item.email}
                </button>
            ),
            // address: item.address.length > 20 ? item.address.slice(0, 35) + '...' : item.address,
            info: (
                <div className="flex gap-2 items-center ">
                    {' '}
                    {/* Added the class 'align-center' for centering */}
                    <p className="font-bold">{item.firstName + ' ' + item.lastName}</p>
                </div>
            ),
            status: <button className="bg-green-300 text-green-600 font-semibold py-1 px-2 rounded-xl">Active</button>,
            number: index + 1,
            action: (
                <div className="flex gap-2 justify-center">
                    <NavLink
                        to={`/Manager/Employee/Detail/${item.id}`}
                        activeStyle={{
                            background: '#dbeafe',
                            color: '#2563eb',
                        }}
                        exact
                        className="cursor-pointer"
                    >
                        <Tooltip title="View Detail">
                            <IconButton>
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                    </NavLink>
                    <Tooltip title="Delete">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
            gender: item.gender === 'Female' ? <FemaleIcon /> : <MaleIcon />,
        }))
    }
    const rows = createRows()

    return (
        <div>
            <Navbar />
            <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4"> Employee List </h2>
                    <div className="mb-8 font-semibold">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                    </div>
                    <div className="bg-white p-4">
                        <div className="mb-5 flex items-center">
                            <Search parentCallback={callbackSearch} />
                            <div className="ml-auto md:mr-16 mr-4"></div>
                        </div>
                        <div>
                            <TableData
                                tableHeight={520}
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
