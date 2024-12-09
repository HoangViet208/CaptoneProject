import React, { useState, useEffect } from 'react'

//mui

//icon
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import KeyIcon from '@mui/icons-material/Key'
import EventNoteIcon from '@mui/icons-material/EventNote'

//component
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import TabsData from '../../../Components/Tabs'
import General from '../EmployeeDetail/General'
import ChangePassword from './ChangePassword'
import TimeEntries from '../EmployeeDetail/TimeEntries'
import NavbarManager from '../Navbar'
import NavbarHR from '../NavbarHR'
import NavbarAdmin from '../../Admin/Navbar'
import Navbar from '../../Employee/Navbar'
import GeneralModal from '../EmployeeDetail/GeneralModal'

const breadcrumbIcons = () => {
    const data = [
        { title: 'Account Settings', icon: <BadgeIcon />, url: '/Profile', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

const tabsData = [
    {
        label: 'General',
        icon: <AccountBoxIcon />,
        view: <GeneralModal />,
    },
    {
        label: 'Change Password',
        icon: <KeyIcon />,
        view: <ChangePassword />,
    },
]

export default function Profile() {
    const [newNav, setNewNav] = useState(null)

    useEffect(() => {
        const userStringRole = localStorage.getItem('role')
        const role = JSON.parse(userStringRole)

        if (role) {
            if (role === 'Manager') {
                setNewNav(<NavbarManager />)
            } else if (role === 'User') {
                setNewNav(<Navbar />)
            } else if (role === 'HR') {
                setNewNav(<NavbarHR />)
            } else if (role === 'Admin') {
                setNewNav(<NavbarAdmin />)
            }
        }
    }, [])

    return (
        <div>
            {newNav}
            <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4">Account</h2>
                    <div className="mb-8 font-semibold">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                    </div>
                    <TabsData data={tabsData} />
                </div>
            </div>
        </div>
    )
}
